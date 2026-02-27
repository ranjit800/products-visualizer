"use client";

import * as React from "react";

import { I18nProvider } from "@/components/i18n/I18nProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}

