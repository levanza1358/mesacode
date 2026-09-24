import {
  ProviderConfigService,
  type ProviderConfigLayerSnapshot,
  type ProviderConfigLayerUpdate,
} from "@mesacode/provider";
import { NodeMesacodeBuiltinProviderConfigSource } from "./mesacode-builtin-provider-config-source.js";
import {
  EndpointScopedMesacodeBuiltinSource,
  type EndpointScopedMesacodeBuiltinSourceOptions,
} from "./endpoint-scoped-mesacode-builtin-source.js";
import {
  MesacodeBuiltinRemoteSynchronizer,
  type MesacodeBuiltinRemoteSynchronizerOptions,
  type MesacodeBuiltinRefreshResult,
} from "./mesacode-builtin-remote-synchronizer.js";
import {
  NodePersonalProviderConfigRepository,
  type PersonalProviderConfigRecoveryEvent,
} from "./personal-provider-config-repository.js";

export interface NodeProviderConfigRuntimeOptions {
  readonly mesacodeBuiltinFilePath: string;
  readonly mesacodeBuiltinActiveFilePath?: string;
  readonly mesacodeBuiltinRemote?: Omit<MesacodeBuiltinRemoteSynchronizerOptions, "source">;
  readonly mesacodeBuiltinEnvironment?: Omit<
    EndpointScopedMesacodeBuiltinSourceOptions,
    "bundledFilePath"
  >;
  readonly onMesacodeBuiltinRefreshError?: (error: unknown) => void;
  readonly onPersonalConfigRecovery?: (event: PersonalProviderConfigRecoveryEvent) => void;
  readonly onPersonalConfigPollingError?: (error: unknown) => void;
  readonly personalFilePath: string;
  readonly personalPollingIntervalMs?: number | false;
  readonly importLegacy?: (
    mesacodeBuiltin: ProviderConfigLayerSnapshot,
  ) => Promise<ProviderConfigLayerUpdate | null>;
  readonly watch?: boolean;
}

/** 组装一个 Node.js 进程内共享的 Mesacode Built-in/Personal Config 运行边界。 */
export class NodeProviderConfigRuntime {
  readonly configService: ProviderConfigService;
  readonly #mesacodeBuiltinSource:
    | NodeMesacodeBuiltinProviderConfigSource
    | EndpointScopedMesacodeBuiltinSource;
  readonly #personalRepository: NodePersonalProviderConfigRepository;
  readonly #remoteSynchronizer?: MesacodeBuiltinRemoteSynchronizer;
  readonly #onRemoteRefreshError?: (error: unknown) => void;
  #startPromise: Promise<void> | null = null;
  #disposed = false;
  readonly #checkListeners = new Set<() => Promise<void>>();
  #checkTimer: ReturnType<typeof setInterval> | null = null;
  #checkInFlight: Promise<void> | null = null;

