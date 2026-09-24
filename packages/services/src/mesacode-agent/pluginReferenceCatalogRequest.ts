import {
  mesacodeProtocolMethods,
  mesacodePluginsReferenceCatalogResultSchema,
  type MesacodePluginsReferenceCatalogParams,
} from "@mesacode/shared";
import type { MesacodeProtocolClient } from "#src/mesacode-agent/mesacodeProtocolClient.js";

/** 旧协议严格校验响应；新展示字段走独立入口，只有 -32601 能证明旧 Agent 不支持。 */
export async function requestPluginReferenceCatalog(
  client: Pick<MesacodeProtocolClient, "request">,
  params: MesacodePluginsReferenceCatalogParams,
) {
  try {
    return await client.request(
      mesacodeProtocolMethods.pluginsReferenceCatalogWithCategory,
      params,
      mesacodePluginsReferenceCatalogResultSchema,
    );
  } catch (error) {
    if (!(typeof error === "object" && error !== null && "code" in error && error.code === -32601))
      throw error;
    return client.request(
      mesacodeProtocolMethods.pluginsReferenceCatalog,
      params,
      mesacodePluginsReferenceCatalogResultSchema,
    );
  }
}
