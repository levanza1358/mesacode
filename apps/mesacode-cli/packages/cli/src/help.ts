import { getMesacodeCopy, type SupportedLocale, type UiLocale } from "@mesacode/i18n";

export function formatCliHelp(
  version: string,
  locale?: UiLocale,
  detectedLocale?: SupportedLocale,
): string {
  return getMesacodeCopy(locale, detectedLocale).cli.help(version);
}
