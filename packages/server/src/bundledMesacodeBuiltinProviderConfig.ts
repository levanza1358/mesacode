import { materializeMesacodeBuiltinProviderConfig } from "@mesacode/services/node";

declare const __MESACODE_BUILTIN_PROVIDER_CONFIG_JSON__: string | undefined;

interface MaterializeBundledMesacodeBuiltinProviderConfigOptions {
  readonly environmentConfigRoot: string;
  readonly content: string;
}

/** 返回构建时嵌入远端 Server 的 Mesacode Built-in Provider Config。 */
export function readBundledMesacodeBuiltinProviderConfig(): string {
  if (typeof __MESACODE_BUILTIN_PROVIDER_CONFIG_JSON__ !== "string") {
    throw new Error("当前构建未嵌入 Mesacode Built-in Provider Config");
  }
  return __MESACODE_BUILTIN_PROVIDER_CONFIG_JSON__;
}

/**
 * 将 Mesacode Built-in Config 原子物化到所属环境的固定资源副本。
 * 升级前退出旧进程；不保留按内容 hash 增长的历史文件。
 */
export async function materializeBundledMesacodeBuiltinProviderConfig(
  options: MaterializeBundledMesacodeBuiltinProviderConfigOptions,
): Promise<string> {
  return materializeMesacodeBuiltinProviderConfig(options);
}
