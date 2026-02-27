"use client";

import * as React from "react";
import Link from "next/link";

import { Toggle, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { useUIStore, type Theme, type FeatureFlags } from "@/store/uiStore";
import { cn } from "@/lib/cn";

/* ── Theme options ── */
const THEMES: { value: Theme; label: string; icon: string; description: string }[] = [
  { value: "light", label: "Light", icon: "☀️", description: "Default light mode" },
  { value: "dark", label: "Dark", icon: "🌙", description: "Dark mode for low light" },
  { value: "high-contrast", label: "High Contrast", icon: "⬛", description: "Enhanced visibility" },
];

/* ── Feature flag definitions ── */
const FLAG_DEFS: { key: keyof FeatureFlags; label: string; description: string; badge: string }[] = [
  {
    key: "enableAR",
    label: "AR Preview",
    description: "Show AR button on configurator for supported mobile devices",
    badge: "AR",
  },
  {
    key: "enablePresence",
    label: "Live Presence Indicator",
    description: "Show how many users are viewing the same product",
    badge: "WebSocket",
  },
  {
    key: "enableAdvancedLighting",
    label: "Advanced Lighting",
    description: "Enable extra lighting presets in the 3D configurator",
    badge: "3D",
  },
];

export default function AdminPreviewPage() {
  const { theme, flags, setTheme, setFlag, addToast } = useUIStore();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    addToast({ message: `Theme changed to "${newTheme}"`, type: "success" });
  };

  const handleFlagChange = (flag: keyof FeatureFlags, value: boolean) => {
    setFlag(flag, value);
    const def = FLAG_DEFS.find((f) => f.key === flag);
    addToast({
      message: `${def?.label ?? flag} ${value ? "enabled" : "disabled"}`,
      type: value ? "success" : "info",
    });
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Admin Preview
          </h1>
          <Badge variant="warning">Admin Only</Badge>
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Manage global theme and feature flags. Changes apply instantly and persist to localStorage.
        </p>
        <Link
          href="/products"
          className="mt-3 inline-flex text-sm text-slate-500 underline underline-offset-4 hover:text-slate-800 dark:hover:text-slate-200"
        >
          ← Back to catalog
        </Link>
      </div>

      {/* ── Theme Section ── */}
      <section aria-labelledby="theme-heading" className="mb-8">
        <h2 id="theme-heading" className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
          Global Theme
        </h2>
        <div className="grid gap-3 sm:grid-cols-3" role="listbox" aria-label="Theme options">
          {THEMES.map((t) => {
            const isActive = theme === t.value;
            return (
              <button
                key={t.value}
                type="button"
                role="option"
                aria-selected={isActive}
                aria-label={`Set theme to ${t.label}`}
                onClick={() => handleThemeChange(t.value)}
                className={cn(
                  "flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500",
                )}
              >
                <span className="text-2xl" aria-hidden="true">{t.icon}</span>
                <div>
                  <p className="font-semibold">{t.label}</p>
                  <p className={cn("text-xs", isActive ? "opacity-75" : "text-slate-500 dark:text-slate-400")}>
                    {t.description}
                  </p>
                </div>
                {isActive && (
                  <span className="mt-auto self-end text-xs font-medium opacity-80">✓ Active</span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Feature Flags Section ── */}
      <section aria-labelledby="flags-heading">
        <h2 id="flags-heading" className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
          Feature Flags
        </h2>
        <div className="flex flex-col gap-3">
          {FLAG_DEFS.map((def) => (
            <Card key={def.key}>
              <CardContent className="flex items-center justify-between gap-4 pt-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {def.label}
                    </span>
                    <Badge variant="info">{def.badge}</Badge>
                    <Badge variant={flags[def.key] ? "success" : "default"}>
                      {flags[def.key] ? "ON" : "OFF"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{def.description}</p>
                </div>
                <Toggle
                  id={`flag-${def.key}`}
                  checked={flags[def.key]}
                  onChange={(v) => handleFlagChange(def.key, v)}
                  aria-label={`Toggle ${def.label}`}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Current state summary ── */}
      <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Current State (persisted)
        </h3>
        <pre className="overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-emerald-400 dark:bg-black">
          {JSON.stringify({ theme, flags }, null, 2)}
        </pre>
      </section>
    </main>
  );
}
