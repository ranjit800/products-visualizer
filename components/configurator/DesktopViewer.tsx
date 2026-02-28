"use client";
// ── DesktopViewer.tsx ─────────────────────────────────────────────────────────
// This is the DESKTOP-ONLY 3D product viewer.
// Mobile users never download this file (lazy-loaded in ModelViewer3D.tsx).
//
// ✏️  Customise this file freely — changes here won't affect MobileViewer.tsx.
//
// Current layout:  side-by-side  [ 3D viewer | product info & config sidebar ]
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react";
import type { Product } from "@/lib/products";
import { useUIStore } from "@/store/uiStore";
import {
  loadModelViewer,
  COLORS,
  BASE_LIGHTING,
  EXTRA_LIGHTING,
  ACCESSORIES_DEF,
} from "./shared";
import { PresenceBadge } from "./PresenceBadge";

type DesktopViewerProps = {
  product: Product & { title: { en: string; hi: string } };
  formatPrice: string;
};

export function DesktopViewer({ product, formatPrice }: DesktopViewerProps) {
  const { flags } = useUIStore();
  const [ready, setReady] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [showARFailed, setShowARFailed] = React.useState(false);
  const [canAR, setCanAR] = React.useState(false);
  const viewerRef = React.useRef<HTMLElement | null>(null);

  // ── Configuration State ──
  const [activeColor, setActiveColor] = React.useState("#1e293b");
  const [exposure, setExposure] = React.useState(1.0);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMsg, setSaveMsg] = React.useState("");
  const [restoredMsg, setRestoredMsg] = React.useState("");
  const [activeLightingIdx, setActiveLightingIdx] = React.useState(0);
  const [accessories, setAccessories] = React.useState<Record<string, boolean>>({
    cushion: false, armrest: false, lampshade: false, base: false,
  });

  const modelSrc = `/models/${product.slug}.glb`;
  const posterSrc = `/images/products/${product.slug}.svg`;

  const LIGHTING = flags.enableAdvancedLighting
    ? [...BASE_LIGHTING, ...EXTRA_LIGHTING]
    : BASE_LIGHTING;

  React.useEffect(() => {
    setMounted(true);
    loadModelViewer().then(() => setReady(true)).catch(() => setReady(true));

    // ── Restore from configId in URL on mount ──
    const params = new URLSearchParams(window.location.search);
    const configId = params.get("configId");
    if (!configId) return;
    fetch(`/api/configurations/${configId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((config) => {
        if (!config) return;
        if (config.materials?.primary) setActiveColor(config.materials.primary);
        const presetToIdx: Record<string, number> = { studio: 0, daylight: 1, warm: 2 };
        const idx = presetToIdx[config.lightingPreset ?? "studio"] ?? 0;
        setActiveLightingIdx(idx);
        setExposure(typeof config.exposure === "number" ? config.exposure : (LIGHTING[idx]?.exposure ?? 1.0));
        if (config.components && typeof config.components === "object") {
          setAccessories((prev) => ({ ...prev, ...(config.components as Record<string, boolean>) }));
        }
        setRestoredMsg("✓ Configuration restored!");
        setTimeout(() => setRestoredMsg(""), 3000);
      })
      .catch(() => null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    const viewer = viewerRef.current;
    if (!viewer) return;
    const onLoad = () => {
      // @ts-expect-error custom element
      setCanAR(!!viewer.canActivateAR);
    };
    viewer.addEventListener("load", onLoad);
    return () => viewer.removeEventListener("load", onLoad);
  }, [ready]);

  const toggleAccessory = (id: string) =>
    setAccessories((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const presetNames = ["studio", "daylight", "warm"] as const;
      const res = await fetch("/api/configurations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          materials: { primary: activeColor },
          components: accessories,
          lightingPreset: presetNames[activeLightingIdx] ?? "studio",
          exposure,
          camera: { azimuth: 0, elevation: 45, distance: 4 },
        }),
      });
      if (!res.ok) throw new Error();
      const { id } = await res.json();
      await navigator.clipboard.writeText(`${location.origin}/share/${id}`).catch(() => null);
      setSaveMsg("✓ Link copied!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("Save failed");
      setTimeout(() => setSaveMsg(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 56, // sits flush below the site navbar
      left: 0, right: 0, bottom: 0,
      overflow: "hidden",
      display: "flex",
      backgroundColor: "#f5f5f5",
      zIndex: 10,
    }}>
      {/* ── Left: 3D Viewer ── */}
      <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
        {ready ? (
          /* @ts-expect-error custom element */
          <model-viewer
            ref={viewerRef}
            src={modelSrc}
            alt={`3D model of ${product.title.en}`}
            poster={posterSrc}
            camera-controls
            auto-rotate
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="auto"
            ios-src={`/models/${product.slug}.usdz`}
            shadow-intensity="1"
            tone-mapping="commerce"
            environment-image={LIGHTING[activeLightingIdx]?.value}
            exposure={exposure}
            loading="eager"
            reveal="auto"
            onArStatus={(e: CustomEvent) => {
              if (e.detail?.status === "failed") setShowARFailed(true);
            }}
            style={{ width: "100%", height: "100%", display: "block", background: "transparent" }}
            suppressHydrationWarning
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                border: "4px solid rgba(0,0,0,0.08)",
                borderTopColor: "#7c3aed",
                animation: "spin 0.8s linear infinite",
              }} />
              <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500 }}>Loading 3D Model…</p>
            </div>
          </div>
        )}

        {/* Top-left: back button */}
        <div style={{ position: "absolute", top: 16, left: 16, zIndex: 20 }}>
          <a
            href="/products"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 40, height: 40, borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)", color: "#1e293b",
              textDecoration: "none", fontSize: 18, fontWeight: 700,
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            ←
          </a>
        </div>
      </div>

      {/* ── Right: Product info & Config sidebar ── */}
      <div className="desktop-info-panel" style={{
        width: 380,
        flexShrink: 0,
        backgroundColor: "#0d1117", // Dark theme like the modal
        color: "rgba(255,255,255,0.9)",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        overflowY: "auto",
        scrollbarWidth: "none",
        display: "flex",
        flexDirection: "column",
        padding: "32px 24px",
        gap: 24,
      }}>
        {/* Header: Name, Price, Save */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
              {product.title.en}
            </h1>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: "8px 16px", borderRadius: 12, backgroundColor: "#7c3aed",
                color: "white", fontSize: 12, fontWeight: 700, border: "none",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {isSaving ? "Saving…" : "Save & Share"}
            </button>
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#a78bfa" }}>
            {formatPrice}
          </span>
          {(saveMsg || restoredMsg) && (
            <div style={{ fontSize: 12, fontWeight: 600, color: "#10b981", marginTop: 4 }}>
              {saveMsg || restoredMsg}
            </div>
          )}
        </div>

        {flags.enablePresence && <PresenceBadge />}

        {/* Tags */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            padding: "4px 10px", borderRadius: 6,
            backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)",
            fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
          }}>
            {product.category}
          </span>
          {product.tags.map(tag => (
            <span key={tag} style={{
              padding: "4px 10px", borderRadius: 6,
              backgroundColor: "rgba(139,92,246,0.15)", color: "#a78bfa",
              fontSize: 10, fontWeight: 700,
            }}>
              {tag}
            </span>
          ))}
        </div>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
          {product.description.en}
        </p>

        <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />

        {/* ── Configuration Controls ── */}

        {/* Material Color */}
        <section>
          <header style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            Material Color
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
            {COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => setActiveColor(c.hex)}
                style={{
                  aspectRatio: "1/1", borderRadius: "50%", backgroundColor: c.hex,
                  border: "none", cursor: "pointer",
                  outline: activeColor === c.hex ? "2px solid white" : "none",
                  outlineOffset: 2,
                  transform: activeColor === c.hex ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.15s ease",
                }}
                title={c.label}
              />
            ))}
          </div>
        </section>

        {/* Lighting */}
        <section>
          <header style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            Lighting Setup
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {LIGHTING.map((l, i) => {
              const isActive = activeLightingIdx === i;
              return (
                <button
                  key={i}
                  onClick={() => { setActiveLightingIdx(i); setExposure(l.exposure); }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    padding: "12px 8px", borderRadius: 12, border: "none", cursor: "pointer",
                    backgroundColor: isActive ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
                    color: isActive ? "#a78bfa" : "rgba(255,255,255,0.4)",
                    fontSize: 11, fontWeight: 600, transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{l.icon}</span>
                  {l.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Exposure */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <header style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Exposure
            </header>
            <span style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.3)" }}>
              {exposure.toFixed(2)}
            </span>
          </div>
          <input
            type="range" min={0.4} max={2.0} step={0.05} value={exposure}
            onChange={(e) => setExposure(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#7c3aed" }}
          />
        </section>

        {/* Accessories */}
        <section>
          <header style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            Components
          </header>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ACCESSORIES_DEF.map((a) => (
              <button
                key={a.id}
                onClick={() => toggleAccessory(a.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 16px", borderRadius: 12, border: "none", cursor: "pointer",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600,
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 16 }}>{a.icon}</span>
                <span style={{ flex: 1, textAlign: "left" }}>{a.label}</span>
                <div style={{
                  width: 32, height: 18, borderRadius: 10,
                  backgroundColor: accessories[a.id] ? "#7c3aed" : "rgba(255,255,255,0.1)",
                  position: "relative", transition: "all 0.2s",
                }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%", backgroundColor: "white",
                    position: "absolute", top: 2,
                    left: accessories[a.id] ? 16 : 2,
                    transition: "all 0.2s",
                  }} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Hint */}
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, textAlign: "center", marginTop: "auto" }}>
          🖱 Drag to orbit · 🖲 Scroll to zoom
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        model-viewer { --poster-color: transparent; }
        .desktop-info-panel::-webkit-scrollbar { display: none; }
        input[type=range] { cursor: pointer; }
      `}</style>
    </div>
  );
}
