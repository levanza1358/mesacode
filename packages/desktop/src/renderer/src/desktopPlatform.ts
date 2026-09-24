import { recordArmsCustomEventForE2E } from "@mesacode/ui";
import { DesktopCommandIds, buildLocalMediaPreviewUrl, type IPlatformService } from "@mesacode/shared";

import { desktopBrowserPlatformBridge } from "./desktopBrowserPlatformBridge.js";

export function createDesktopPlatform(options: {
  isLocalDevelopmentRuntime: boolean;
}): IPlatformService {
  return {
    canSelectFilePath: true,
    createLocalMediaPreviewUrl: buildLocalMediaPreviewUrl,
    isLocalDevelopmentRuntime: options.isLocalDevelopmentRuntime,
    selectDirectory: () => window.mesacode.selectDirectory(),
    selectFile: () => window.mesacode.selectFile(),
    selectFiles: () => window.mesacode.selectFiles?.() ?? Promise.resolve([]),
    createTempTextAttachment: (payload) => window.mesacode.createTempTextAttachment(payload),
    onRemoteConnectionLog: (handler) => window.mesacode.onRemoteConnectionLog(handler),
    onRemoteSessionClosed: (handler) => window.mesacode.onRemoteSessionClosed(handler),
    activateOrSetWorkspace: (path) =>
      window.mesacode.activateOrSetWorkspace?.(path) ?? Promise.resolve({ activated: false }),
    connectRemote: (remoteOptions, requestId, context) =>
      window.mesacode.connectRemote(remoteOptions, requestId, context),
    cancelPendingRemoteConnection: (requestId) =>
      window.mesacode.cancelPendingRemoteConnection?.(requestId) ?? Promise.resolve(),
    bindRemoteWorkspaceSessionContext: (context) =>
      window.mesacode.bindRemoteWorkspaceSessionContext?.(context) ?? Promise.resolve(),
    disposeRemoteSession: (sessionId) => window.mesacode.disposeRemoteSession(sessionId),
    isDockerAvailable: () => window.mesacode.isDockerAvailable(),
    listWSLDistros: () => window.mesacode.listWSLDistros(),
    listDockerContainers: () => window.mesacode.listDockerContainers(),
    listSSHConfigAliases: () => window.mesacode.listSSHConfigAliases(),
    loadMcpFromUserDirectory: (payload) => window.mesacode.loadMcpFromUserDirectory(payload),
    saveMcpToUserDirectory: (payload) => window.mesacode.saveMcpToUserDirectory(payload),
    migrateLegacyCommonMcp: (payload) => window.mesacode.migrateLegacyCommonMcp(payload),
    openExternal: (url) => window.mesacode.openExternal(url),
    openFeedback: () => window.mesacode.executeDesktopCommand(DesktopCommandIds.OpenFeedback),
    openCommunity: () => window.mesacode.executeDesktopCommand(DesktopCommandIds.OpenCommunity),
    canOpenCommunity: (locale) => window.mesacode.canOpenCommunity(locale),
    openInFileManager: (path) => window.mesacode.openInFileManager(path),
    openExternalFile: (path) => window.mesacode.openExternalFile(path),
    openCuaPermissionOnboarding: window.mesacode?.openCuaPermissionOnboarding
      ? (permissionOptions) =>
          window.mesacode.openCuaPermissionOnboarding?.(permissionOptions) ??
          Promise.resolve({ success: false, error: "not_supported" })
      : undefined,
    prepareCuaHelperPermissionDrag: window.mesacode?.prepareCuaHelperPermissionDrag
      ? () =>
          window.mesacode.prepareCuaHelperPermissionDrag?.() ??
          Promise.resolve({ success: false, error: "not_supported" })
      : undefined,
    startCuaHelperPermissionDrag: window.mesacode?.startCuaHelperPermissionDrag
      ? () => window.mesacode.startCuaHelperPermissionDrag?.()
      : undefined,
    registerOAuthState: (payload) => window.mesacode.registerOAuthState(payload),
    onOAuthCallback: (callback) => window.mesacode.onOAuthCallback(callback),
    onPaymentCallback: (callback) => window.mesacode.onPaymentCallback(callback),
    onShareImport: (callback) => window.mesacode.onShareImport?.(callback) ?? (() => {}),
    notifyRendererReady: () => window.mesacode.notifyRendererReady(),
    reportTelemetryEvent: (payload) => window.mesacode.reportTelemetryEvent(payload),
    reportArmsCustomEvent: (payload) => {
      recordArmsCustomEventForE2E(payload);
      return window.mesacode.reportArmsCustomEvent(payload);
    },
    getRendererActionTraceConfig: window.mesacode?.getRendererActionTraceConfig
      ? () => window.mesacode.getRendererActionTraceConfig!()
      : undefined,
    onRendererActionTraceConfigChanged: window.mesacode?.onRendererActionTraceConfigChanged
      ? (callback) => window.mesacode.onRendererActionTraceConfigChanged!(callback)
      : undefined,
    reportLocalTtftBatch: (batch) => window.mesacode?.reportLocalTtftBatch?.(batch),
    reportRendererActionTraceBatch: window.mesacode?.reportRendererActionTraceBatch
      ? (batch) => window.mesacode?.reportRendererActionTraceBatch?.(batch)
      : undefined,
    reportRendererHeapSample: window.mesacode?.reportRendererHeapSample
      ? (sample) => window.mesacode?.reportRendererHeapSample?.(sample)
      : undefined,
    showTaskNotification: (payload) => window.mesacode.showTaskNotification(payload),
    syncWindowTabs: (paths) => window.mesacode.syncWindowTabs(paths),
    syncWindowUnreadCount: (count) => window.mesacode.syncWindowUnreadCount(count),
    syncActiveTaskSession: (sessionId) => window.mesacode.syncActiveTaskSession(sessionId),
    syncAppSettings: (patch) => window.mesacode.syncAppSettings?.(patch),
    setShortcutRecordingActive: (active) => window.mesacode.setShortcutRecordingActive?.(active),
    onFocusTab: (handler) => window.mesacode.onFocusTab(handler),
    onNewTab: (handler) => window.mesacode.onNewTab(handler),
    onCloseActiveContextRequest: (handler) =>
      window.mesacode.onCloseActiveContextRequest?.(handler) ?? (() => {}),
    onOpenBrowserUrl: (handler) => window.mesacode.onOpenBrowserUrl?.(handler) ?? (() => {}),
    onBrowserViewScreenshotSurfacePrepare: (handler) =>
      window.mesacode.onBrowserViewScreenshotSurfacePrepare?.(handler) ?? (() => {}),
    onBrowserViewScreenshotSurfaceRelease: (handler) =>
      window.mesacode.onBrowserViewScreenshotSurfaceRelease?.(handler) ?? (() => {}),
    browserViewScreenshotSurfaceReady: (payload) =>
      window.mesacode.browserViewScreenshotSurfaceReady?.(payload),
    ...desktopBrowserPlatformBridge,
    onNewTask: (handler) => window.mesacode.onNewTask(handler),
    onOpenWorkspace: (handler) => {
      // 开发态或升级后的旧窗口可能仍运行未暴露 onOpenWorkspace 的 preload，
      // renderer 直接调用会在启动时崩溃。这里和 activateOrSetWorkspace 一样做兼容兜底，
      // 缺少该 bridge 时只禁用原生菜单回调，不影响应用继续打开。
      return window.mesacode.onOpenWorkspace?.(handler) ?? (() => {});
    },
    onOpenWorkspacePath: (handler) => window.mesacode.onOpenWorkspacePath?.(handler) ?? (() => {}),
    onOpenFeedbackDialog: (handler) => window.mesacode.onOpenFeedbackDialog?.(handler) ?? (() => {}),
    onOpenTicketsPanel: (handler) => window.mesacode.onOpenTicketsPanel?.(handler) ?? (() => {}),
    onWindowFullscreenChanged: (handler) => window.mesacode.onWindowFullscreenChanged(handler),
    getDesktopWindowChromeState: window.mesacode?.getDesktopWindowChromeState
      ? () => window.mesacode.getDesktopWindowChromeState!()
      : undefined,
    onDesktopWindowChromeStateChanged: window.mesacode.onDesktopWindowChromeStateChanged
      ? (handler) => window.mesacode.onDesktopWindowChromeStateChanged!(handler)
      : undefined,
    getWindowControlsOverlayMetrics: () => window.mesacode.getWindowControlsOverlayMetrics?.() ?? null,
    onWindowControlsOverlayChanged: (handler) =>
      window.mesacode.onWindowControlsOverlayChanged?.(handler) ?? (() => {}),
    getDesktopZoomLevel: () =>
      window.mesacode.getDesktopZoomLevel?.() ?? Promise.resolve({ zoomLevel: 0 }),
    onDesktopZoomLevelChanged: (handler) =>
      window.mesacode.onDesktopZoomLevelChanged?.(handler) ?? (() => {}),
    onTaskNotificationClick: (handler) => window.mesacode.onTaskNotificationClick(handler),
    exportLogs: () => window.mesacode.exportLogs(),
    captureWindowScreenshot: () =>
      window.mesacode.captureWindowScreenshot?.() ?? Promise.resolve(null),
    onUpdateReady: (callback) => window.mesacode.onUpdateReady(callback),
    onUpdateCheckResult: (callback) => window.mesacode.onUpdateCheckResult(callback),
    onUpdateStateChanged: (callback) => window.mesacode.onUpdateStateChanged?.(callback) ?? (() => {}),
    getUpdateState: () =>
      window.mesacode.getUpdateState?.() ?? Promise.resolve({ kind: "idle", enabled: true }),
    downloadUpdate: () => window.mesacode.downloadUpdate?.() ?? Promise.resolve(),
    cancelUpdateDownload: () => window.mesacode.cancelUpdateDownload?.() ?? Promise.resolve(),
    openUpdateStatusWindow: () => window.mesacode.openUpdateStatusWindow?.() ?? Promise.resolve(),
    getAutoUpdatePreferences: () =>
      window.mesacode.getAutoUpdatePreferences?.() ??
      Promise.resolve({ autoDownloadAndInstallUpdates: false }),
    setAutoDownloadAndInstallUpdates: (enabled) =>
      window.mesacode.setAutoDownloadAndInstallUpdates?.(enabled) ?? Promise.resolve(),
    getDesktopSessionActivity: () =>
      window.mesacode.getDesktopSessionActivity?.() ??
      Promise.resolve({ runningAgentSessionCount: 0 }),
    getMesacodeStdioTapDevState: () =>
      window.mesacode.getMesacodeStdioTapDevState?.() ??
      Promise.resolve({ enabled: false, visible: false, logDir: "", statePath: "" }),
    onSettingsChanged: (callback) => window.mesacode.onSettingsChanged?.(callback) ?? (() => {}),
    onApplicationLocaleChanged: (callback) =>
      window.mesacode.onApplicationLocaleChanged?.(callback) ?? (() => {}),
    onPostUpdateReleaseNotes: (callback) => window.mesacode.onPostUpdateReleaseNotes(callback),
    acknowledgePostUpdateReleaseNotes: (version) =>
      window.mesacode.acknowledgePostUpdateReleaseNotes(version),
    skipUpdateVersion: (version) => window.mesacode.skipUpdateVersion?.(version) ?? Promise.resolve(),
    quitAndInstallUpdate: () => window.mesacode.quitAndInstallUpdate(),
    getInstalledEditors: () => window.mesacode.getInstalledEditors(),
    getApplicationIcon: (bundleId) =>
      window.mesacode.getApplicationIcon?.(bundleId) ?? Promise.resolve(null),
    openInEditor: (editorId, path, editorOptions) =>
      window.mesacode.openInEditor(editorId, path, editorOptions),
    executeDesktopCommand: (command) => window.mesacode.executeDesktopCommand(command),
    setApplicationLocale: (locale) => window.mesacode.setApplicationLocale(locale),
    getSystemLocale: () =>
      window.mesacode.getSystemLocale?.() ??
      Promise.resolve(navigator.language.toLowerCase().startsWith("zh") ? "zh-CN" : "en-US"),
    setTitleBarTheme: (theme) => window.mesacode.setTitleBarTheme(theme),
    getDeviceId: () =>
      (window as Window & { __MESACODE_DEVICE_ID__?: string }).__MESACODE_DEVICE_ID__ ?? "",
  };
}
