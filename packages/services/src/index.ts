// Descriptors & collection (browser-safe)
export { type ServiceDescriptor, createServiceDescriptor } from "./descriptors.js";
export { ServiceCollection } from "./collection.js";
export {
  IModelSelectionService,
  IProviderSettingsService,
  type ModelSelectionView,
  type ModelSelectionViewInput,
  type ProviderSettingsProviderView,
  type ProviderSettingsView,
} from "./model-provider/providerFacadeServices.js";
export {
  createAccountRequestAuthService,
  type IAccountRequestAuthService,
  type AccountRequestAuthInput,
  type AccountRequestAuthMaterial,
  type AccountRequestAuthResolver,
} from "./model-provider/accountRequestAuthService.js";
export { IProviderProvisioningTargetService } from "./model-provider/providerProvisioning.js";
export {
  parseModelCatalogPayload,
  resolveModelCatalogUrl,
  type ModelCatalogApiFacts,
  type ModelDiscoveryExecutor,
  type ModelDiscoveryRequest,
  type ModelDiscoveryResult,
} from "./model-provider/modelCatalogDiscovery.js";
export type { ModelDiscoveryProviderFacts } from "./model-provider/modelDiscoveryExecutor.js";
export type { ProviderSettingsModelDiscoveryRequest } from "./model-provider/providerFacadeServices.js";
export {
  collectServiceMemoryDiagnostics,
  memoryDiagnosticsRegistry,
  registerMemoryDiagnosticsProvider,
} from "./memoryDiagnostics.js";

// Accessor
export type { IServiceAccessor } from "./accessor.js";
export {
  ConversationShareServiceError,
  createUnsupportedConversationShareService,
  IConversationShareService,
} from "./conversation-share/conversationShare.js";
export type {
  ConversationShareSelection,
  ConversationSharePublishProgress,
  ConversationShareImportProgress,
  ImportConversationShareInput,
  ImportConversationShareResult,
  ImportedConversationShare,
  ConversationShareServiceErrorKind,
  ConversationShareFailureIssue,
  ConversationShareFailureIssueCode,
  ConversationSharePreflightInput,
  ConversationSharePreflightResult,
  ConversationShareAllowedArtifact,
  ConversationShareTurnPreflightResult,
  PublishTextConversationInput,
} from "./conversation-share/conversationShare.js";
// Conversation share 的具体实现依赖 Node 文件系统，只能从 @mesacode/services/node 引入；
// 根入口必须保持 browser-safe，避免 renderer 解析到 node:* 模块。
export {
  createConversationTelemetryService,
  type ConversationTelemetryWorkspaceTarget,
  type IConversationTelemetryService,
} from "./conversation-telemetry/conversationTelemetry.js";

// File service — IFileService is both a type (interface) and value (descriptor)
export { IFileService } from "./file/file.js";
export { IMediaPreviewService } from "./media-preview/mediaPreview.js";
export type { MediaPreviewPreparation } from "./media-preview/mediaPreview.js";

// Git service — IGitService is both a type (interface) and value (descriptor)
export { IGitService } from "./git/git.js";
export { IGitCheckpointService } from "./git/gitCheckpoint.js";

// System service — ISystemService is both a type (interface) and value (descriptor)
export { ISystemService } from "./system/system.js";

// Terminal service — ITerminalService is both a type (interface) and value (descriptor)
export { ITerminalService } from "./terminal/terminal.js";

// Setting service — ISettingService is both a type (interface) and value (descriptor)
export { ISettingService } from "./setting/setting.js";

// Credential service — ICredentialService is both a type (interface) and value (descriptor)
export { ICredentialService } from "./credential/credential.js";

// Broadcast service — IBroadcastService is both a type (interface) and value (descriptor)
export { IBroadcastService } from "./broadcast/broadcast.js";

export type {
  BroadcastClaimAcquireResult,
  BroadcastClaimLease,
  BroadcastMessage,
} from "./broadcast/broadcast.js";

