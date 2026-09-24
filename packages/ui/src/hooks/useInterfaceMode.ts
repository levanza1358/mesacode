import { useMesacodeStoreWithDefault } from "@/store/StoreProvider.js";

export function useIsOfficeMode(): boolean {
  return useMesacodeStoreWithDefault((state) => state.interfaceMode === "office", false);
}
