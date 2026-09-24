// 平台能力面收敛：设置页「插件管理」的薄服务接口。
//
// 背景：pluginManagementStore / usePluginUninstall 过去直接注入 IMesacodeAgentService，
// UI 层因此散布 13 个 plugins/* 旧协议词的消费点。收敛为独立薄 service 后，UI 只依赖
// 本接口；plugins/* 词表的 host 侧消费点收拢到 pluginManagementService 一处（插件的
// 事实源在 mesacode-cli 进程，服务实现仍经 agent 协议往返——plugins 词表的收口归属
// 插件能力面自身的协议演进，不在会话 v4 词表范围内）。
// 注意与既有 IPluginsService（已 retired 的 marketplace pluginStore 通道）区分：
// 那套接口按 pluginName+marketplace 寻址且方法语义过时，不复用避免签名冲突。
import type { Event } from "@mesacode/rpc";
import type {
  MesacodePluginOperationProgressNotification,
  MesacodePluginsConfigureResult,
  MesacodePluginsCancelOperationResult,
  MesacodePluginsDescribeResult,
  MesacodePluginsInstallResult,
  MesacodePluginsListResult,
  MesacodePluginsMarketplaceMutationResult,
  MesacodePluginsOverviewResult,
  MesacodePluginsReferenceCatalogResult,
  MesacodePluginsRestoreBuiltinResult,
  MesacodePluginsSetEnabledResult,
  MesacodePluginsUninstallResult,
  MesacodePluginsValidateResult,
} from "@mesacode/shared";
import { ServiceChannels } from "@mesacode/shared";
import { createServiceDescriptor } from "../descriptors.js";
import type {
  MesacodeAgentAddPluginMarketplaceParams,
  MesacodeAgentConfigurePluginParams,
  MesacodeAgentCancelPluginOperationParams,
  MesacodeAgentDescribePluginParams,
  MesacodeAgentInstallPluginParams,
  MesacodeAgentPluginReferenceCatalogParams,
  MesacodeAgentResolveSuggestedPluginReferenceParams,
  MesacodeAgentResetPluginConfigParams,
  MesacodeAgentPluginViewParams,
  MesacodeAgentRemovePluginMarketplaceParams,
  MesacodeAgentRestoreBuiltinPluginParams,
  MesacodeAgentSetPluginEnabledParams,
  MesacodeAgentUninstallPluginParams,
  MesacodeAgentUpdatePluginMarketplaceParams,
  MesacodeAgentUpdatePluginParams,
  MesacodeAgentValidatePluginParams,
} from "../mesacode-agent/mesacodeAgentPluginParams.js";

export interface IPluginManagementService {
  listPlugins(params: MesacodeAgentPluginViewParams): Promise<MesacodePluginsListResult>;
  /**
   * Plugin 对话引用 catalog：
   * 带 sessionId → session-owned 冻结 catalog；不带 → workspace 当前 catalog。
   * 实现路由到 workspace 级 agent client，不走插件管理独立进程。
   */
  getPluginReferenceCatalog(
    params: MesacodeAgentPluginReferenceCatalogParams,
  ): Promise<MesacodePluginsReferenceCatalogResult>;
  resolveSuggestedPluginReference(
    params: MesacodeAgentResolveSuggestedPluginReferenceParams,
  ): Promise<import("@mesacode/shared").MesacodePluginsResolveSuggestedReferenceResult>;
  onDynamicPluginOperationProgress(
    operationId: string,
  ): Event<MesacodePluginOperationProgressNotification>;
  getPluginsOverview(params: MesacodeAgentPluginViewParams): Promise<MesacodePluginsOverviewResult>;
  addPluginMarketplace(
    params: MesacodeAgentAddPluginMarketplaceParams,
  ): Promise<MesacodePluginsMarketplaceMutationResult>;
  removePluginMarketplace(
    params: MesacodeAgentRemovePluginMarketplaceParams,
  ): Promise<MesacodePluginsMarketplaceMutationResult>;
  updatePluginMarketplace(
    params: MesacodeAgentUpdatePluginMarketplaceParams,
  ): Promise<MesacodePluginsMarketplaceMutationResult>;
  installPlugin(params: MesacodeAgentInstallPluginParams): Promise<MesacodePluginsInstallResult>;
  cancelPluginOperation(
    params: MesacodeAgentCancelPluginOperationParams,
  ): Promise<MesacodePluginsCancelOperationResult>;
  uninstallPlugin(params: MesacodeAgentUninstallPluginParams): Promise<MesacodePluginsUninstallResult>;
  updatePlugin(params: MesacodeAgentUpdatePluginParams): Promise<MesacodePluginsInstallResult>;
  restoreBuiltinPlugin(
    params: MesacodeAgentRestoreBuiltinPluginParams,
  ): Promise<MesacodePluginsRestoreBuiltinResult>;
  configurePlugin(params: MesacodeAgentConfigurePluginParams): Promise<MesacodePluginsConfigureResult>;
  resetPluginConfig(
    params: MesacodeAgentResetPluginConfigParams,
  ): Promise<MesacodePluginsConfigureResult>;
  validatePlugin(params: MesacodeAgentValidatePluginParams): Promise<MesacodePluginsValidateResult>;
  describePlugin(params: MesacodeAgentDescribePluginParams): Promise<MesacodePluginsDescribeResult>;
  setPluginEnabled(params: MesacodeAgentSetPluginEnabledParams): Promise<MesacodePluginsSetEnabledResult>;
}

export const IPluginManagementService = createServiceDescriptor<IPluginManagementService>(
  ServiceChannels.PluginManagement,
);
