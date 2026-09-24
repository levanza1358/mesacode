import {
  buildRuntimeMesacodeEndpointUrls,
  MESACODE_ENV,
  type RuntimeMesacodeEndpointEnv,
} from "@mesacode/shared";

interface RendererImportMetaEnv {
  VITE_MESACODE_BASE_URL?: string;
  VITE_MESACODE_ENDPOINT_ORIGIN?: string;
}

function readRendererImportMetaEnv(): RendererImportMetaEnv {
  return ((import.meta as ImportMeta & { env?: RendererImportMetaEnv }).env ??
    {}) as RendererImportMetaEnv;
}

function createRendererMesacodeEndpointEnv(
  env: RendererImportMetaEnv = readRendererImportMetaEnv(),
): RuntimeMesacodeEndpointEnv {
  return {
    MESACODE_ENV,
    // UI 侧的 mesacode-plan 占位 provider 以前只看 MESACODE_ENV，
    // 没有消费 Vite 注入的 base url，导致自定义测试域名时 renderer 和 host/service 可能不一致。
    MESACODE_BASE_URL: env.VITE_MESACODE_BASE_URL,
    MESACODE_ENDPOINT_ORIGIN: env.VITE_MESACODE_ENDPOINT_ORIGIN,
  };
}

export const RENDERER_MESACODE_ENDPOINT_URLS = buildRuntimeMesacodeEndpointUrls(
  createRendererMesacodeEndpointEnv(),
);
