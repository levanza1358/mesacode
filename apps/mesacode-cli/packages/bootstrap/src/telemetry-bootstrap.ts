import { getCapturedMesacodeAgentTelemetryEnv } from "@mesacode/shared";
import {
  prepareModelTelemetryEnv,
  shutdownPreparedModelTelemetry,
  type PrepareModelTelemetryOptions,
} from "@mesacode/telemetry";

/**
 * 官方 CLI 异步入口在创建同步 App 之前调用；只把准备出的 device MID 放回业务 env，
 * OTLP Header 等私密配置仍保留在进程内捕获区，不进入 Tool/MCP 子进程环境。
 */
export async function prepareMesacodeTelemetryEnv(
  env: NodeJS.ProcessEnv = process.env,
  options: PrepareModelTelemetryOptions = {},
): Promise<NodeJS.ProcessEnv> {
  const prepared = await prepareModelTelemetryEnv({
    ...getCapturedMesacodeAgentTelemetryEnv(),
    ...env,
  }, {
    ...options,
    productVersion: options.productVersion ?? env.MESACODE_APP_VERSION,
  });
  const deviceMid = prepared.MESACODE_TELEMETRY_DEVICE_MID;
  return deviceMid ? { ...env, MESACODE_TELEMETRY_DEVICE_MID: deviceMid } : env;
}

/**
 * 与 prepareMesacodeTelemetryEnv 对称地关闭当前进程持有的 Telemetry Owner。
 * 单个 App/Session 只允许 flush；只有最外层可执行入口可以调用本函数。
 */
export async function shutdownMesacodeTelemetry(): Promise<void> {
  await shutdownPreparedModelTelemetry();
}
