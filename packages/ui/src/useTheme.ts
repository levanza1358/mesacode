import { useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark" | "black";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "mesacode-theme";
const BROWSER_THEME_SURFACE_ATTRIBUTE = "data-mesacode-browser-theme-surface";

export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "light" ? "light" : "dark";
}

export function normalizeThemePreference(theme: Theme): Theme {
  return theme === "light" || theme === "black" ? theme : "dark";
}

function setThemeMetaContent(name: "theme-color" | "color-scheme", content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.append(meta);
  }
  meta.content = content;
}

function syncBrowserThemeSurface(resolved: ResolvedTheme) {
  const root = document.documentElement;
  if (
    typeof root.hasAttribute !== "function" ||
    !root.hasAttribute(BROWSER_THEME_SURFACE_ATTRIBUTE)
  ) {
    return;
  }

  // Electron 为 vibrancy 保持透明根背景，但普通浏览器需要从文档根和标准 meta
  // 获得页面主题。只切换 React 的 dark class 会让浏览器工具栏、原生控件和 overscroll 留在旧主题。
  root.setAttribute(BROWSER_THEME_SURFACE_ATTRIBUTE, resolved);
  root.style.colorScheme = resolved;
  setThemeMetaContent("color-scheme", resolved);

  const background = getComputedStyle(root).getPropertyValue("--color-background").trim();
  if (background) {
    setThemeMetaContent("theme-color", background);
  }
}

export function applyTheme(theme: Theme) {
  const resolved = resolveTheme(theme);
  const appliedTheme = normalizeThemePreference(theme);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.classList.toggle("theme-light", appliedTheme === "light");
  document.documentElement.classList.toggle("theme-dark", appliedTheme === "dark");
  document.documentElement.classList.toggle("theme-black", appliedTheme === "black");
  syncBrowserThemeSurface(resolved);
}

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "black";
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isTheme(saved) ? normalizeThemePreference(saved) : "dark";
  });

  const setTheme = useCallback((t: Theme) => {
    const normalizedTheme = normalizeThemePreference(t);
    localStorage.setItem(STORAGE_KEY, normalizedTheme);
    setThemeState(normalizedTheme);
    applyTheme(normalizedTheme);
  }, []);

  // Initialize the selected theme.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return { theme, setTheme } as const;
}
