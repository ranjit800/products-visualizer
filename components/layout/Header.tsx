"use client";

import Link from "next/link";

import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";

export function Header() {
  const { locale, setLocale, t } = useI18n();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          {t("appName")}
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"
        >
          <Link href="/products" className="hover:text-slate-900 dark:hover:text-white">
            {t("navProducts")}
          </Link>
          <Link href="/admin/preview" className="hover:text-slate-900 dark:hover:text-white">
            {t("navAdmin")}
          </Link>

          <Button
            variant="ghost"
            size="sm"
            aria-label="Change language"
            onClick={() => setLocale(locale === "en" ? "hi" : "en")}
          >
            {locale.toUpperCase()}
          </Button>
        </nav>
      </div>
    </header>
  );
}

