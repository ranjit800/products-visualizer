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
import type { Product } from "@/lib/products";
import { MobileViewer } from "./MobileViewer";

// Lazy-load desktop viewer — mobile users never download this chunk
const DesktopViewer = React.lazy(() =>
  import("./DesktopViewer").then((m) => ({ default: m.DesktopViewer }))
);

type ModelViewer3DProps = {
  product: Product & { title: { en: string; hi: string } };
  formatPrice: string;
  configId?: string;
};

export function ModelViewer3D({ product, formatPrice, configId }: ModelViewer3DProps) {
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
      <div style={{ position: "fixed", top: 56, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa" }}>
        <p style={{ color: "#64748b", fontStyle: "italic", fontSize: 14 }}>Initializing...</p>
      </div>
    );
  }

  if (!isDesktop) {
    return <MobileViewer product={product} formatPrice={formatPrice} configId={configId} />;
  }

  return (
    <React.Suspense fallback={
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa" }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading Desktop Experience...</p>
      </div>
    }>
      <DesktopViewer product={product} formatPrice={formatPrice} configId={configId} />
    </React.Suspense>
  );
}
