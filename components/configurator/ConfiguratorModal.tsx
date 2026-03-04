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
import { useI18n } from "@/components/i18n/I18nProvider";

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
  const { locale } = useI18n();
  const [ready, setReady] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const { flags } = useUIStore();
  const viewerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    setMounted(true);
    loadModelViewer().then(() => setReady(true)).catch(() => setReady(true));
    
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
  const [canAR, setCanAR] = React.useState(false);

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
        setRestoredMsg(locale === "hi" ? "✓ कॉन्फ़िगरेशन बहाल!" : "✓ Configuration restored!");
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

  React.useEffect(() => {
    const checkAR = () => {
      const viewer = viewerRef.current;
      if (viewer) {
        const handleLoad = () => {
          // @ts-expect-error custom element
          setCanAR(!!viewer.canActivateAR);
        };
        viewer.addEventListener("load", handleLoad);
        // @ts-expect-error custom element
        if (viewer.loaded) setCanAR(!!viewer.canActivateAR);
        
        return () => viewer.removeEventListener("load", handleLoad);
      }
    };
    
    if (ready) {
      const timer = setTimeout(checkAR, 500);
      return () => clearTimeout(timer);
    }
  }, [ready]);

  const handleARClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobileDevice) {
      alert(locale === "hi" ? "⚠ AR पूर्वावलोकन केवल मोबाइल उपकरणों पर समर्थित है।" : "⚠ AR preview is only supported on mobile devices.");
      return;
    }
    
    const viewer = viewerRef.current as any;
    if (viewer && viewer.canActivateAR) {
      if (/Android/i.test(navigator.userAgent)) {
        try {
          const exportedBlob = await viewer.exportScene();
          const objUrl = URL.createObjectURL(exportedBlob);
          const originalSrc = viewer.src;
          viewer.src = objUrl;
          viewer.activateAR();
          setTimeout(() => {
            viewer.src = originalSrc;
            URL.revokeObjectURL(objUrl);
          }, 2000);
        } catch (err) {
          console.error("Failed to export AR scene:", err);
          viewer.activateAR();
        }
      } else {
        viewer.activateAR();
      }
    }
  };

  const toggleAccessory = (id: string) =>
    setAccessories((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleReset = () => {
    setActiveColor(null);
    setExposure(1.0);
    setActiveLightingIdx(0);
    setAccessories({
      cushion: false, armrest: false, lampshade: false, base: false,
    });
    setRestoredMsg(locale === "hi" ? "✓ डिफ़ॉल्ट पर रीसेट करें" : "✓ Reset to default");
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
      
      // Robust clipboard copy with fallback for non-secure contexts
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareUrl);
        } else {
          throw new Error("Clipboard API unavailable");
        }
      } catch (err) {
        // Fallback for non-secure contexts (e.g. local IP testing)
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (copyErr) {
          console.error('Fallback copy failed', copyErr);
        }
        document.body.removeChild(textArea);
      }

      setSaveMsg(locale === "hi" ? "✓ लिंक कॉपी किया गया!" : "✓ Link copied!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg(locale === "hi" ? "सहेजना विफल रहा" : "Save failed");
      setTimeout(() => setSaveMsg(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

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
        padding: isMobile ? "8px 12px" : "12px 16px", 
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "#111820", flexShrink: 0,
        height: isMobile ? 50 : 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#8b5cf6", animation: "pulse 2s infinite", flexShrink: 0 }} />
          {!isMobile && (
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", whiteSpace: "nowrap" }}>
              {locale === "hi" ? "3D कॉन्फिगरेटर" : "3D Configurator"}
            </span>
          )}
          <span style={{ 
            color: "rgba(255,255,255,0.7)", 
            fontSize: isMobile ? 12 : 13, 
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            {!isMobile && "— "} {productName}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 8, flexShrink: 0 }}>
          {(restoredMsg || saveMsg) && (
            <span style={{ 
              color: "#10b981", 
              fontSize: isMobile ? 10 : 12, 
              fontWeight: 600,
              display: isMobile && (restoredMsg || saveMsg).length > 20 ? "none" : "inline" 
            }}>
              {restoredMsg || saveMsg}
            </span>
          )}
          
          <div style={{ display: "flex", gap: isMobile ? 4 : 8 }}>
            <button
              onClick={handleReset}
              title={locale === "hi" ? "डिफ़ॉल्ट पर रीसेट करें" : "Reset to default"}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)",
                border: "none", cursor: "pointer", fontSize: isMobile ? 12 : 14, transition: "all 0.15s",
              }}
            >
              <svg width={isMobile ? "12" : "14"} height={isMobile ? "12" : "14"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: isMobile ? "0 10px" : "6px 14px", 
                height: isMobile ? 28 : 32,
                borderRadius: 8, backgroundColor: "#7c3aed",
                color: "white", fontSize: 11, fontWeight: 700, border: "none",
                cursor: "pointer", opacity: isSaving ? 0.6 : 1, transition: "all 0.15s",
              }}
            >
              {isSaving ? (locale === "hi" ? "सहेजा जा रहा है..." : "Saving…") : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5L20 7"/>
                  </svg>
                  {isMobile ? (locale === "hi" ? "लिंक" : "Link") : (locale === "hi" ? "लिंक कॉपी करें" : "Copy Link")}
                </>
              )}
            </button>

            <button
              onClick={onClose}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.1)", color: "white",
                border: "none", cursor: "pointer", fontSize: 14, transition: "all 0.15s",
              }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* ── Main area: sidebar + 3D viewer ── */}
      <div style={{ 
        display: "flex", 
        flex: 1, 
        flexDirection: isMobile ? "column" : "row",
        overflow: "hidden", 
        minHeight: 0 
      }}>
        {/* Controls sidebar */}
        <div style={{
          width: isMobile ? "100%" : 240, 
          height: isMobile ? "45%" : "auto",
          order: isMobile ? 2 : 1,
          flexShrink: 0, display: "flex", flexDirection: "column",
          borderRight: (isMobile || !ready) ? "none" : "1px solid rgba(255,255,255,0.08)", 
          borderTop: isMobile ? "1px solid rgba(255,255,255,0.08)" : "none",
          backgroundColor: "#111820",
          overflowY: "auto", overflowX: "hidden",
        }}>
          {/* Colors */}
          <div style={{ padding: isMobile ? 12 : 16 }}>
            <h2 id="modal-material-color" style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10, margin: 0 }}>
              {locale === "hi" ? "सामग्री का रंग" : "Material Color"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(32px, 1fr))" : "repeat(5, 36px)", gap: 8 }}>
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setActiveColor(c.hex)}
                  aria-label={c.label[locale]}
                  title={c.label[locale]}
                  style={{
                    width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius: "50%", backgroundColor: c.hex,
                    border: "none", cursor: "pointer",
                    outline: activeColor === c.hex ? "2px solid white" : "1px solid rgba(255,255,255,0.1)",
                    outlineOffset: activeColor === c.hex ? 2 : 0,
                    transform: activeColor === c.hex ? "scale(1.15)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)", flexShrink: 0 }} />

          {/* Lighting */}
          <div style={{ padding: isMobile ? 12 : 16 }}>
            <h2 id="modal-lighting" style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10, margin: 0 }}>
              {locale === "hi" ? "प्रकाश व्यवस्था" : "Lighting"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(5, 1fr)" : "repeat(3, 1fr)", gap: 6 }}>
              {LIGHTING.map((l, i) => {
                const isActive = activeLightingIdx === i;
                return (
                  <button
                    key={i}
                    onClick={() => { setActiveLightingIdx(i); setExposure(l.exposure); }}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer",
                      backgroundColor: isActive ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.5)", fontSize: 9, fontWeight: 600,
                      outline: isActive ? "1px solid rgba(139,92,246,0.5)" : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: isMobile ? 14 : 18 }}>{l.icon}</span>
                    <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", width: "100%", textAlign: "center" }}>{l.label[locale]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)", flexShrink: 0 }} />

          {/* Exposure */}
          <div style={{ padding: isMobile ? 12 : 16 }}>
            <h2 id="modal-exposure" style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10, margin: 0 }}>
              {locale === "hi" ? "एक्सपोज़र" : "Exposure"} ({exposure.toFixed(2)})
            </h2>
            <input
              type="range" min={0.4} max={2.0} step={0.05} value={exposure}
              onChange={(e) => setExposure(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#7c3aed" }}
              aria-label={locale === "hi" ? "एक्सपोज़र" : "Exposure"}
            />
          </div>

          <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)", flexShrink: 0 }} />

          {/* Accessories */}
          <div style={{ padding: isMobile ? 12 : 16 }}>
            <h2 id="modal-accessories" style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10, margin: 0 }}>
              {locale === "hi" ? "घटक" : "Accessories"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr", gap: 8 }}>
              {ACCESSORIES_DEF.map((a) => (
                <button
                  key={a.id}
                  onClick={() => toggleAccessory(a.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                    backgroundColor: accessories[a.id] ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)",
                    outline: accessories[a.id] ? "1px solid rgba(139,92,246,0.5)" : "none",
                    color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600,
                    transition: "all 0.15s", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{a.icon}</span>
                  <span style={{ flex: 1 }}>{a.label[locale]}</span>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: accessories[a.id] ? "#7c3aed" : "rgba(255,255,255,0.1)" }} />
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ padding: "8px 16px", color: "rgba(255,255,255,0.15)", fontSize: 9 }}>
            {isMobile ? (locale === "hi" ? "ज़ूम करने के लिए पिंच करें · परिक्रमा करने के लिए 1-फिंगर" : "Pinch to zoom · 1-finger to orbit") : (locale === "hi" ? "परिक्रमा करने के लिए खींचें · ज़ूम करने के लिए स्क्रॉल करें" : "Drag to orbit · Scroll to zoom")}
          </div>
        </div>

        {/* ── 3D viewer ── */}
        <div style={{ 
          flex: 1, 
          position: "relative", 
          minWidth: 0, 
          height: isMobile ? "55%" : "100%",
          order: isMobile ? 1 : 2,
          overflow: "hidden" 
        }}>
          {ready ? (
            React.createElement("model-viewer", {
              ref: viewerRef,
              src: modelSrc,
              alt: `3D model of ${productName}`,
              poster: `/poster/${productSlug}-poster.webp`,
              "camera-controls": true,
              "auto-rotate": true,
              ar: true,
              "ar-modes": "webxr scene-viewer quick-look",
              "ar-scale": "auto",
              "ar-placement": "floor",
              "shadow-intensity": "1",
              "tone-mapping": "commerce",
              "environment-image": LIGHTING[activeLightingIdx].value,
              exposure: exposure,
              loading: "eager",
              reveal: "auto",
              style: {
                width: "100%", height: "100%",
                background: "transparent", display: "block",
              },
              suppressHydrationWarning: true,
            }, (
              canAR && (
                <button
                  slot="ar-button"
                  onClick={handleARClick}
                  style={{
                    position: "absolute", bottom: isMobile ? 16 : 24, right: isMobile ? 12 : 24,
                    backgroundColor: "#10b981", color: "white",
                    borderRadius: 12, padding: isMobile ? "10px 14px" : "12px 20px",
                    fontWeight: 700, fontSize: isMobile ? 12 : 14, border: "none",
                    display: "flex", alignItems: "center", gap: 8,
                    boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                    cursor: "pointer", zIndex: 99
                  }}
                >
                  <svg width={isMobile ? "16" : "18"} height={isMobile ? "16" : "18"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
                  </svg>
                  {locale === "hi" ? "AR में देखें" : "View in AR"}
                </button>
              )
            ))
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: "4px solid rgba(255,255,255,0.1)",
                  borderTopColor: "#8b5cf6",
                  animation: "spin 0.8s linear infinite",
                }} />
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                  {locale === "hi" ? "3D मॉडल लोड किया जा रहा है..." : "Loading 3D model…"}
                </p>
              </div>
            </div>
          )}

          {/* Color indicator tooltip overlay (bottom left) */}
          <div style={{
            position: "absolute", bottom: 12, left: 12,
            padding: "4px 10px", borderRadius: 20,
            backgroundColor: "rgba(17,24,32,0.6)", backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", gap: 6,
            pointerEvents: "none"
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: activeColor || "#888" }} />
            <span style={{ color: "white", fontSize: 10, fontWeight: 600, fontFamily: "monospace", opacity: 0.8 }}>
              {activeColor || (locale === "hi" ? "डिफ़ॉल्ट" : "DEFAULT")}
            </span>
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
