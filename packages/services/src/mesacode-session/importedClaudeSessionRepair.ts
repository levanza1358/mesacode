import type { MesacodeSessionStateSnapshot } from "@mesacode/shared";
import { createServiceLogger } from "#src/logger/serviceLogger.js";
import { repairImportedClaudeSessionSnapshot } from "#src/session/claude-native/importedClaudeHistoryRepair.js";
import type { IMesacodeAgentService } from "#src/mesacode-agent/mesacodeAgent.js";
import type {
  MesacodeSessionReadParams,
  MesacodeSessionResumeParams,
} from "#src/mesacode-session/mesacodeSession.js";

const logger = createServiceLogger("mesacode-session-service");

export async function repairEmptyImportedClaudeSessionSnapshot(params: {
  agentService: IMesacodeAgentService;
  snapshot: MesacodeSessionStateSnapshot;
  target: MesacodeSessionResumeParams | MesacodeSessionReadParams;
}): Promise<MesacodeSessionStateSnapshot> {
  const repaired = await repairImportedClaudeSessionSnapshot({
    snapshot: params.snapshot,
    target: {
      workspacePath: params.target.workspacePath,
      workspaceIdentity: params.target.workspaceIdentity,
      taskId: params.target.sessionId,
      ...("mcpServers" in params.target && params.target.mcpServers
        ? { mcpServers: params.target.mcpServers }
        : {}),
    },
    createSession: (input) => params.agentService.createSession(input),
    onRepair: (history) => {
      logger.warn(
        undefined,
        `[mesacode-session-service] Claude 导入 session 历史异常，按 ${history.source} 回填 taskId=${params.target.sessionId}`,
      );
    },
  });
  return repaired ?? params.snapshot;
}
