import { downloadMesacodeBuiltinRelease, type MesacodeBuiltinRelease } from "@mesacode/provider-node";
import type { ApiClient } from "@mesacode/shared";

interface FetchMesacodeBuiltinRemoteReleaseOptions {
  readonly apiClient: ApiClient;
  readonly endpointOrigin: string;
  readonly appVersion: string;
  readonly platform: string;
  readonly signal?: AbortSignal;
}

/** Services 仅注入既有网络装配；URL、预算与 Release 校验由 provider-node 唯一实现。 */
export async function fetchMesacodeBuiltinRemoteRelease(
  options: FetchMesacodeBuiltinRemoteReleaseOptions,
): Promise<MesacodeBuiltinRelease | null> {
  return downloadMesacodeBuiltinRelease({
    endpointOrigin: options.endpointOrigin,
    appVersion: options.appVersion,
    platform: options.platform,
    signal: options.signal,
    request: (url, init) => options.apiClient.request(url, init),
  });
}
