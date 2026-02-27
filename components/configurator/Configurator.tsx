"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import { useConfiguratorStore, type LightingPreset } from "@/store/configuratorStore";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/cn";
import { ARButton } from "./ARButton";

/* ── Lazy 3D viewer ── */
const ModelViewerCore = dynamic(
  () => import("@/components/configurator/ModelViewerCore").then((m) => m.ModelViewerCore),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-violet-400" />
      </div>
    ),
  },
);

const COLORS = [
  { label: "Slate",   hex: "#1e293b" },
  { label: "Stone",   hex: "#78716c" },
  { label: "White",   hex: "#f1f5f9" },
  { label: "Orange",  hex: "#f97316" },
  { label: "Emerald", hex: "#10b981" },
  { label: "Blue",    hex: "#3b82f6" },
  { label: "Rose",    hex: "#f43f5e" },
  { label: "Violet",  hex: "#8b5cf6" },
  { label: "Amber",   hex: "#f59e0b" },
  { label: "Cyan",    hex: "#06b6d4" },
] as const;

const ACCESSORIES = [
  { id: "cushion",   label: "Cushion",    icon: "🪑" },
  { id: "armrest",   label: "Armrest",    icon: "🦾" },
  { id: "lampshade", label: "Lamp Shade", icon: "💡" },
  { id: "base",      label: "Base Plate", icon: "⬛" },
] as const;

const LIGHTING = [
  { value: "studio"   as LightingPreset, label: "Studio",  icon: "💡" },
  { value: "daylight" as LightingPreset, label: "Daylight", icon: "☀️" },
  { value: "warm"     as LightingPreset, label: "Warm",    icon: "🕯️" },
] as const;

const VIEWPORT_BG: Record<LightingPreset, string> = {
  studio:   "radial-gradient(ellipse at 55% 35%, #1e293b 0%, #0d1117 100%)",
  daylight: "radial-gradient(ellipse at 50% 15%, #fef9c3 0%, #7dd3fc 45%, #0284c7 100%)",
  warm:     "radial-gradient(ellipse at 55% 25%, #92400e 0%, #1c0a03 100%)",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="h-px bg-white/8" />;
}

type ConfiguratorProps = {
  productSlug: string;
  productName: string;
  defaultOpen?: boolean;
};

