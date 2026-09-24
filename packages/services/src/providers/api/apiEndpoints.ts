import { buildRuntimeMesacodeApiUrl, resolveZaiBusinessBaseUrl } from "@mesacode/shared";

export const MESACODE_CLIENT_SCENES_URL = buildRuntimeMesacodeApiUrl(
  process.env,
  "/api/v1/client/scenes",
);

export const ZAI_API_HOST = resolveZaiBusinessBaseUrl(process.env);
