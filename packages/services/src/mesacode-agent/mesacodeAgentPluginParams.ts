import type {
  MesacodeAgentMcpServer,
  MesacodeAutomationScheduleRule,
  MesacodeMcpListMode,
  ModelSelection,
} from "@mesacode/shared";

export interface MesacodeAgentWorkspaceTarget {
  workspacePath: string;
  workspaceIdentity?: string;
  /** 远程 workspace 的运行时会话身份；只用于隔离/路由，不能替代 workspacePath。 */
  remoteSessionId?: string;
}

export interface MesacodeAgentPluginViewParams extends MesacodeAgentWorkspaceTarget {
  configScope?: "user" | "workspace";
}

export interface MesacodeAgentListMcpServerStatusesParams extends MesacodeAgentWorkspaceTarget {
  mcpServers?: MesacodeAgentMcpServer[];
  mode?: MesacodeMcpListMode;
}

export interface MesacodeAgentAddPluginMarketplaceParams extends MesacodeAgentWorkspaceTarget {
  dryRun?: boolean;
  operationId?: string;
  source: string;
}

export interface MesacodeAgentRemovePluginMarketplaceParams extends MesacodeAgentWorkspaceTarget {
  marketplace: string;
}

export interface MesacodeAgentUpdatePluginMarketplaceParams extends MesacodeAgentWorkspaceTarget {
  marketplace?: string;
  operationId?: string;
}

export interface MesacodeAgentInstallPluginParams extends MesacodeAgentWorkspaceTarget {
  dryRun?: boolean;
  marketplace: string;
  operationId?: string;
  pluginName: string;
  scope?: "user" | "workspace";
}

export interface MesacodeAgentCancelPluginOperationParams {
  operationId: string;
}

export interface MesacodeAgentUninstallPluginParams extends MesacodeAgentWorkspaceTarget {
  marketplace?: string;
  pluginId?: string;
  pluginName?: string;
  removeCache?: boolean;
}

export interface MesacodeAgentUpdatePluginParams extends MesacodeAgentWorkspaceTarget {
  pluginId?: string;
  marketplace?: string;
}

export interface MesacodeAgentRestoreBuiltinPluginParams extends MesacodeAgentWorkspaceTarget {
  pluginId: string;
}

export interface MesacodeAgentConfigurePluginParams extends MesacodeAgentWorkspaceTarget {
  clearOptionKeys?: string[];
  dryRun?: boolean;
  options: Record<string, unknown>;
  pluginId: string;
  scope?: "user" | "workspace";
}

export interface MesacodeAgentResetPluginConfigParams extends MesacodeAgentWorkspaceTarget {
  pluginId: string;
  scope?: "user" | "workspace";
}

export interface MesacodeAgentValidatePluginParams extends MesacodeAgentWorkspaceTarget {
  marketplace?: string;
  pluginName?: string;
  source?: string;
}

export interface MesacodeAgentDescribePluginParams extends MesacodeAgentWorkspaceTarget {
  marketplace: string;
  pluginName: string;
}

export interface MesacodeAgentSetPluginEnabledParams extends MesacodeAgentWorkspaceTarget {
  enabled: boolean;
  operationId?: string;
  pluginId: string;
  scope?: "user" | "workspace";
}

// Plugin 对话引用 catalog：
// 带 sessionId → session-owned 冻结 catalog（必须路由到持有该 session 的 workspace client）；
// 不带 → workspace 当前 catalog（新建草稿 Picker）。
export interface MesacodeAgentPluginReferenceCatalogParams extends MesacodeAgentWorkspaceTarget {
  sessionId?: string;
}

// Composer Skill catalog：与 Plugin 引用相同，以 sessionId 区分 workspace 当前目录和
// resident Session runtime 快照；不参与 Settings 管理目录。
export interface MesacodeAgentSkillReferenceCatalogParams extends MesacodeAgentWorkspaceTarget {
  sessionId?: string;
}
export interface MesacodeAgentResolveSuggestedPluginReferenceParams extends MesacodeAgentWorkspaceTarget {
  stableId: string;
  operationId: string;
  clientMode: "desktop-continuous" | "web-remote-replayable";
  deliveryKind: "desktop-continuous" | "web-remote-replayable";
}

// ---- 定时任务(automation)管理参数 ----

export interface MesacodeAgentCreateAutomationParams extends MesacodeAgentWorkspaceTarget {
  title: string;
  cronExpr: string;
  relativeDelayMinutes?: number;
  prompt: string;
  modelSelection?: ModelSelection;
  mode?: string;
  recurring?: boolean;
  maxRuns?: number;
  endAt?: number;
  scheduleRule?: MesacodeAutomationScheduleRule;
}

export interface MesacodeAgentUpdateAutomationParams extends MesacodeAgentWorkspaceTarget {
  automationId: string;
  title?: string;
  cronExpr?: string;
  prompt?: string;
  modelSelection?: ModelSelection | null;
  mode?: string | null;
  recurring?: boolean;
  maxRuns?: number | null;
  endAt?: number | null;
  scheduleRule?: MesacodeAutomationScheduleRule | null;
  scheduleEditedByUser?: boolean;
}

export interface MesacodeAgentAutomationIdParams extends MesacodeAgentWorkspaceTarget {
  automationId: string;
}

export interface MesacodeAgentSetAutomationEnabledParams extends MesacodeAgentWorkspaceTarget {
  automationId: string;
  enabled: boolean;
}

export interface MesacodeAgentDeleteAutomationRunParams extends MesacodeAgentWorkspaceTarget {
  runId: string;
}