export function Configurator({ productSlug, productName, defaultOpen = false }: ConfiguratorProps) {
  const {
    materials, components, lighting, camera,
    openProduct, setMaterial, toggleComponent, setLighting, setCamera,
    reset, undo, redo, _past, _future,
  } = useConfiguratorStore();

  const { flags, addToast } = useUIStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasModel, setHasModel] = React.useState(false);

  React.useEffect(() => {
    if (defaultOpen) setIsOpen(true);
  }, [defaultOpen]);

  React.useEffect(() => {
    openProduct(productSlug);
    // Check if real model exists
    fetch(`/models/${productSlug}.glb`, { method: "HEAD" })
      .then((r) => setHasModel(r.ok))
      .catch(() => setHasModel(false));
  }, [productSlug, openProduct]);

  const tintColor = materials["primary"] ?? "#1e293b";
  const activeAcc = Object.entries(components).filter(([, v]) => v).map(([k]) => k);

  const scale = 0.55 + ((camera.distance - 1) / 7) * 0.45;
  const transform = `perspective(700px) rotateY(${camera.azimuth * 0.5}deg) rotateX(${-camera.elevation * 0.2}deg) scale(${scale})`;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/configurations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, materials, components, lightingPreset: lighting, camera }),
      });
      if (!res.ok) throw new Error();
      const { id } = await res.json();
      await navigator.clipboard.writeText(`${location.origin}/share/${id}`).catch(() => null);
      addToast({ message: "Saved! Link copied to clipboard.", type: "success" });
    } catch {
      addToast({ message: "Save failed. Try again.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Closed State ──
  if (!isOpen) {
    return (
      <div className="relative flex flex-col items-center gap-6 overflow-hidden bg-slate-900 px-8 py-14 text-center rounded-2xl dark:bg-black">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
        </div>

        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
          </svg>
        </div>

        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight text-white">Interactive 3D Configurator</h2>
          <p className="mt-2 text-sm text-white/70">Customize colors, accessories, and preview in real-time.</p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="relative inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 font-semibold text-white shadow transition hover:bg-violet-500"
        >
          Customize Product
        </button>
      </div>
    );
  }

  // ── Open Editor State ──
  // Container uses responsive height so mobile doesn't get clipped.
  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-slate-700 bg-[#0d1117] shadow-2xl h-[85vh] max-h-[850px] md:h-[700px]">
      
      {/* ────────────────────────────────────────────────────────
          MAIN EDITOR ROW: Left Sidebar (Bottom on mobile) + Right Viewport (Top on mobile)
          ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden min-h-0">
        
        {/* LEFT SIDEBAR (Controls) - On mobile, this becomes the bottom scrolling panel */}
        <div
          className="flex h-full w-full md:w-64 lg:w-72 shrink-0 flex-col border-r border-white/8 bg-[#111820] min-w-0 md:min-w-[256px]"
        >
          {/* Editor Header / Close */}
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/8 px-4">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50">
              <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
              Editor
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white transition-colors"
              title="Close editor"
              aria-label="Close editor"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-0 overflow-y-auto overflow-x-hidden">
            {/* COLOR */}
            <div className="p-4">
              <SectionLabel>Material Color</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 36px)", gap: 8 }} role="listbox">
                {COLORS.map((c) => {
                  const active = tintColor === c.hex;
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      role="option"
                      aria-selected={active}
                      aria-label={c.label}
                      title={c.label}
                      onClick={() => setMaterial("primary", c.hex)}
                      style={{
                        width: 36, height: 36, borderRadius: "50%", backgroundColor: c.hex,
                        outline: active ? "2px solid white" : "1px solid rgba(255,255,255,0.1)",
                        outlineOffset: active ? 2 : 0, transform: active ? "scale(1.15)" : "scale(1)",
                        transition: "all 0.15s ease", cursor: "pointer",
                      }}
                    />
                  );
                })}
              </div>
              <p className="mt-2 font-mono text-[10px] text-white/25">{tintColor}</p>
            </div>

            <Divider />

            {/* ACCESSORIES */}
            <div className="p-4">
              <SectionLabel>Accessories</SectionLabel>
              <div className="flex flex-col gap-1.5">
                {ACCESSORIES.map((acc) => {
                  const on = components[acc.id] ?? false;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      role="switch"
                      aria-checked={on}
                      onClick={() => toggleComponent(acc.id, !on)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all",
                        on ? "bg-violet-500/20 text-white ring-1 ring-violet-500/40" : "bg-white/5 text-white/45 hover:bg-white/8 hover:text-white/70",
                      )}
                    >
                      <span aria-hidden="true">{acc.icon}</span>
                      <span className="flex-1 text-left font-medium">{acc.label}</span>
                      <div className={cn("relative h-4 w-7 rounded-full transition-colors", on ? "bg-violet-500" : "bg-white/15")}>
                        <div className={cn("absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all", on ? "left-3.5" : "left-0.5")} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Divider />

            {/* LIGHTING */}
            <div className="p-4">
              <SectionLabel>Lighting</SectionLabel>
              <div className="grid grid-cols-3 gap-1.5" role="listbox">
                {LIGHTING.map((l) => {
                  const active = lighting === l.value;
                  return (
                    <button
                      key={l.value}
                      role="option"
                      aria-selected={active}
                      onClick={() => setLighting(l.value)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-lg py-2.5 text-[10px] font-medium transition-all",
                        active ? "bg-violet-500/20 text-white ring-1 ring-violet-500/50" : "bg-white/5 text-white/35 hover:bg-white/8 hover:text-white/60",
                      )}
                    >
                      <span className="text-base" aria-hidden="true">{l.icon}</span>
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Divider />

            {/* CAMERA */}
            <div className="p-4">
              <SectionLabel>Camera</SectionLabel>
              <div className="flex flex-col gap-4">
                {(
                  [
                    { key: "azimuth" as const,   label: "Rotation",  min: -180, max: 180, step: 1,   unit: "°" },
                    { key: "elevation" as const,  label: "Elevation", min: 5,    max: 85,  step: 1,   unit: "°" },
                    { key: "distance" as const,   label: "Zoom",      min: 1,    max: 8,   step: 0.1, unit: "×" },
                  ]
                ).map(({ key, label, min, max, step, unit }) => {
                  const val = camera[key];
                  const pct = ((val - min) / (max - min)) * 100;
                  return (
                    <div key={key} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <label className="font-medium text-white/50">{label}</label>
                        <span className="font-mono text-white/25">{typeof val === "number" && step < 1 ? val.toFixed(1) : val}{unit}</span>
                      </div>
                      <div className="relative flex h-5 items-center">
                        <div className="absolute inset-x-0 h-[3px] rounded-full" style={{ background: `linear-gradient(to right, #7c3aed ${pct}%, rgba(255,255,255,0.1) ${pct}%)` }} />
                        <div className="pointer-events-none absolute h-3.5 w-3.5 rounded-full bg-white shadow-md" style={{ left: `calc(${pct}% - 7px)` }} />
                        <input
                          type="range"
                          min={min} max={max} step={step} value={val}
                          onChange={(e) => setCamera({ [key]: Number(e.target.value) })}
                          aria-label={label}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Divider />

            {/* HISTORY */}
            <div className="p-4 border-b border-white/8">
              <SectionLabel>History</SectionLabel>
              <div className="flex gap-2">
                <button onClick={undo} disabled={_past.length === 0} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-white/5 py-2 text-[11px] text-white/40 hover:bg-white/8 hover:text-white disabled:opacity-25 transition">
                  ↩ Undo{_past.length > 0 ? ` (${_past.length})` : ""}
                </button>
                <button onClick={redo} disabled={_future.length === 0} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-white/5 py-2 text-[11px] text-white/40 hover:bg-white/8 hover:text-white disabled:opacity-25 transition">
                  ↪ Redo{_future.length > 0 ? ` (${_future.length})` : ""}
                </button>
              </div>
              <button onClick={reset} className="mt-2 w-full rounded-lg py-2 text-[11px] text-white/25 hover:bg-red-500/10 hover:text-red-400 transition">
                ↺ Reset to defaults
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT VIEWPORT (Model + Top/Bottom bars) - On mobile, this is on top */}
        <div
          className="relative flex flex-1 flex-col overflow-hidden min-h-[40vh] md:min-h-0 border-b md:border-b-0 border-white/8"
          style={{ background: VIEWPORT_BG[lighting], transition: "background 0.6s ease" }}
        >
          {/* Top Tool Bar */}
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/6 bg-black/30 px-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white/70 capitalize">{productName}</span>
              {!hasModel && (
                <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400/70">
                  CSS Preview
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex h-7 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-[11px] font-semibold text-white hover:bg-violet-500 disabled:opacity-60 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              {isSaving ? "Saving…" : "Save & Share"}
            </button>
          </div>

          {/* Render box */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            {hasModel ? (
              <ModelViewerCore src={`/models/${productSlug}.glb`} alt={`3D model of ${productName}`} />
            ) : (
              <div className="flex flex-col items-center gap-8">
                <div
                  style={{ width: 240, height: 240, borderRadius: 28, backgroundColor: tintColor, transform, transition: "background-color 0.35s ease, transform 0.25s ease", boxShadow: `0 40px 100px ${tintColor}70, 0 0 120px ${tintColor}25`, display: "flex", alignItems: "center", justifyContent: "center" }}
                  role="img" aria-label={`Preview: ${tintColor}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" opacity="0.6">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
                  </svg>
                </div>
                {activeAcc.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {activeAcc.map(id => {
                      const a = ACCESSORIES.find(x => x.id === id);
                      return <span key={id} className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-medium text-white">{a?.icon} {a?.label ?? id}</span>;
                    })}
                  </div>
                )}
              </div>
            )}
            
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/5 bg-black/40 px-4 py-1.5 text-[10px] text-white/25 backdrop-blur-sm">
              <span>{hasModel ? "Drag to orbit" : "Color preview mode"}</span>
              <span className="font-mono tabular-nums">{tintColor} · {lighting}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AR Footer Bar (Optional, only if flag enabled) */}
      {flags.enableAR && (
        <div className="flex shrink-0 items-center justify-between border-t border-white/8 bg-[#0b0e14] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m8 17 4 4 4-4" /></svg>
            </span>
            <div>
              <p className="text-xs font-semibold text-white/80">View in your space</p>
              <p className="text-[10px] text-white/40">Requires ARCore / ARKit compatible device</p>
            </div>
          </div>
          <ARButton modelSrc={`/models/${productSlug}.glb`} posterSrc={`/images/products/${productSlug}.svg`} productName={productName} />
        </div>
      )}
    </div>
  );
}
