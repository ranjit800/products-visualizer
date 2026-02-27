"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

export type SelectOption = { label: string; value: string };

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
};

export function Select({
  className,
  label,
  options,
  placeholder,
  error,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900",
          "focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50",
          "dark:focus:border-slate-400 dark:focus:ring-slate-400/20",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className,
        )}
        aria-invalid={!!error}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
