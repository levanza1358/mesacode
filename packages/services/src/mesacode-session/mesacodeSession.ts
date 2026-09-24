import { ServiceChannels } from "@mesacode/shared";
import type {
  TraceId,
  MesacodeAgentMcpServer,
  MesacodeDeliveryKind,
  MesacodeMessageWithParts,
  ModelSelection,
  MesacodePermissionRequestParams,
  MesacodeUserInputRequestParams,
  MesacodeUserInputResponse,
  MesacodeSessionInfo,
  MesacodeSessionImportHistory,
  MesacodeSessionEvent,
  MesacodeSessionMode,
  MesacodeSessionPersistence,
  MesacodeSessionStateSnapshot,
  MesacodeStateUpdatedNotification,
  MesacodeWorkspacePresentation,
} from "@mesacode/shared";
import { createServiceDescriptor } from "#src/descriptors.js";

export interface MesacodeSessionWorkspaceTarget {
  workspacePath: string;
  workspaceIdentity?: string;
  remoteSessionId?: string;
}

export type MesacodeSessionReadWorkspacePresentationParams = MesacodeSessionWorkspaceTarget;

export interface MesacodeTaskTarget extends MesacodeSessionWorkspaceTarget {
  sessionId: string;
}

export interface MesacodeSessionCreateParams extends MesacodeSessionWorkspaceTarget {
  /** 仅导入事务使用的预分配 ID；普通新会话继续由 Agent 分配。 */
  sessionId?: string;
  sessionTraceId?: TraceId;
  parentSessionId?: string;
  mode?: MesacodeSessionMode;
  model?: ModelSelection;
  persistence?: MesacodeSessionPersistence;
  thoughtLevel?: string;
  mcpServers?: MesacodeAgentMcpServer[];
  importedHistory?: MesacodeSessionImportHistory;
}

export interface MesacodeSessionResumeParams extends MesacodeTaskTarget {
  model?: ModelSelection;
  thoughtLevel?: string;
  mcpServers?: MesacodeAgentMcpServer[];
  /**
   * 默认广播 resume 得到的历史快照，并让 shadow 订阅请求初始 snapshot。
   * 续聊发送前的 runtime 预恢复会关闭它，避免旧终态快照覆盖本地已开始的新输入运行态。
   */
  broadcastSnapshot?: boolean;
}

export interface MesacodeSessionListParams extends MesacodeSessionWorkspaceTarget {
  includeArchived?: boolean;
  limit?: number;
}

export interface MesacodeSessionReadParams extends MesacodeTaskTarget {
  deliveryKind?: MesacodeDeliveryKind;
  messageLimit?: number;
  afterSeq?: number;
}

export interface MesacodeSessionMessagesParams extends MesacodeTaskTarget {
  afterMessageId?: string;
  limit?: number;
}

export interface MesacodeSessionEventsParams extends MesacodeTaskTarget {
  afterSeq?: number;
  limit?: number;
}

export interface MesacodeSessionSetModelParams extends MesacodeTaskTarget {
  model: ModelSelection;
  expectedRevision?: number;
  persistAsWorkspaceLastUsed?: boolean;
}

export interface MesacodeSessionSetThoughtLevelParams extends MesacodeTaskTarget {
  thoughtLevel?: string;
  expectedRevision?: number;
  persistAsWorkspaceLastUsed?: boolean;
}

export interface MesacodeSessionSetModeParams extends MesacodeTaskTarget {
  mode: MesacodeSessionMode;
  expectedRevision?: number;
}

export interface MesacodeSessionSubscribeParams extends MesacodeTaskTarget {
  deliveryKind: MesacodeDeliveryKind;
  afterSeq?: number;
  includeSnapshot?: boolean;
  eventCoalescing?: {
    mode: "background-summary";
    intervalMs?: number;
  };
}

export type MesacodeSessionServiceEvent =
  | { type: "session.event"; event: MesacodeSessionEvent }
  | { type: "state.updated"; notification: MesacodeStateUpdatedNotification }
  | { type: "permission.request"; request: MesacodePermissionRequestParams }
  | { type: "userInput.request"; request: MesacodeUserInputRequestParams }
  | {
      type: "userInput.response";
      requestId: string;
      response: MesacodeUserInputResponse;
    }
  | { type: "snapshot"; snapshot: MesacodeSessionStateSnapshot };

export interface MesacodeSessionInitializeResult {
  available: boolean;
  workspaceKey: string;
  protocolName?: string;
  protocolVersion?: number;
  transportKind?: "stdio" | "websocket";
  reason?: string;
  reasonCode?: "provider_not_ready";
}

export interface MesacodeSessionWorkspaceRuntimeIdentity {
  generation: number;
  identity: string;
  processId?: number;
  workspaceKey: string;
}

export interface IMesacodeSessionService {
  initializeWorkspace(params: MesacodeSessionWorkspaceTarget): Promise<MesacodeSessionInitializeResult>;
  getWorkspaceRuntimeIdentity(
    params: MesacodeSessionWorkspaceTarget,
  ): Promise<MesacodeSessionWorkspaceRuntimeIdentity>;
  readWorkspacePresentation(
    params: MesacodeSessionReadWorkspacePresentationParams,
  ): Promise<MesacodeWorkspacePresentation>;
  createSession(params: MesacodeSessionCreateParams): Promise<MesacodeSessionStateSnapshot>;
  resumeSession(params: MesacodeSessionResumeParams): Promise<MesacodeSessionStateSnapshot>;
  listSessions(params: MesacodeSessionListParams): Promise<MesacodeSessionInfo[]>;
  readSession(params: MesacodeSessionReadParams): Promise<MesacodeSessionStateSnapshot>;
  readSessionMessages(params: MesacodeSessionMessagesParams): Promise<MesacodeMessageWithParts[]>;
  readSessionEvents(params: MesacodeSessionEventsParams): Promise<MesacodeSessionEvent[]>;
  promoteDeferredDraftSession(params: MesacodeTaskTarget): Promise<void>;
  closeSession(params: MesacodeTaskTarget): Promise<void>;
  closeDeferredDraftSession(params: MesacodeTaskTarget): Promise<boolean>;
  setModel(params: MesacodeSessionSetModelParams): Promise<MesacodeSessionStateSnapshot>;
  setThoughtLevel(params: MesacodeSessionSetThoughtLevelParams): Promise<MesacodeSessionStateSnapshot>;
  setMode(params: MesacodeSessionSetModeParams): Promise<MesacodeSessionStateSnapshot>;
  // renderer 订阅面走 agentService 的 conversation/sessions-index 帧通道。
}

export const IMesacodeSessionService = createServiceDescriptor<IMesacodeSessionService>(
  ServiceChannels.MesacodeSession,
);
