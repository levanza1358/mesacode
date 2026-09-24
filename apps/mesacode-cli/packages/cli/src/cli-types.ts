import type { TuiReadClipboardImage, TuiWriteClipboardText } from "@mesacode/tui";
import type { UiLocale } from "@mesacode/i18n";
import type { Logger } from "@mesacode/contracts";
import type {
  createManagedCdpBrowserRuntime,
  ManagedCdpBrowserRuntimeOptions,
} from "@mesacode/adapters/browser";
import type {
  createModelAdapter,
  createMesacodeApp,
  CreateModelAdapterOptions,
  configureCodingPlanApiKey,
  ConfigureCodingPlanApiKeyOptions,
  inspectMesacodeSkill,
  inspectWorkspaceHookTrust,
  grantWorkspaceHookTrust,
  revokeWorkspaceHookTrustCli,
  inspectMesacodeCustomCommand,
  InspectMesacodeCustomCommandOptions,
  InspectMesacodeSkillOptions,
  loginMesacodeCli,
  loginBigmodelCodingPlan,
  LoginBigmodelCodingPlanOptions,
  LoginMesacodeCliOptions,
  listMesacodeCustomCommands,
  ListMesacodeCustomCommandsOptions,
  loadMesacodeCustomCommand,
  listMesacodeSessions,
  listMesacodeSkills,
  ListMesacodeSessionsOptions,
  ListMesacodeSkillsOptions,
  logoutMesacodeCli,
  LogoutMesacodeCliOptions,
  resolveLatestSession,
  ResolveLatestSessionOptions,
  RunMesacodeProtocolAgentOptions,
  prepareMesacodeTelemetryEnv,
  startProcessProviderRegistryRuntime,
  shutdownMesacodeTelemetry,
  MesacodeAppOptions,
} from "@mesacode/bootstrap";
import type { CliEnv, DotenvLoadResult, LoadCliDotenvOptions } from "./env.js";
import type { PluginsCommandOverrides } from "./plugins-command.js";
import type { CliShutdownProcess } from "./shutdown.js";
import type { resolveWorkspaceGitBranch } from "./tui-workspace-git.js";

export type BootstrapModule = typeof import("@mesacode/bootstrap");

export interface RunDependencies extends PluginsCommandOverrides {
  protocolLifecycle?: RunMesacodeProtocolAgentOptions["lifecycle"];
  protocolInput?: NodeJS.ReadableStream;
  createManagedCdpBrowserRuntime?: (
    options?: ManagedCdpBrowserRuntimeOptions,
  ) => ReturnType<typeof createManagedCdpBrowserRuntime>;
  createModelAdapter?: (
    options?: CreateModelAdapterOptions,
  ) => ReturnType<typeof createModelAdapter>;
  createMesacodeApp?: (
    options?: MesacodeAppOptions,
  ) => Awaited<ReturnType<typeof createMesacodeApp>> | ReturnType<typeof createMesacodeApp>;
  /**
   * Session-event shaper for --output-format stream-json. Defaults to the
   * bootstrap module's, which is also what the protocol server uses; injectable
   * so a caller that supplies its own `createMesacodeApp` (tests, embedders) can
   * still stream, since the bootstrap module is not loaded on that path.
   */
  mapSessionEvent?: BootstrapModule["mapSessionEvent"];
  cwd?: () => string;
  env?: CliEnv;
  inspectSkill?: (options: InspectMesacodeSkillOptions) => ReturnType<typeof inspectMesacodeSkill>;
  inspectWorkspaceHookTrust?: typeof inspectWorkspaceHookTrust;
  grantWorkspaceHookTrust?: typeof grantWorkspaceHookTrust;
  revokeWorkspaceHookTrustCli?: typeof revokeWorkspaceHookTrustCli;
  inspectCustomCommand?: (
    options: InspectMesacodeCustomCommandOptions,
  ) => ReturnType<typeof inspectMesacodeCustomCommand>;
  loginMesacodeCli?: (options?: LoginMesacodeCliOptions) => ReturnType<typeof loginMesacodeCli>;
  loginBigmodelCodingPlan?: (
    options?: LoginBigmodelCodingPlanOptions,
  ) => ReturnType<typeof loginBigmodelCodingPlan>;
  configureCodingPlanApiKey?: (
    options: ConfigureCodingPlanApiKeyOptions,
  ) => ReturnType<typeof configureCodingPlanApiKey>;
  loadDotenv?: (options?: LoadCliDotenvOptions) => DotenvLoadResult;
  prepareMesacodeTelemetryEnv?: typeof prepareMesacodeTelemetryEnv;
  projectConfigPath?: string;
  listSessions?: (options: ListMesacodeSessionsOptions) => ReturnType<typeof listMesacodeSessions>;
  listCustomCommands?: (
    options: ListMesacodeCustomCommandsOptions,
  ) => ReturnType<typeof listMesacodeCustomCommands>;
  loadCustomCommand?: (
    options: InspectMesacodeCustomCommandOptions,
  ) => ReturnType<typeof loadMesacodeCustomCommand>;
  // headless slash 路由要和 app facade 的保留名 gate 用同一个判据；默认取 bootstrap 的，
  // 注入点只为让单测不必拉起整个 bootstrap 模块。见 prompt-command.ts。
  isReservedSlashCommandName?: BootstrapModule["isReservedMesacodeSlashCommandName"];
  listSkills?: (options: ListMesacodeSkillsOptions) => ReturnType<typeof listMesacodeSkills>;
  logger?: Logger;
  readClipboardImage?: TuiReadClipboardImage;
  writeClipboardText?: TuiWriteClipboardText;
  resolveLatestSession?: (
    options: ResolveLatestSessionOptions,
  ) => ReturnType<typeof resolveLatestSession>;
  resolveWorkspaceGitBranch?: typeof resolveWorkspaceGitBranch;
  logoutMesacodeCli?: (options?: LogoutMesacodeCliOptions) => ReturnType<typeof logoutMesacodeCli>;
  runMesacodeProtocolAgent?: (options?: RunMesacodeProtocolAgentOptions) => Promise<void>;
  runTui?: typeof import("@mesacode/tui").runTui;
  skipUserConfig?: boolean;
  userConfigPath?: string;
  exitProcess?: (code: number) => void;
  shutdownCleanupTimeoutMs?: number;
  shutdownProcess?: CliShutdownProcess;
  startProcessProviderRegistryRuntime?: typeof startProcessProviderRegistryRuntime;
  shutdownMesacodeTelemetry?: typeof shutdownMesacodeTelemetry;
}

export type CliPermissionMode = "build" | "plan" | "edit" | "yolo";
export type CliRuntimeMode = CliPermissionMode | "auto";

export interface CliModeState {
  current?: CliRuntimeMode;
  override?: CliPermissionMode;
}

export interface CliTargetRequest {
  objective: string;
  replaceExisting: boolean;
}

export type ModeCapableApp = Awaited<ReturnType<typeof createMesacodeApp>> & {
  getMode?: () => CliRuntimeMode;
  setLocale?: (locale: UiLocale) => Promise<{ locale: "en-US" | "zh-CN" }>;
  setMode?: (mode: CliRuntimeMode) => Promise<{ mode: CliRuntimeMode }>;
};

export interface CliResumeRequest {
  continueSession: boolean;
  resumeSessionId?: string;
}