// Mesacode task wrapper service — task 列表/置顶/归档等 app 侧包装状态入口。
export { IMesacodeTaskService } from "./session/mesacodeTaskService.js";
export type {
  MesacodeArchivedTaskDeletionResult,
  MesacodeModelTrajectory,
  MesacodeModelTrajectoryCallSource,
  MesacodeModelTrajectoryCallSourceKind,
  MesacodeModelTrajectoryContentPart,
  MesacodeModelTrajectoryMessage,
  MesacodeModelTrajectoryRecord,
  MesacodeModelTrajectoryUsage,
  MesacodeTaskListKind,
  MesacodeTaskListQuery,
  MesacodeTaskListResult,
  MesacodeTaskListSortBy,
  MesacodeTaskListWorkspaceScope,
  MesacodeTaskReadyOutcome,
  MesacodeGroupedTaskRef,
  MesacodeGroupedTaskView,
  MesacodeGroupedTaskViewNode,
  MesacodeGroupedTaskViewOrderInput,
  MesacodeGroupedTaskViewQuery,
  MesacodeGroupedTaskViewStructure,
  MesacodeGroupedTaskViewStructureMember,
  MesacodeGroupedTaskViewStructureTopOrder,
  MesacodeGroupedTaskViewTopLevelNodeRef,
  MesacodeTaskGroup,
  MesacodeTaskGroupColor,
} from "./session/mesacodeTaskService.js";
export type { MesacodeTaskListItem } from "./session/mesacodeTaskListTypes.js";

export { IWindowControllerService } from "./window-controller/windowController.js";
export type {
  WindowHostControllerFrame,
  WindowHostControllerMutation,
  WindowHostControllerTaskListItem,
  WindowHostControllerTaskListResult,
} from "./window-controller/windowController.js";

// Mesacode agent service — IMesacodeAgentService is both a type (interface) and value (descriptor)
export {
  IMesacodeAgentService,
  type MesacodeAgentLocalRuntimeChildProcesses,
  MESACODE_AGENT_RUNTIME_UNAVAILABLE_CODE,
} from "./mesacode-agent/mesacodeAgent.js";
export {
  isMesacodeAgentMcpStatusModeUnsupportedError,
  MESACODE_AGENT_MCP_STATUS_MODE_UNSUPPORTED_ERROR_CODE,
  MesacodeAgentMcpStatusModeUnsupportedError,
} from "./mesacode-agent/mesacodeAgentErrors.js";
export {
  createMesacodeAgentConnectionScope,
  readTrustedMesacodeAgentV4Connection,
} from "./mesacode-agent/mesacodeAgentConnectionScope.js";
export type {
  MesacodeAgentConnectionScope,
  MesacodeAgentV4ClientMode,
  MesacodeAgentV4ConnectionContext,
} from "./mesacode-agent/mesacodeAgentConnectionScope.js";
export type {
  MesacodeAgentAttachmentBeginParams,
  MesacodeAgentAttachmentChunkParams,
  MesacodeAgentAttachmentTerminalParams,
  MesacodeAgentCreateSessionParams,
  MesacodeAgentCuaPermissionObservation,
  MesacodeAgentInitializeResult,
  MesacodeAgentStorageStartupSnapshot,
  MesacodeAgentRuntimeLifecycleEvent,
  MesacodeAgentRuntimePolicy,
  MesacodeAgentReadSessionParams,
  MesacodeAgentResumeSessionParams,
  MesacodeAgentRunAutomationNowResult,
  MesacodeAgentSavedWorkflowTarget,
  MesacodeAgentSendPromptParams,
  MesacodeAgentServiceEvent,
  MesacodeAgentSessionSubscribeParams,
  MesacodeAgentSessionTarget,
  MesacodeAgentSetModeParams,
  MesacodeAgentSetModelParams,
  MesacodeAgentSetThoughtLevelParams,
  MesacodeAgentWorkspaceTarget,
} from "./mesacode-agent/mesacodeAgent.js";

// Mesacode session service — app-facing session facade without Mesacode Agent naming.
export { IMesacodeSessionService } from "./mesacode-session/mesacodeSession.js";
export type {
  MesacodeSessionCreateParams,
  MesacodeSessionEventsParams,
  MesacodeSessionInitializeResult,
  MesacodeSessionListParams,
  MesacodeSessionMessagesParams,
  MesacodeSessionReadParams,
  MesacodeSessionResumeParams,
  MesacodeSessionServiceEvent,
  MesacodeSessionSetModeParams,
  MesacodeSessionSetModelParams,
  MesacodeSessionSetThoughtLevelParams,
  MesacodeSessionSubscribeParams,
  MesacodeTaskTarget,
  MesacodeSessionWorkspaceTarget,
} from "./mesacode-session/mesacodeSession.js";

// Hooks service — IHooksService is both a type (interface) and value (descriptor).
export { IHooksService } from "./hooks/hooks.js";

