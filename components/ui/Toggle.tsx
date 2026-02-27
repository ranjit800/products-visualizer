"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

export type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
};

export function Toggle({ checked, onChange, label, disabled, id, className }: ToggleProps) {
  const toggleId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        id={toggleId}
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
          "transition-colors duration-200 ease-in-out",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "bg-slate-900 dark:bg-slate-50"
            : "bg-slate-200 dark:bg-slate-700",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0",
            "transition-transform duration-200 ease-in-out",
            "dark:bg-slate-900",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
      {label && (
        <label
          htmlFor={toggleId}
          className={cn(
            "cursor-pointer select-none text-sm font-medium text-slate-700 dark:text-slate-300",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}
