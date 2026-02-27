"use client";

/**
 * ARButton — renders inside or alongside model-viewer.
 * - On supported devices (mobile + WebXR/Scene Viewer/QuickLook): shows AR trigger
 * - On unsupported devices: shows ARFallback instead
 * AR code is included in the same dynamic chunk as ModelViewerCore (already deferred).
 */

import * as React from "react";
import { cn } from "@/lib/cn";

/* ── AR Support Detection ── */
function useARSupport() {
  const [supported, setSupported] = React.useState<boolean | null>(null); // null = unknown

  React.useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const isMobile = isIOS || isAndroid;

    // Only report AR support on actual mobile devices
    // Desktop Chrome has WebXR API but AR doesn't work there
    if (!isMobile) {
      setSupported(false);
      return;
    }

    // iOS → Quick Look is always available on Safari
    if (isIOS) {
      setSupported(true);
      return;
    }

    // Android → check WebXR or fallback to Scene Viewer intent
    const hasXR = "xr" in navigator;
    setSupported(hasXR || isAndroid);
  }, []);

  return supported;
}

/* ── AR Fallback — shown when device doesn't support AR ── */
function ARFallback({ imageSrc, productName }: { imageSrc: string; productName: string }) {
  return (
    <div
      role="region"
      aria-label="AR not supported — showing 2D preview"
      className="flex flex-col items-center gap-4 rounded-xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800 dark:bg-amber-950/30"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600" aria-hidden="true">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={`2D preview of ${productName}`}
        className="h-40 w-auto rounded-lg object-contain"
      />
      <div>
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          AR is not supported on this device
        </p>
        <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
          Here&apos;s a 3D preview instead. Use a supported mobile device for the full AR experience.
        </p>
      </div>
    </div>
  );
}

/* ── AR Button ── */
type ARButtonProps = {
  /** Same src as model-viewer — used as `href` for the AR intent/quick look trigger */
  modelSrc: string;
  /** Product thumbnail — shown as 2D fallback image */
  posterSrc: string;
  /** Human-readable product name */
  productName: string;
  className?: string;
};

export function ARButton({ modelSrc, posterSrc, productName, className }: ARButtonProps) {
  const supported = useARSupport();

  // Still detecting — show nothing (avoids layout shift)
  if (supported === null) return null;

  // Unsupported device → 2D fallback
  if (!supported) {
    return <ARFallback imageSrc={posterSrc} productName={productName} />;
  }

  // iOS Quick Look uses an <a rel="ar"> with a special structure
  // iOS requires a .usdz file — derive from the .glb path
  const isIOS = /iPhone|iPad|iPod/.test(navigator?.userAgent ?? "");
  const usdzSrc = modelSrc.replace(/\.glb$/i, ".usdz");

  if (isIOS) {
    return (
      <a
        href={usdzSrc}
        rel="ar"
        aria-label={`View ${productName} in AR`}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
          "dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200",
          className,
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
        View in AR (Quick Look)
      </a>
    );
  }

  // Android / WebXR — model-viewer handles AR natively via the `ar` attribute
  // We just show an informational badge; the actual AR button is inside model-viewer
  return (
    <div
      role="note"
      aria-label="AR preview available"
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800",
        "dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
        className,
      )}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
      </svg>
      AR available — tap the AR button in the 3D viewer
    </div>
  );
}
