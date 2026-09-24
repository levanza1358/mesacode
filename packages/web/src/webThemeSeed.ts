type WebThemeSeed = "light" | "dark" | "black";

export const WEB_DEFAULT_THEME: WebThemeSeed = "dark";

function isWebThemeSeed(value: unknown): value is WebThemeSeed {
  return (
    value === "light" || value === "dark" || value === "black"
  );
}

function normalizeWebThemeSeed(theme: WebThemeSeed): WebThemeSeed {
  return theme;
}

export function resolveWebInitialTheme({
  storedTheme,
  defaultTheme = WEB_DEFAULT_THEME,
}: {
  storedTheme?: string | null;
  defaultTheme?: WebThemeSeed;
}): WebThemeSeed {
  if (isWebThemeSeed(storedTheme)) {
    return normalizeWebThemeSeed(storedTheme);
  }

  return normalizeWebThemeSeed(defaultTheme);
}
