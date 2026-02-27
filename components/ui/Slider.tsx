"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

export type SliderProps = {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  showValue?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
};

export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  showValue = true,
  disabled,
  id,
  className,
}: SliderProps) {
  const sliderId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={sliderId}
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm tabular-nums text-slate-500 dark:text-slate-400">{value}</span>
          )}
        </div>
      )}
      <div className="relative flex items-center">
        <input
          type="range"
          id={sliderId}
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
          style={{ "--slider-pct": `${percentage}%` } as React.CSSProperties}
          className={cn(
            "h-2 w-full cursor-pointer appearance-none rounded-full",
            "bg-slate-200 dark:bg-slate-700",
            "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-slate-900 [&::-webkit-slider-thumb]:shadow-sm",
            "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
            "dark:[&::-webkit-slider-thumb]:bg-slate-50",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      </div>
    </div>
  );
}
