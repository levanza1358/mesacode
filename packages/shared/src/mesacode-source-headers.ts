import { DEFAULT_MESACODE_ENDPOINT_ORIGIN } from "./mesacodeEndpoint.js";

export const MESACODE_SOURCE_HEADERS = {
  "User-Agent": "Mesacode/unknown",
  "HTTP-Referer": DEFAULT_MESACODE_ENDPOINT_ORIGIN,
  "X-Title": "Z Code@electron",
} as const;

export interface BuildMesacodeSourceHeadersFromContextOptions {
  appVersion?: string;
  arch?: string;
  clientLanguage?: string;
  clientTimezone?: string;
  deviceMid?: string;
  endpointOrigin?: string;
  osVersion?: string;
  platform?: string;
  releaseChannel?: string;
  sourceTitle?: string;
}

export function normalizeMesacodeSourceHeaderValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed || !/^[\x20-\x7e]+$/.test(trimmed)) {
    return undefined;
  }
  return trimmed;
}

export function buildMesacodeSourceHeadersFromContext(
  options: BuildMesacodeSourceHeadersFromContextOptions = {},
): Record<string, string> {
  const appVersion = normalizeMesacodeSourceHeaderValue(options.appVersion);
  const arch = normalizeMesacodeSourceHeaderValue(options.arch);
  const clientLanguage = normalizeMesacodeSourceHeaderValue(options.clientLanguage) ?? "unknown";
  const clientTimezone = normalizeMesacodeSourceHeaderValue(options.clientTimezone) ?? "unknown";
  const deviceMid = normalizeMesacodeSourceHeaderValue(options.deviceMid);
  const endpointOrigin =
    normalizeMesacodeSourceHeaderValue(options.endpointOrigin) ?? DEFAULT_MESACODE_ENDPOINT_ORIGIN;
  const osVersion = normalizeMesacodeSourceHeaderValue(options.osVersion);
  const platform = normalizeMesacodeSourceHeaderValue(options.platform);
  const releaseChannel = normalizeMesacodeSourceHeaderValue(options.releaseChannel);
  const sourceTitle = normalizeMesacodeSourceHeaderValue(options.sourceTitle) ?? "electron";

  return {
    ...MESACODE_SOURCE_HEADERS,
    "HTTP-Referer": endpointOrigin,
    "User-Agent": `Mesacode/${appVersion ?? "unknown"}`,
    ...(appVersion ? { "X-Mesacode-App-Version": appVersion } : {}),
    "X-Title": `Z Code@${sourceTitle}`,
    ...(platform && arch ? { "X-Platform": `${platform}-${arch}` } : {}),
    ...(releaseChannel ? { "X-Release-Channel": releaseChannel } : {}),
    "X-Client-Language": clientLanguage,
    "X-Client-Timezone": clientTimezone,
    ...(platform ? { "X-Os-Category": normalizeOsCategory(platform) } : {}),
    ...(osVersion ? { "X-Os-Version": osVersion } : {}),
    ...(deviceMid ? { "X-Device-Mid": deviceMid } : {}),
  };
}

function normalizeOsCategory(platform: string): string {
  switch (platform) {
    case "darwin":
      return "macos";
    case "win32":
      return "windows";
    default:
      return "linux";
  }
}
