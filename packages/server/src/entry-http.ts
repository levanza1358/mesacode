import { createLocalServices, getAppConfigDir } from "@mesacode/services/node";
import {
  materializeBundledMesacodeBuiltinProviderConfig,
  readBundledMesacodeBuiltinProviderConfig,
} from "./bundledMesacodeBuiltinProviderConfig.js";
import { createHttpServer } from "./http.js";

async function main(): Promise<void> {
  const mesacodeBuiltinProviderConfigFilePath = await materializeBundledMesacodeBuiltinProviderConfig({
    environmentConfigRoot: getAppConfigDir(),
    content: readBundledMesacodeBuiltinProviderConfig(),
  });
  const port = Number(process.env["PORT"]) || 3030;
  const host = process.env["MESACODE_SERVER_HOST"]?.trim() || process.env["HOST"]?.trim() || undefined;
  const staticRoot = process.env["MESACODE_WEB_STATIC_ROOT"]?.trim() || undefined;
  const authToken = process.env["MESACODE_SERVER_AUTH_TOKEN"]?.trim() || undefined;
  const services = createLocalServices({
    mesacodeBuiltinProviderConfigFilePath,
    providerProvisioningTargetEnabled: Boolean(authToken),
  });

  createHttpServer(services, port, {
    ...(host ? { host } : {}),
    ...(staticRoot ? { staticRoot, spaFallback: true } : {}),
    ...(authToken ? { authToken, authRequired: true } : {}),
  });
}

void main().catch((error: unknown) => {
  console.error("[mesacode-server:http] startup failed", error);
  process.exitCode = 1;
});
