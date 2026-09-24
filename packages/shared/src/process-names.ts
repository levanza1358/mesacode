const MESACODE_PROCESS_PREFIX = "mesacode";
const MAX_PROCESS_NAME_SEGMENT_LENGTH = 24;

function sanitizeProcessNameSegment(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!normalized) {
    return null;
  }

  return normalized.slice(0, MAX_PROCESS_NAME_SEGMENT_LENGTH);
}

function joinMesacodeProcessName(...segments: Array<string | null | undefined>): string {
  const sanitizedSegments = segments
    .map((segment) => sanitizeProcessNameSegment(segment))
    .filter((segment): segment is string => Boolean(segment));
  return [MESACODE_PROCESS_PREFIX, ...sanitizedSegments].join("-");
}

function pickWorkspaceTag(workspacePath: string | null | undefined): string | undefined {
  const trimmedPath = workspacePath?.trim();
  if (!trimmedPath) {
    return undefined;
  }

  const parts = trimmedPath.split(/[\\/]+/).filter(Boolean);
  return parts.at(-1) ?? trimmedPath;
}

export function formatMesacodeMainProcessName(): string {
  return joinMesacodeProcessName("main");
}

export function formatMesacodeGpuProcessName(): string {
  return joinMesacodeProcessName("gpu");
}

export function formatMesacodeHostProcessName(label?: string): string {
  return joinMesacodeProcessName("host", label);
}

export function formatMesacodeRendererProcessName(windowTitle?: string): string {
  const normalizedTitle = windowTitle?.trim();
  if (!normalizedTitle || normalizedTitle === "Mesacode") {
    return joinMesacodeProcessName("renderer", "main");
  }

  if (normalizedTitle === "Resource Manager") {
    return joinMesacodeProcessName("renderer", "resource-manager");
  }

  const remoteWindowPrefix = "Mesacode - ";
  if (normalizedTitle.startsWith(remoteWindowPrefix)) {
    return joinMesacodeProcessName(
      "renderer",
      "remote",
      normalizedTitle.slice(remoteWindowPrefix.length),
    );
  }

  return joinMesacodeProcessName("renderer", normalizedTitle);
}

export function formatMesacodeAgentProcessName(provider: string, workspacePath?: string): string {
  return joinMesacodeProcessName("agent", provider, pickWorkspaceTag(workspacePath));
}

export function formatMesacodeUtilityProcessName(name?: string, type = "utility"): string {
  return joinMesacodeProcessName(type, name);
}
