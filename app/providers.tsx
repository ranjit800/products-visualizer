"use client";

import * as React from "react";

import { I18nProvider } from "@/components/i18n/I18nProvider";
import { ToastContainer } from "@/components/ui/ToastContainer";
import type { Locale } from "@/lib/i18n";

export function Providers({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      {children}
      <ToastContainer />
    </I18nProvider>
  );
}
