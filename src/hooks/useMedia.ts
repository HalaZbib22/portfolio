"use client";

import { useCallback, useSyncExternalStore } from "react";
import { THEMES, type ThemeId } from "@/lib/content";

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const mq = matchMedia(RM);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
export function useReducedMotion() {
  return useSyncExternalStore(subscribeRM, () => matchMedia(RM).matches, () => false);
}

export const THEME_KEY = "hz-theme";
const isTheme = (v: unknown): v is ThemeId => THEMES.some((t) => t.id === v);

/**
 * The theme lives on <html data-theme>; the inline script in layout.tsx applies the saved
 * value before first paint, so this store simply mirrors the attribute.
 */
const subscribeTheme = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};
const readTheme = (): ThemeId => {
  const t = document.documentElement.getAttribute("data-theme");
  return isTheme(t) ? t : "night";
};
export function useTheme(): [ThemeId, (id: ThemeId) => void] {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "night" as ThemeId);
  const setTheme = useCallback((id: ThemeId) => {
    document.documentElement.setAttribute("data-theme", id);
    try { localStorage.setItem(THEME_KEY, id); } catch {}
  }, []);
  return [theme, setTheme];
}
