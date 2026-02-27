"use client";

/**
 * ConfiguratorControls — the sidebar panel with:
 * - Color/material swatches
 * - Component toggles
 * - Lighting preset selector
 * - Undo / Redo / Reset buttons
 */

import * as React from "react";

import { Button, Slider, Toggle } from "@/components/ui";
import { type LightingPreset, useConfiguratorStore } from "@/store/configuratorStore";
import { cn } from "@/lib/cn";

/* ── Color palette (shared presets) ── */
const COLOR_SWATCHES = [
  { label: "Slate",   value: "#1e293b" },
  { label: "Stone",   value: "#78716c" },
  { label: "White",   value: "#f8fafc" },
  { label: "Orange",  value: "#f97316" },
  { label: "Emerald", value: "#10b981" },
  { label: "Blue",    value: "#3b82f6" },
  { label: "Rose",    value: "#f43f5e" },
  { label: "Violet",  value: "#8b5cf6" },
];

/* ── Lighting presets ── */
const LIGHTING_OPTIONS: { value: LightingPreset; label: string; icon: string }[] = [
  { value: "studio",   label: "Studio",  icon: "💡" },
  { value: "daylight", label: "Daylight", icon: "☀️" },
  { value: "warm",     label: "Warm",    icon: "🕯️" },
];

/* ── Default component accessories ── */
const ACCESSORY_DEFAULTS: { id: string; label: string }[] = [
  { id: "cushion",   label: "Cushion" },
  { id: "armrest",   label: "Armrest" },
  { id: "lampshade", label: "Lamp shade" },
];

export function ConfiguratorControls() {
  const {
    materials,
    components,
    lighting,
    camera,
    setMaterial,
    toggleComponent,
    setLighting,
    setCamera,
    reset,
    undo,
    redo,
    _past,
    _future,
  } = useConfiguratorStore();

  const primaryColor = materials["primary"] ?? COLOR_SWATCHES[0].value;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Color Swatches ── */}
      <section aria-labelledby="color-label">
        <h3 id="color-label" className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Color
        </h3>
        <div role="listbox" aria-label="Color options" className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((swatch) => {
            const selected = primaryColor === swatch.value;
            return (
              <button
                key={swatch.value}
                type="button"
                role="option"
                aria-selected={selected}
                aria-label={swatch.label}
                onClick={() => setMaterial("primary", swatch.value)}
                style={{ backgroundColor: swatch.value }}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
                  selected
                    ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2 dark:border-white dark:ring-white"
                    : "border-white dark:border-slate-800",
                )}
              />
            );
          })}
        </div>
      </section>

      {/* ── Component Toggles ── */}
      <section aria-labelledby="accessories-label">
        <h3 id="accessories-label" className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Accessories
        </h3>
        <div className="flex flex-col gap-3">
          {ACCESSORY_DEFAULTS.map((acc) => (
            <Toggle
              key={acc.id}
              id={`toggle-${acc.id}`}
              label={acc.label}
              checked={components[acc.id] ?? false}
              onChange={(v) => toggleComponent(acc.id, v)}
            />
          ))}
        </div>
      </section>

      {/* ── Lighting Presets ── */}
      <section aria-labelledby="lighting-label">
        <h3 id="lighting-label" className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Lighting
        </h3>
        <div role="listbox" aria-label="Lighting presets" className="flex gap-2">
          {LIGHTING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={lighting === opt.value}
              onClick={() => setLighting(opt.value)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg border px-2 py-2 text-xs font-medium transition",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
                lighting === opt.value
                  ? "border-slate-900 bg-slate-900 text-white dark:border-slate-50 dark:bg-slate-50 dark:text-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
              )}
            >
              <span aria-hidden="true" className="text-base">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Camera Controls ── */}
      <section aria-labelledby="camera-label">
        <h3 id="camera-label" className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Camera
        </h3>
        <div className="flex flex-col gap-4">
          <Slider
            label="Rotation"
            min={-180}
            max={180}
            value={camera.azimuth}
            onChange={(v) => setCamera({ azimuth: v })}
          />
          <Slider
            label="Elevation"
            min={5}
            max={85}
            value={camera.elevation}
            onChange={(v) => setCamera({ elevation: v })}
          />
          <Slider
            label="Zoom"
            min={1}
            max={8}
            step={0.1}
            value={camera.distance}
            onChange={(v) => setCamera({ distance: v })}
          />
        </div>
      </section>

      {/* ── Undo / Redo / Reset ── */}
      <section className="flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={undo}
            disabled={_past.length === 0}
            aria-label="Undo last change"
            className="flex-1"
          >
            ↩ Undo
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={redo}
            disabled={_future.length === 0}
            aria-label="Redo last change"
            className="flex-1"
          >
            ↪ Redo
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          aria-label="Reset configuration to defaults"
        >
          ↺ Reset to defaults
        </Button>
      </section>
    </div>
  );
}
