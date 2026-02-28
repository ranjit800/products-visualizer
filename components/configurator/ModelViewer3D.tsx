"use client";
import * as React from "react";
import * as ReactDOM from "react-dom";
import type { Product } from "@/lib/products";
import { useUIStore } from "@/store/uiStore";

// ── Load model-viewer script once ──────────────────────────────────────────
let scriptLoaded = false;
let scriptPromise: Promise<void> | null = null;

function loadModelViewer(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (typeof customElements !== "undefined" && customElements.get("model-viewer")) {
      scriptLoaded = true;
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
    script.crossOrigin = "anonymous";
    script.onload = () => { scriptLoaded = true; resolve(); };
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return scriptPromise;
}

// ── Bottom sheet states ─────────────────────────────────────────────────────
const SHEET_HEIGHTS = { collapsed: 15, half: 45, full: 85 } as const;
type SheetState = keyof typeof SHEET_HEIGHTS;

// ── Configurator Modal (full-screen, portal) ────────────────────────────────
function ConfiguratorModal({
  productSlug,
  productName,
  modelSrc,
  onClose,
}: {
  productSlug: string;
  productName: string;
  modelSrc: string;
  onClose: () => void;
}) {
  const [ready, setReady] = React.useState(false);

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

  const COLORS = [
    { label: "Slate",   hex: "#1e293b" }, { label: "Stone",   hex: "#78716c" },
    { label: "White",   hex: "#f1f5f9" }, { label: "Orange",  hex: "#f97316" },
    { label: "Emerald", hex: "#10b981" }, { label: "Blue",    hex: "#3b82f6" },
    { label: "Rose",    hex: "#f43f5e" }, { label: "Violet",  hex: "#8b5cf6" },
    { label: "Amber",   hex: "#f59e0b" }, { label: "Cyan",    hex: "#06b6d4" },
  ];

  const { flags } = useUIStore();

  const BASE_LIGHTING = [
    { value: "neutral", label: "Studio", icon: "💡", exposure: 1.0 },
    { value: "legacy",  label: "Day",    icon: "☀️", exposure: 1.4 },
    { value: "neutral", label: "Warm",   icon: "🕯️", exposure: 0.85 },
  ];
  const EXTRA_LIGHTING = [
    { value: "dawn",    label: "Sunset", icon: "🌅", exposure: 0.7 },
    { value: "neutral", label: "Cool",   icon: "❄️", exposure: 1.6 },
  ];
  const LIGHTING = flags.enableAdvancedLighting
    ? [...BASE_LIGHTING, ...EXTRA_LIGHTING]
    : BASE_LIGHTING;

  const [activeColor, setActiveColor] = React.useState("#1e293b");
  const [activeLighting, setActiveLighting] = React.useState("neutral");
  const [exposure, setExposure] = React.useState(1.0);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMsg, setSaveMsg] = React.useState("");
  const [restoredMsg, setRestoredMsg] = React.useState("");

  // Track lighting by index so Studio(0) and Warm(2) can share "neutral" env without conflicting
  const [activeLightingIdx, setActiveLightingIdx] = React.useState(0);
  const [accessories, setAccessories] = React.useState<Record<string, boolean>>({
    cushion: false, armrest: false, lampshade: false, base: false,
  });

  // ── Restore from configId in URL on mount ──
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const configId = params.get("configId");
    if (!configId) return;
    fetch(`/api/configurations/${configId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((config) => {
        if (!config) return;
        if (config.materials?.primary) setActiveColor(config.materials.primary);
        // Map saved lightingPreset → LIGHTING index
        const presetToIdx: Record<string, number> = { studio: 0, daylight: 1, warm: 2 };
        const idx = presetToIdx[config.lightingPreset ?? "studio"] ?? 0;
        setActiveLightingIdx(idx);
        // Use exact saved exposure if present, else fall back to preset default
        setExposure(typeof config.exposure === "number" ? config.exposure : LIGHTING[idx].exposure);
        if (config.components && typeof config.components === "object") {
          setAccessories((prev) => ({ ...prev, ...(config.components as Record<string, boolean>) }));
        }
        setRestoredMsg("✓ Configuration restored!");
        setTimeout(() => setRestoredMsg(""), 3000);
      })
      .catch(() => null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const ACCESSORIES_DEF = [
    { id: "cushion",   label: "Cushion",    icon: "🪑" },
    { id: "armrest",   label: "Armrest",    icon: "🦾" },
    { id: "lampshade", label: "Lamp Shade", icon: "💡" },
    { id: "base",      label: "Base Plate", icon: "⬛" },
  ];

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", flexDirection: "column",
        backgroundColor: "#0d1117",
      }}
    >
      {/* Header */}
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
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 10, backgroundColor: "#7c3aed",
              color: "white", fontSize: 12, fontWeight: 700, border: "none",
              cursor: "pointer", opacity: isSaving ? 0.6 : 1, transition: "all 0.15s",
            }}
          >
            💾 {isSaving ? "Saving…" : "Save & Share"}
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

      {/* Main area: sidebar + 3D viewer */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {/* Controls sidebar */}
        <div style={{
          width: 240, flexShrink: 0, display: "flex", flexDirection: "column",
          borderRight: "1px solid rgba(255,255,255,0.08)", backgroundColor: "#111820",
          overflowY: "auto", overflowX: "hidden",
        }}>
          {/* Colors */}
          <div style={{ padding: 16 }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>
              Material Color
            </p>
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
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace", marginTop: 8 }}>{activeColor}</p>
          </div>

          <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />

          {/* Lighting — tracked by index so Studio≠Warm even though both use "neutral" env */}
          <div style={{ padding: 16 }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>
              Lighting
            </p>
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
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>
              Exposure
            </p>
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
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>
              Accessories
            </p>
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

        {/* 3D viewer */}
        <div style={{ flex: 1, position: "relative", minWidth: 0, overflow: "hidden" }}>
          {ready ? (
            /* @ts-expect-error custom element */
            <model-viewer
              src={modelSrc}
              alt={`3D model of ${productName}`}
              poster={`/images/products/${productSlug}.svg`}
              camera-controls
              auto-rotate
              ar
              ar-modes="webxr scene-viewer quick-look"
              ar-scale="auto"
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

// ── Live Presence Badge (simulated) ──────────────────────────────────────────
function PresenceBadge() {
  const [count, setCount] = React.useState(() => Math.floor(Math.random() * 7) + 2);
  React.useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => Math.max(1, c + (Math.random() > 0.5 ? 1 : -1)));
    }, 12000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 12px", borderRadius: 20,
      backgroundColor: "rgba(16,185,129,0.12)",
      border: "1px solid rgba(16,185,129,0.3)",
      fontSize: 12, fontWeight: 600, color: "#059669",
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        backgroundColor: "#10b981",
        boxShadow: "0 0 0 2px rgba(16,185,129,0.3)",
        animation: "pulse 2s infinite",
        display: "inline-block",
      }} />
      {count} people viewing this right now
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
type ModelViewer3DProps = {
  product: Product & { title: { en: string; hi: string } };
  formatPrice: string;
};

export function ModelViewer3D({ product, formatPrice }: ModelViewer3DProps) {
  const { flags } = useUIStore();
  const [ready, setReady] = React.useState(false);
  const [showConfigurator, setShowConfigurator] = React.useState(false);
  const [sheetState, setSheetState] = React.useState<SheetState>("collapsed");
  const [isDragging, setIsDragging] = React.useState(false);
  const [startY, setStartY] = React.useState(0);
  const [currentY, setCurrentY] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const [showARFailed, setShowARFailed] = React.useState(false);
  const [canAR, setCanAR] = React.useState(false);
  const viewerRef = React.useRef<HTMLElement | null>(null);

  const modelSrc = `/models/${product.slug}.glb`;
  const posterSrc = `/images/products/${product.slug}.svg`;

  React.useEffect(() => {
    setMounted(true);
    loadModelViewer().then(() => setReady(true)).catch(() => setReady(true));
    // Auto-open configurator if arriving from a share link
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("configId")) {
      setShowConfigurator(true);
    }
  }, []);

  // Detect AR after model loads
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

  const getSheetHeight = () => {
    if (isDragging) {
      const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;
      const base = SHEET_HEIGHTS[sheetState];
      const delta = ((startY - currentY) / viewportH) * 100;
      return `${Math.min(Math.max(base + delta, 12), 88)}dvh`;
    }
    return `${SHEET_HEIGHTS[sheetState]}dvh`;
  };

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const y = "touches" in e ? e.touches[0].clientY : e.clientY;
    setStartY(y); setCurrentY(y);
  };
  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const y = "touches" in e ? e.touches[0].clientY : e.clientY;
    setCurrentY(y);
  };
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const delta = startY - currentY;
    const threshold = 50;
    if (Math.abs(delta) < threshold) { handleTap(); return; }
    if (delta > 0) {
      setSheetState(s => s === "collapsed" ? "half" : s === "half" ? "full" : "full");
    } else {
      setSheetState(s => s === "full" ? "half" : s === "half" ? "collapsed" : "collapsed");
    }
  };
  const handleTap = () => {
    setSheetState(s => s === "collapsed" ? "half" : s === "half" ? "full" : "collapsed");
  };

  return (
    <div style={{
      position: "fixed",
      top: 60,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      backgroundColor: "#f5f5f5",
      zIndex: 10,
    }}>
      {/* ── Full-screen 3D Viewer ── */}
      <div style={{ position: "absolute", inset: 0 }}>
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
            shadow-intensity="1"
            tone-mapping="commerce"
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
      </div>

      {/* ── Top overlay: back nav + AR button ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 16px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)",
      }}>
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
          aria-label="Back to catalog"
        >
          ←
        </a>

        <div style={{ display: "flex", gap: 8 }}>
          {/* AR button — gated on enableAR feature flag */}
          {flags.enableAR && canAR && !showARFailed && (
            <button
              onClick={() => {
                const v = viewerRef.current;
                // @ts-expect-error custom element
                if (v && v.canActivateAR) v.activateAR();
              }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 24,
                backgroundColor: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(8px)", color: "white",
                border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
                boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              View in AR
            </button>
          )}
          {showARFailed && flags.enableAR && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 24,
              backgroundColor: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
              color: "#fca5a5", fontSize: 12,
            }}>
              ⚠ AR not supported on this device
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Info Sheet ── */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: getSheetHeight(),
          transition: isDragging ? "none" : "height 0.35s cubic-bezier(0.4,0,0.2,1)",
          backgroundColor: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.14)",
          display: "flex", flexDirection: "column",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          zIndex: 30,
        }}
      >
        {/* Drag handle */}
        <div
          style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 16px 8px", cursor: "grab", flexShrink: 0 }}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onClick={handleTap}
        >
          <div style={{ width: 48, height: 5, borderRadius: 3, backgroundColor: "#d1d5db" }} />

          {/* Always-visible product name + price row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: 10 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
              {product.title.en}
            </h1>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", marginLeft: 12 }}>
              {formatPrice}
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Live Presence badge — gated on enablePresence feature flag */}
          {flags.enablePresence && <PresenceBadge />}

          {/* Category badge */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            <span style={{
              padding: "4px 12px", borderRadius: 20,
              backgroundColor: "#f1f5f9", color: "#475569",
              fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em",
            }}>
              {product.category}
            </span>
            {product.tags.map(tag => (
              <span key={tag} style={{
                padding: "4px 12px", borderRadius: 20,
                backgroundColor: "#ede9fe", color: "#7c3aed",
                fontSize: 12, fontWeight: 600,
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            {product.description.en}
          </p>

          <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: 0 }} />

          {/* Feature bullets */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {[
              "Interactive 3D configuration",
              "AR preview on supported mobile devices",
              "Save and share your configuration",
            ].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#10b981", fontWeight: 700, fontSize: 16 }}>✓</span>
                <span style={{ color: "#475569", fontSize: 13 }}>{f}</span>
              </div>
            ))}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: 0 }} />

          {/* CTA button */}
          <button
            onClick={() => setShowConfigurator(true)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              width: "100%", padding: "16px 24px",
              backgroundColor: "#0f172a", color: "white",
              border: "none", borderRadius: 16, cursor: "pointer",
              fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              transition: "all 0.2s",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
            </svg>
            Customize in 3D
          </button>
        </div>
      </div>

      {/* Configurator full-screen modal */}
      {mounted && showConfigurator && (
        <ConfiguratorModal
          productSlug={product.slug}
          productName={product.title.en}
          modelSrc={modelSrc}
          onClose={() => setShowConfigurator(false)}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        model-viewer { --poster-color: transparent; }
      `}</style>
    </div>
  );
}