  constructor(options: NodeProviderConfigRuntimeOptions) {
    this.#mesacodeBuiltinSource = options.mesacodeBuiltinEnvironment
      ? new EndpointScopedMesacodeBuiltinSource({
          bundledFilePath: options.mesacodeBuiltinFilePath,
          ...options.mesacodeBuiltinEnvironment,
        })
      : new NodeMesacodeBuiltinProviderConfigSource({
          bundledFilePath: options.mesacodeBuiltinFilePath,
          activeFilePath: options.mesacodeBuiltinActiveFilePath,
          watch: options.watch,
        });
    this.#remoteSynchronizer =
      options.mesacodeBuiltinRemote &&
      this.#mesacodeBuiltinSource instanceof NodeMesacodeBuiltinProviderConfigSource
        ? new MesacodeBuiltinRemoteSynchronizer({
            source: this.#mesacodeBuiltinSource,
            ...options.mesacodeBuiltinRemote,
          })
        : undefined;
    this.#onRemoteRefreshError = options.onMesacodeBuiltinRefreshError;
    this.#personalRepository = new NodePersonalProviderConfigRepository({
      filePath: options.personalFilePath,
      onRecovery: options.onPersonalConfigRecovery,
      onPollingError: options.onPersonalConfigPollingError,
      pollingIntervalMs: options.personalPollingIntervalMs,
      ...(options.importLegacy
        ? {
            importLegacy: async () => options.importLegacy!(await this.#mesacodeBuiltinSource.read()),
          }
        : {}),
    });
    this.configService = new ProviderConfigService({
      mesacodeBuiltinSource: this.#mesacodeBuiltinSource,
      personalRepository: this.#personalRepository,
    });
  }

  resolveMesacodeBuiltinActiveFilePath(): Promise<string> {
    return this.#mesacodeBuiltinSource instanceof NodeMesacodeBuiltinProviderConfigSource
      ? Promise.resolve(this.#mesacodeBuiltinSource.activeFilePath)
      : this.#mesacodeBuiltinSource.resolveActiveFilePath();
  }

  get personalRepository(): import("@mesacode/provider").PersonalProviderConfigRepository {
    return this.#personalRepository;
  }

  /** Environment 同一周期检查中恢复未对齐依赖，不被下载 TTL 或失败挡住。 */
  onDidCheckMesacodeBuiltin(listener: () => Promise<void>): () => void {
    this.#checkListeners.add(listener);
    return () => this.#checkListeners.delete(listener);
  }

  start(): Promise<void> {
    if (this.#disposed) throw new Error("NodeProviderConfigRuntime 已 dispose");
    if (this.#startPromise) return this.#startPromise;
    const startPromise = this.configService.read().then(() => {
      if (this.#disposed) return;
      void this.#checkBackground();
      // Managed Worker 无下载配置也无恢复 owner，不建立周期任务。
      if (
        this.#remoteSynchronizer ||
        this.#mesacodeBuiltinSource instanceof EndpointScopedMesacodeBuiltinSource ||
        this.#checkListeners.size > 0
      ) {
        this.#checkTimer = setInterval(() => {
          void this.#checkBackground();
        }, 60_000);
        this.#checkTimer.unref?.();
      }
    });
    this.#startPromise = startPromise;
    void startPromise.catch(() => {
      if (this.#startPromise === startPromise) this.#startPromise = null;
    });
    return startPromise;
  }

  refreshMesacodeBuiltin(options?: { readonly force?: boolean }): Promise<MesacodeBuiltinRefreshResult> {
    if (this.#disposed) return Promise.resolve("disposed");
    if (this.#mesacodeBuiltinSource instanceof EndpointScopedMesacodeBuiltinSource) {
      return this.#mesacodeBuiltinSource.refresh(options);
    }
    return this.#remoteSynchronizer?.refresh(options) ?? Promise.resolve("skipped");
  }

  #checkBackground(): Promise<void> {
    if (this.#disposed) return Promise.resolve();
    if (this.#checkInFlight) return this.#checkInFlight;
    const check = Promise.allSettled([
      this.refreshMesacodeBuiltin(),
      ...[...this.#checkListeners].map((listener) => Promise.resolve().then(listener)),
    ])
      .then((results) => {
        if (this.#disposed) return;
        for (const result of results)
          if (result.status === "rejected") this.#onRemoteRefreshError?.(result.reason);
      })
      .finally(() => {
        if (this.#checkInFlight === check) this.#checkInFlight = null;
      });
    this.#checkInFlight = check;
    return check;
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    if (this.#checkTimer) clearInterval(this.#checkTimer);
    this.#checkTimer = null;
    this.#checkListeners.clear();
    this.#remoteSynchronizer?.dispose();
    this.configService.dispose();
    this.#personalRepository.dispose();
    this.#mesacodeBuiltinSource.dispose();
  }
}

export function createNodeProviderConfigRuntime(
  options: NodeProviderConfigRuntimeOptions,
): NodeProviderConfigRuntime {
  return new NodeProviderConfigRuntime(options);
}
