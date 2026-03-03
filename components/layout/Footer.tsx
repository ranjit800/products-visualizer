"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer suppressHydrationWarning className="hidden md:block border-t border-slate-200 py-8 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300 ">
      <div className="mx-auto max-w-6xl px-4">
        <p>
          {t("appName")} — {t("footerTagline")}
        </p>
      </div>
    </footer>
  );
}

