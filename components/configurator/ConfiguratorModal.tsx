"use client";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useUIStore } from "@/store/uiStore";
import {
  loadModelViewer,
  COLORS,
  BASE_LIGHTING,
  EXTRA_LIGHTING,
  ACCESSORIES_DEF,
} from "./shared";

// ── Configurator Modal (full-screen, portal) ────────────────────────────────
// This component renders the DESKTOP full-screen 3D configurator.
// For mobile, the bottom-sheet in MobileViewer handles everything inline.
export function ConfiguratorModal({
  productSlug,
  productName,
  modelSrc,
  onClose,
  configId: propConfigId,
}: {
  productSlug: string;
  productName: string;
  modelSrc: string;
  onClose: () => void;
  configId?: string;
}) {
  const [ready, setReady] = React.useState(false);
  const { flags } = useUIStore();
  const viewerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    loadModelViewer().then(() => setReady(true)).catch(() => setReady(true));
  }, []);

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  const LIGHTING = React.useMemo(() => {
    return flags.enableAdvancedLighting
      ? [...BASE_LIGHTING, ...EXTRA_LIGHTING]
      : BASE_LIGHTING;
  }, [flags.enableAdvancedLighting]);

  const [activeColor, setActiveColor] = React.useState<string | null>(null);
  const [exposure, setExposure] = React.useState(1.0);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMsg, setSaveMsg] = React.useState("");
  const [restoredMsg, setRestoredMsg] = React.useState("");

  // Track lighting by index so Studio(0) and Warm(2) can share "neutral" env without conflicting
  const [activeLightingIdx, setActiveLightingIdx] = React.useState(0);
  const [accessories, setAccessories] = React.useState<Record<string, boolean>>({
    cushion: false, armrest: false, lampshade: false, base: false,
  });

  // ── Restore from configId on mount ──
  React.useEffect(() => {
    const configId = propConfigId || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("configId") : null);
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
  }, [propConfigId, LIGHTING]);

  React.useEffect(() => {
    if (!ready) return;
    const viewer = viewerRef.current;
    if (!viewer) return;

    const applyConfiguration = () => {
      // @ts-expect-error custom element
      const model = viewer.model;
      if (!model) return;

      // 1. Apply primary material color
      model.materials.forEach((material: any) => {
        if (activeColor) {
          material.pbrMetallicRoughness.setBaseColorFactor(activeColor);
        }
      });

      // 2. Handle accessory visibility
      if (accessories) {
        model.materials.forEach((material: any) => {
          const matName = material.name.toLowerCase();
          Object.entries(accessories).forEach(([id, visible]) => {
            if (matName.includes(id.toLowerCase())) {
              if (visible) {
                material.setAlphaMode("OPAQUE");
                if (activeColor) {
                  material.pbrMetallicRoughness.setBaseColorFactor(activeColor);
                } else {
                  material.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
                }
              } else {
                material.pbrMetallicRoughness.setBaseColorFactor([0, 0, 0, 0]);
                material.setAlphaMode("BLEND");
              }
            }
          });
        });
      }
    };

    // @ts-expect-error custom element
    if (viewer.loaded) {
      applyConfiguration();
    }
    viewer.addEventListener("load", applyConfiguration);
    return () => viewer.removeEventListener("load", applyConfiguration);
  }, [activeColor, accessories, ready]);

  const toggleAccessory = (id: string) =>
    setAccessories((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleReset = () => {
    setActiveColor(null);
    setExposure(1.0);
    setActiveLightingIdx(0);
    setAccessories({
      cushion: false, armrest: false, lampshade: false, base: false,
    });
    setRestoredMsg("✓ Reset to default");
    setTimeout(() => setRestoredMsg(""), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const presetNames = ["studio", "daylight", "warm"] as const;
      const res = await fetch("/api/configurations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          materials: { primary: activeColor },
          components: accessories,
          lightingPreset: presetNames[activeLightingIdx] ?? "studio",
          exposure,
          camera: { azimuth: 0, elevation: 45, distance: 4 },
        }),
      });
      if (!res.ok) throw new Error();
      const { id } = await res.json();
      const shareUrl = `${window.location.origin}/share/${id}`;
      await navigator.clipboard.writeText(shareUrl).catch(() => null);
      setSaveMsg("✓ Link copied!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("Save failed");
      setTimeout(() => setSaveMsg(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", flexDirection: "column",
        backgroundColor: "#0d1117",
      }}
    >
      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "#111820", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#8b5cf6", animation: "pulse 2s infinite" }} />
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            3D Configurator
          </span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>— {productName}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {restoredMsg && (
            <span style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>{restoredMsg}</span>
          )}
          {saveMsg && (
            <span style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>{saveMsg}</span>
          )}
          <button
            onClick={handleReset}
            title="Reset to default"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)",
              border: "none", cursor: "pointer", fontSize: 14, transition: "all 0.15s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 10, backgroundColor: "#7c3aed",
              color: "white", fontSize: 12, fontWeight: 700, border: "none",
              cursor: "pointer", opacity: isSaving ? 0.6 : 1, transition: "all 0.15s",
            }}
          >
            {isSaving ? "Saving…" : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5L20 7"/>
                </svg>
                Copy Link
              </>
            )}
          </button>
          <button
            onClick={onClose}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)",
              border: "none", cursor: "pointer", fontSize: 16, transition: "all 0.15s",
            }}
            aria-label="Close configurator (Esc)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Main area: sidebar + 3D viewer ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {/* Controls sidebar */}
        <div style={{
          width: 240, flexShrink: 0, display: "flex", flexDirection: "column",
          borderRight: "1px solid rgba(255,255,255,0.08)", backgroundColor: "#111820",
          overflowY: "auto", overflowX: "hidden",
        }}>
          {/* Colors */}
          <div style={{ padding: 16 }}>
            <h2 id="modal-material-color" style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10, margin: 0 }}>
              Material Color
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 36px)", gap: 8 }}>
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setActiveColor(c.hex)}
                  aria-label={c.label}
                  title={c.label}
                  style={{
                    width: 36, height: 36, borderRadius: "50%", backgroundColor: c.hex,
                    border: "none", cursor: "pointer",
                    outline: activeColor === c.hex ? "2px solid white" : "1px solid rgba(255,255,255,0.1)",
                    outlineOffset: activeColor === c.hex ? 2 : 0,
                    transform: activeColor === c.hex ? "scale(1.15)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                />
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace", marginTop: 8 }}>{activeColor ?? "Default"}</p>
          </div>

          <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />

          {/* Lighting */}
          <div style={{ padding: 16 }}>
            <h2 id="modal-lighting" style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10, margin: 0 }}>
              Lighting
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {LIGHTING.map((l, i) => {
                const isActive = activeLightingIdx === i;
                return (
                  <button
                    key={i}
                    onClick={() => { setActiveLightingIdx(i); setExposure(l.exposure); }}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      padding: "10px 6px", borderRadius: 10, border: "none", cursor: "pointer",
                      backgroundColor: isActive ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 600,
                      outline: isActive ? "1px solid rgba(139,92,246,0.5)" : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{l.icon}</span>
                    {l.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />

          {/* Exposure */}
          <div style={{ padding: 16 }}>
            <h2 id="modal-exposure" style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10, margin: 0 }}>
              Exposure
            </h2>
            <input
              type="range" min={0.4} max={2.0} step={0.05} value={exposure}
              onChange={(e) => setExposure(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#7c3aed" }}
              aria-label="Exposure"
            />
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace", marginTop: 4 }}>{exposure.toFixed(2)}</p>
          </div>

          <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />

          {/* Accessories */}
          <div style={{ padding: 16 }}>
            <h2 id="modal-accessories" style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10, margin: 0 }}>
              Accessories
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ACCESSORIES_DEF.map((a) => (
                <button
                  key={a.id}
                  onClick={() => toggleAccessory(a.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                    backgroundColor: accessories[a.id] ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)",
                    outline: accessories[a.id] ? "1px solid rgba(139,92,246,0.5)" : "none",
                    color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600,
                    transition: "all 0.15s", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{a.icon}</span>
                  <span style={{ flex: 1 }}>{a.label}</span>
                  <span style={{
                    fontSize: 10, padding: "2px 6px", borderRadius: 4,
                    backgroundColor: accessories[a.id] ? "#7c3aed" : "rgba(255,255,255,0.1)",
                    color: accessories[a.id] ? "white" : "rgba(255,255,255,0.35)",
                    fontWeight: 700,
                  }}>
                    {accessories[a.id] ? "ON" : "OFF"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />

          {/* Tips */}
          <div style={{ padding: 16 }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, lineHeight: 1.6 }}>
              🖱 Drag to orbit<br />
              🖲 Scroll to zoom<br />
              📱 Pinch on mobile<br />
              ⌨ Esc to close
            </p>
          </div>
        </div>

        {/* ── 3D viewer ── */}
        <div style={{ flex: 1, position: "relative", minWidth: 0, overflow: "hidden" }}>
          {ready ? (
            /* @ts-expect-error custom element */
            <model-viewer
              ref={viewerRef}
              src={modelSrc}
              alt={`3D model of ${productName}`}
              poster={`/poster/${productSlug}-poster.webp`}
              camera-controls
              auto-rotate
              ar
              ar-modes="webxr scene-viewer quick-look"
              ar-scale="auto"
              ios-src={`/models/${productSlug}.usdz`}
              shadow-intensity="1"
              tone-mapping="commerce"
              environment-image={LIGHTING[activeLightingIdx].value}
              exposure={exposure}
              loading="eager"
              reveal="auto"
              style={{
                width: "100%", height: "100%", minHeight: 400,
                background: "transparent", display: "block",
              }}
              suppressHydrationWarning
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: "4px solid rgba(255,255,255,0.1)",
                  borderTopColor: "#8b5cf6",
                  animation: "spin 0.8s linear infinite",
                }} />
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Loading 3D model…</p>
              </div>
            </div>
          )}

          {/* Bottom status bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 16px", backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.3)", fontSize: 11,
          }}>
            <span>Drag to orbit · Scroll to zoom</span>
            <span style={{ fontFamily: "monospace" }}>{activeColor}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>,
    document.body,
  );
}
