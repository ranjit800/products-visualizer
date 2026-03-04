"use client";
import * as React from "react";
import Link from "next/link";
import { formatPriceCents } from "@/lib/products";
import type { Product } from "@/lib/products";
import { useUIStore } from "@/store/uiStore";
import { useI18n } from "@/components/i18n/I18nProvider";
import { loadModelViewer, SHEET_HEIGHTS, type SheetState } from "./shared";
import { PresenceBadge } from "./PresenceBadge";
import { ConfiguratorModal } from "./ConfiguratorModal";

import type { Locale } from "@/lib/i18n";

type MobileViewerProps = {
  product: Product;
  configId?: string;
};

// ── Mobile experience: full-screen 3D model + bottom info sheet ──────────────
// The sheet can be dragged between collapsed / half / full states.
// Tapping the handle also cycles through the states.
export function MobileViewer({ product, configId: propConfigId }: MobileViewerProps) {
  const { locale } = useI18n();
  const formatPrice = formatPriceCents(product.priceCents, locale);
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
  const posterSrc = `/poster/${product.slug}-poster.webp`;

  React.useEffect(() => {
    setMounted(true);
    loadModelViewer().then(() => setReady(true)).catch(() => setReady(true));
    // Auto-open configurator if arriving from a share link
    const configId = propConfigId || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("configId") : null);
    if (configId) {
      setShowConfigurator(true);
    }
  }, [propConfigId]);

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

  const handleARClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobileDevice) {
      setShowARFailed(true);
      setTimeout(() => setShowARFailed(false), 4000);
      return;
    }
    const v = viewerRef.current as any;
    if (v && v.canActivateAR) {
      if (/Android/i.test(navigator.userAgent)) {
        try {
          const exportedBlob = await v.exportScene();
          const objUrl = URL.createObjectURL(exportedBlob);
          const originalSrc = v.src;
          v.src = objUrl;
          v.activateAR();
          setTimeout(() => {
            v.src = originalSrc;
            URL.revokeObjectURL(objUrl);
          }, 2000);
        } catch (err) {
          console.error("Failed to export AR scene:", err);
          v.activateAR();
        }
      } else {
        v.activateAR();
      }
    }
  };

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
      top: 56, // Sits below the site navbar
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      backgroundColor: "var(--bg-main)",
      zIndex: 10,
    }}>
      {/* ── Full-screen 3D Viewer ── */}
      <div style={{ position: "absolute", inset: 0 }}>
        {ready ? (
          /* @ts-expect-error custom element */
          <model-viewer
            ref={viewerRef}
            src={modelSrc}
            alt={`3D model of ${product.title[locale]}`}
            poster={posterSrc}
            camera-controls
            auto-rotate
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="auto"
            ar-placement="floor"
            // ios-src={`/models/${product.slug}.usdz`}
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
            background: "var(--bg-main)",
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                border: "4px solid rgba(255,255,255,0.1)",
                borderTopColor: "#7c3aed",
                animation: "spin 0.8s linear infinite",
              }} />
              <p style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 500 }}>
                {locale === "hi" ? "3D मॉडल लोड किया जा रहा है..." : "Loading 3D Model…"}
              </p>
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
        <Link
          href="/products"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 40, height: 40, borderRadius: "50%",
            backgroundColor: "var(--bg-panel)",
            backdropFilter: "blur(8px)", color: "var(--text-main)",
            textDecoration: "none", fontSize: 18, fontWeight: 700,
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
          aria-label="Back to catalog"
        >
          ←
        </Link>

        <div style={{ display: "flex", gap: 8 }}>
          {/* AR button — gated on enableAR feature flag */}
          {flags.enableAR && canAR && !showARFailed && (
            <button
              onClick={handleARClick}
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
              {locale === "hi" ? "AR में देखें" : "View in AR"}
            </button>
          )}
          {showARFailed && flags.enableAR && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 24,
              backgroundColor: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
              color: "#fca5a5", fontSize: 12,
            }}>
              {locale === "hi" ? "⚠ इस डिवाइस पर AR समर्थित नहीं है" : "⚠ AR not supported on this device"}
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
          backgroundColor: "var(--bg-panel)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.14)",
          display: "flex", flexDirection: "column",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
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
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", margin: 0, letterSpacing: "-0.02em" }}>
              {product.title[locale]}
            </h1>
            <span style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", whiteSpace: "nowrap", marginLeft: 12 }}>
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
              {locale === "hi" ? (product.category === "Chair" ? "कुर्सी" : product.category === "Lamp" ? "लैम्प" : "डेस्क") : product.category}
            </span>
            {product.tags.map(tag => (
              <span key={tag} style={{
                padding: "4px 12px", borderRadius: 20,
                backgroundColor: "#ede9fe", color: "#7c3aed",
                fontSize: 12, fontWeight: 600,
              }}>
                {locale === "hi" ? (tag === "minimal" ? "मिनिमल" : tag === "indoor" ? "इनडोर" : tag === "comfort" ? "आरामदायक" : tag === "compact" ? "कॉम्पैक्ट" : tag === "desk" ? "डेस्क" : tag === "ambient" ? "एंबियंट" : tag === "floor" ? "फर्श" : tag === "warm" ? "वार्म" : tag === "work" ? "काम" : tag === "premium" ? "प्रीमियम" : tag) : tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            {product.description[locale]}
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
            <span style={{
              padding: "4px 8px", borderRadius: 4,
              backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)",
              fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              {locale === "hi" ? (product.category === "Chair" ? "कुर्सी" : product.category === "Lamp" ? "लैम्प" : "डेस्क") : product.category}
            </span>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: 0 }} />

          {/* Feature bullets */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {(locale === "hi" ? [
              "इंटरएक्टिव 3D कॉन्फ़िगरेशन",
              "समर्थित मोबाइल उपकरणों पर AR पूर्वावलोकन",
              "अपना कॉन्फ़िगरेशन सहेजें और साझा करें",
            ] : [
              "Interactive 3D configuration",
              "AR preview on supported mobile devices",
              "Save and share your configuration",
            ]).map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#10b981", fontWeight: 700, fontSize: 16 }}>✓</span>
                <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{f}</span>
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
            {locale === "hi" ? "3D में अनुकूलित करें" : "Customize in 3D"}
          </button>
        </div>
      </div>

      {/* Configurator full-screen modal */}
      {mounted && showConfigurator && (
        <ConfiguratorModal
          productSlug={product.slug}
          productName={product.title[locale]}
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