// Memory service — IMemoryService is both a type (interface) and value (descriptor).
export {
  IMemoryService,
  PROJECT_MEMORY_FILE_CHANGED_ERROR_CODE,
  PROJECT_MEMORY_PREVIEW_LIMIT_EXCEEDED_ERROR_CODE,
} from "./memory/memory.js";
export type { ProjectMemoryFileSummary, ProjectMemoryWorkspaceSummary } from "./memory/memory.js";

export type { SessionRealtimePort } from "./session/sessionRealtimePort.js";

// FileWatcher service — IFileWatcherService is both a type (interface) and value (descriptor)
export { IFileWatcherService } from "./fileWatcher/fileWatcher.js";

// OAuth service — IOAuthService is both a type (interface) and value (descriptor)
export { IOAuthService } from "./oauth/oauth.js";

// UsageStats service — IUsageStatsService is both a type (interface) and value (descriptor)
export { IUsageStatsService } from "./usage-stats/usageStats.js";

// Storage（资源管理器「存储」tab）：数据类型在 @mesacode/shared；这里只导出服务接口与卷分组纯函数
export type { IStorageService } from "./storage/contract.js";

// CodingPlanSubscription service — ICodingPlanSubscriptionService is both a type (interface) and value (descriptor)
export {
  ICodingPlanSubscriptionService,
  type OffPeakClientConfig,
} from "./coding-plan-subscription/codingPlanSubscription.js";
export {
  IClientScenesService,
  type ClientSceneConfig,
  type ClientSceneItem,
  type ClientSceneOption,
  type ClientSceneResponseBody,
  type ClientScenesResponse,
} from "./client-scenes/clientScenes.js";
export { isValidCronExpr } from "./session/automationCronValidation.js";
// 闲时任务管理服务（与 automation 服务面独立）；接口/描述符 browser-safe。
export { IOffPeakTaskService } from "./session/offPeakTask.js";
export type { OffPeakUpdateTaskParams } from "./session/offPeakTask.js";

// Skills service — ISkillsService is both a type (interface) and value (descriptor)
export { ISkillsService } from "./skills/skills.js";
export { ISkillSyncService } from "./skill-sync/skillSync.js";
export { IMcpSyncService } from "./mcp-sync/mcpSync.js";
export { IPluginSyncService } from "./plugin-sync/pluginSync.js";
export {
  ICuaPermissionService,
  type CuaPermissionState,
  type CuaPermissionRestartOptions,
  type CuaPermissionStatus,
  type CuaPermissionStatusQueryOptions,
  type CuaPermissionStatusResult,
  type CuaPermissionStatusUnavailable,
  isCuaPermissionStatusAvailable,
} from "./cua-permission-broker/cuaPermissionService.js";
export {
  ICuaPipSessionService,
  type CuaPipSessionService,
} from "./cua-permission-broker/cuaPipSession.js";

// Plugins service — IPluginsService is both a type (interface) and value (descriptor)
export { IPluginsService } from "./plugins/plugins.js";
// 设置页插件管理薄服务（UI 平台能力面不再直触 mesacodeAgentService）
export { IPluginManagementService } from "./plugins/pluginManagement.js";

// Subagents service — ISubagentsService is both a type (interface) and value (descriptor)
export { ISubagentsService } from "./subagents/subagents.js";

// Commands service — ICommandsService is both a type (interface) and value (descriptor)
export { ICommandsService } from "./commands/commands.js";

export { ISettingsSyncService } from "./settings-sync/settingsSync.js";

export { IFeedbackService } from "./feedback/feedback.js";
export type { FeedbackUploadProgress } from "./feedback/feedback.js";
export { IPromptAttachmentTransferService } from "./prompt-attachment-transfer/promptAttachmentTransfer.js";
export type {
  PromptAttachmentStageParams,
  PromptAttachmentStageResult,
  PromptAttachmentTransferPhase,
  PromptAttachmentTransferProgress,
} from "./prompt-attachment-transfer/promptAttachmentTransfer.js";
export type {
  CreateFeedbackTicketInput,
  FeedbackAttachment,
  FeedbackAttachmentKind,
  FeedbackComment,
  FeedbackDeviceInfo,
  FeedbackListQuery,
  FeedbackListResult,
  FeedbackReporter,
  FeedbackTicketDetail,
  FeedbackTicketFramework,
  FeedbackTicketModule,
  FeedbackTicketSeverity,
  FeedbackTicketStatus,
  FeedbackTicketSummary,
  FeedbackTicketType,
} from "@mesacode/shared";
export { IClientConfigService } from "./client-config/clientConfig.js";
