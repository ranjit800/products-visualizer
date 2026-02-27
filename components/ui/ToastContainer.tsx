"use client";

import * as React from "react";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/cn";

const VARIANT_CLASSES = {
  success: "bg-emerald-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-slate-800 text-white",
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={cn(
            "flex items-center justify-between gap-4 rounded-lg px-4 py-3 shadow-lg",
            "min-w-64 max-w-sm text-sm font-medium",
            "animate-in slide-in-from-bottom-2 fade-in-0 duration-200",
            VARIANT_CLASSES[toast.type],
          )}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => removeToast(toast.id)}
            className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
