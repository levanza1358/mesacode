/**
 * Mesacode Agent Slash Commands 便捷 hook
 *
 * 返回当前 workspace 下 Agent 广播的可用 slash commands 列表。
 */
import { useMesacodeSessionStore, selectWorkspaceMesacodeState } from "../store/mesacodeSessionStore.js";

export function useSlashCommands(workspacePath: string, workspaceIdentity?: string) {
  return useMesacodeSessionStore(
    (state) => selectWorkspaceMesacodeState(state, workspacePath, workspaceIdentity).slashCommands,
  );
}
