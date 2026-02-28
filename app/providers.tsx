"use client";

import * as React from "react";

import { I18nProvider } from "@/components/i18n/I18nProvider";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { useUIStore } from "@/store/uiStore";
import type { Locale } from "@/lib/i18n";

/* Syncs the Zustand theme to the <html> element's class list */
function ThemeApplier() {
  const theme = useUIStore((s) => s.theme);
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "high-contrast");
    if (theme === "dark") root.classList.add("dark");
    if (theme === "high-contrast") root.classList.add("dark", "high-contrast");
  }, [theme]);
  return null;
}

export function Providers({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      <ThemeApplier />
      {children}
      <ToastContainer />
    </I18nProvider>
  );
}
