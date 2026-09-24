import { MESACODE_VERSION, type MesacodeEnv } from "@mesacode/shared";

declare const __MESACODE_CDN_BASE_URL__: string | undefined;
const DEFAULT_CDN_BASE_URL = "https://cdn-mesacode.z.ai";

export interface ResolveRemoteCdnOptions {
  env?: MesacodeEnv;
  locale?: string;
  timeZone?: string;
  overrideBaseUrl?: string;
  version?: string;
  now?: Date;
}

function normalizeBaseUrl(value: string): string {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("CDN URL must use http or https");
  return value.replace(/\/+$/, "");
}

export function resolveRemoteCdnBaseUrls(options: ResolveRemoteCdnOptions = {}): string[] {
  const override = options.overrideBaseUrl?.trim();
  if (override) return [normalizeBaseUrl(override)];
  const baseUrl =
    process.env.MESACODE_CDN_BASE_URL?.trim() ||
    (typeof __MESACODE_CDN_BASE_URL__ === "undefined" ? "" : __MESACODE_CDN_BASE_URL__) ||
    DEFAULT_CDN_BASE_URL;
  return [
    `${normalizeBaseUrl(baseUrl)}/mesacode/electron/releases/${options.version ?? MESACODE_VERSION}`,
  ];
}
