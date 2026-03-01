"use client";

import * as React from "react";
import Link from "next/link";

export default function OfflinePage() {
  const [lastViewed, setLastViewed] = React.useState<{ slug: string; title: string } | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("visualizer_last_viewed");
      if (saved) {
        try {
          setLastViewed(JSON.parse(saved));
        } catch (e) {
          console.warn("Failed to parse last viewed product:", e);
        }
      }
    }
  }, []);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400" aria-hidden="true">
          <line x1="1" y1="1" x2="23" y2="23" /><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" /><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" /><path d="M10.71 5.05A16 16 0 0 1 22.56 9" /><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          You&apos;re offline
        </h1>
        <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400">
          It looks like you&apos;ve lost your internet connection.
        </p>
      </div>

      {lastViewed && (
        <div className="mt-4 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm max-w-xs w-full">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Continue where you left off</p>
          <h3 className="text-lg font-bold mb-4">{lastViewed.title}</h3>
          <Link
            href={`/products/${lastViewed.slug}`}
            className="flex h-11 items-center justify-center rounded-xl bg-violet-600 px-6 text-sm font-bold text-white hover:bg-violet-700 transition-colors"
          >
            Open Last Viewed
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Link
          href="/products"
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Back to Catalog
        </Link>
      </div>
    </main>
  );
}
