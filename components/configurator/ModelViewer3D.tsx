"use client";
// ── ModelViewer3D: Orchestrator ───────────────────────────────────────────────
//
//  Routes to the correct view based on screen width:
//    ≥ 1024px  →  DesktopViewer  (lazy-loaded — mobile users never download it)
//    < 1024px  →  MobileViewer   (full-screen 3D + draggable bottom sheet)
//
//  To customise each view independently:
//    ✏️  Desktop  →  DesktopViewer.tsx
//    ✏️  Mobile   →  MobileViewer.tsx
//    🔧  Shared   →  shared.ts  (loader, constants, types)
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react";
import { type Product } from "@/lib/products";
import { useI18n } from "@/components/i18n/I18nProvider";
import { MobileViewer } from "./MobileViewer";

// Lazy-load desktop viewer — mobile users never download this chunk
const DesktopViewer = React.lazy(() =>
  import("./DesktopViewer").then((m) => ({ default: m.DesktopViewer }))
);

type ModelViewer3DProps = {
  product: Product;
  configId?: string;
};

export function ModelViewer3D({ product, configId }: ModelViewer3DProps) {
  const { locale } = useI18n();
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Avoid "Mobile flicker" on desktop reload: render a simple loader until we know the device
  if (!hydrated) {
    return (
      <div style={{ position: "fixed", top: 56, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-main, #f8fafc)" }}>
        <p style={{ color: "var(--text-muted, #64748b)", fontStyle: "italic", fontSize: 14 }}>
          {locale === "hi" ? "आरंभ किया जा रहा है..." : "Initializing..."}
        </p>
      </div>
    );
  }

  if (!isDesktop) {
    return <MobileViewer product={product} configId={configId} />;
  }

  return (
    <React.Suspense fallback={
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-main, #f8fafc)" }}>
        <p style={{ color: "var(--text-muted, #64748b)", fontSize: 14 }}>
          {locale === "hi" ? "डेस्कटॉप अनुभव लोड किया जा रहा है..." : "Loading Desktop Experience..."}
        </p>
      </div>
    }>
      <DesktopViewer product={product} configId={configId} />
    </React.Suspense>
  );
}
