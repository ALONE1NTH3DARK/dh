import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "dh_theme";
const EVENT = "dh-theme";

const DARK_COLOR = "#06040a";
const LIGHT_COLOR = "#f4f1fa";

/** Светлая с 6:00 до 18:00, иначе тёмная — пока пользователь не выбрал тему сам. */
export function themeByTime(date = new Date()): Theme {
  const hour = date.getHours();
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

export function getTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // private mode / blocked storage
  }
  return themeByTime();
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.dataset.theme = "light";
  } else {
    delete root.dataset.theme;
  }
  root.style.colorScheme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "light" ? LIGHT_COLOR : DARK_COLOR);
  }
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // private mode / blocked storage
  }
  applyTheme(theme);
  window.dispatchEvent(new Event(EVENT));
}

export function useTheme(): Theme {
  const [theme, set] = useState<Theme>(() =>
    typeof window === "undefined" ? "dark" : getTheme()
  );

  useEffect(() => {
    const sync = () => set(getTheme());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return theme;
}
