"use client";

import * as React from "react";

import { DEFAULT_LOCALE, type Dictionary, getDictionary, type Locale, t } from "@/lib/i18n";

export const LOCALE_COOKIE_KEY = "viz_locale";

type I18nContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  dict: Dictionary;
  t: (key: string) => string;
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

const LOCALE_STORAGE_KEY = "viz_locale";

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale);

  React.useEffect(() => {
    const cookieLocale = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${LOCALE_COOKIE_KEY}=`))
      ?.split("=")[1];
    if (cookieLocale === "en" || cookieLocale === "hi") {
      setLocaleState(cookieLocale);
      window.localStorage.setItem(LOCALE_STORAGE_KEY, cookieLocale);
      return;
    }

    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "hi") setLocaleState(stored);
  }, []);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE_KEY}=${next}; path=/; max-age=31536000; samesite=lax`;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  const dict = React.useMemo(() => getDictionary(locale), [locale]);
  const translate = React.useCallback((key: string) => t(dict, key), [dict]);

  const value = React.useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      dict,
      t: translate,
    }),
    [dict, locale, setLocale, translate],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

