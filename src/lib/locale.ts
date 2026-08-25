import { useEffect, useState } from "react";

export type Locale = "ru" | "en";

const STORAGE_KEY = "dh_locale";
const EVENT = "dh-locale";

export function isLocale(value: unknown): value is Locale {
  return value === "ru" || value === "en";
}

export function getLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // private mode / blocked storage
  }
  return "ru";
}

export function applyLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale === "en" ? "en" : "ru";
}

export function setLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // private mode / blocked storage
  }
  applyLocale(locale);
  window.dispatchEvent(new Event(EVENT));
}

export function useLocale(): Locale {
  const [locale, set] = useState<Locale>(() =>
    typeof window === "undefined" ? "ru" : getLocale()
  );

  useEffect(() => {
    const sync = () => set(getLocale());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return locale;
}
