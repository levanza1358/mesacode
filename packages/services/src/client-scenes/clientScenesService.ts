import type { ApiClient } from "@mesacode/shared";
import { readApiJson } from "../providers/api/apiJson.js";
import { MESACODE_CLIENT_SCENES_URL } from "../providers/api/apiEndpoints.js";
import type { ClientScenesResponse, IClientScenesService } from "./clientScenes.js";

export function createClientScenesService(dependencies: {
  apiClient: ApiClient;
}): IClientScenesService {
  return {
    list: () =>
      readApiJson<ClientScenesResponse>(dependencies.apiClient, MESACODE_CLIENT_SCENES_URL, {
        method: "GET",
      }),
  };
}
