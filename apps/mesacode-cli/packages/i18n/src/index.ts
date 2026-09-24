import type { UiLocale, SupportedLocale } from "@mesacode/contracts";
import { enUS } from "./locales/en-US.js";
import { zhCN } from "./locales/zh-CN.js";
import {
  DEFAULT_LOCALE,
  detectLocale,
  isSupportedLocale,
  isUiLocale,
  resolveLocale,
  SUPPORTED_LOCALES,
} from "./locale.js";
import type { MesacodeCopy } from "./types.js";

export {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  detectLocale,
  isSupportedLocale,
  isUiLocale,
  resolveLocale,
};
export type { LocaleDetectionInput } from "./locale.js";
export type { CliCopy, TuiCopy, UiLocale, SupportedLocale, MesacodeCopy } from "./types.js";

const CATALOGS: Record<SupportedLocale, MesacodeCopy> = {
  "en-US": enUS,
  "zh-CN": zhCN,
};

export function getMesacodeCopy(locale?: UiLocale | string, detected?: string | null): MesacodeCopy {
  return CATALOGS[resolveLocale(locale, detected)];
}
