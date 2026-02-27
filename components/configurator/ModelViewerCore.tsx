"use client";

/**
 * ModelViewerCore — wraps <model-viewer> with configurator store bindings.
 * Loaded only client-side via dynamic import (ssr: false) in Configurator.tsx.
 *
 * We load @google/model-viewer via a plain <script type="module"> tag injected
 * in useEffect — this avoids Next.js preload/crossorigin blocking issues.
 */

import * as React from "react";
import { useConfiguratorStore, type LightingPreset } from "@/store/configuratorStore";

/* ── Lighting preset → model-viewer environment settings ── */

type LightingConfig = {
  environmentImage: string;
  exposure: number;
  shadowIntensity: number;
};

const LIGHTING_MAP: Record<LightingPreset, LightingConfig> = {
  studio: {
    environmentImage: "neutral",
    exposure: 1,
    shadowIntensity: 1,
  },
  daylight: {
    environmentImage: "legacy",
    exposure: 1.4,
    shadowIntensity: 0.8,
  },
  warm: {
    environmentImage: "neutral",
    exposure: 0.85,
    shadowIntensity: 1.2,
  },
};

/* ── Ensure model-viewer script is loaded exactly once ── */
let scriptLoaded = false;
let scriptPromise: Promise<void> | null = null;

function loadModelViewer(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    // Check if already defined (e.g. hot-reload)
    if (customElements.get("model-viewer")) {
      scriptLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
    script.crossOrigin = "anonymous";
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return scriptPromise;
}

/* ── Props ── */

type ModelViewerCoreProps = {
  src: string;
  alt: string;
  poster?: string;
};

export function ModelViewerCore({ src, alt, poster }: ModelViewerCoreProps) {
  const { lighting, camera } = useConfiguratorStore();
  const [ready, setReady] = React.useState(false);
  const lights = LIGHTING_MAP[lighting];

  const cameraOrbit = `${camera.azimuth}deg ${camera.elevation}deg ${camera.distance}m`;

  React.useEffect(() => {
    loadModelViewer()
      .then(() => setReady(true))
      .catch((err) => {
        console.warn("[ModelViewer] Failed to load model-viewer script:", err);
        // Still try to show — browser might already have it
        setReady(true);
      });
  }, []);

  if (!ready) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-violet-400" />
          <p className="text-xs text-white/40">Loading 3D viewer…</p>
        </div>
      </div>
    );
  }

  return (
    /* @ts-expect-error — model-viewer is a custom element, handled by model-viewer.d.ts */
    <model-viewer
      src={src}
      alt={alt}
      poster={poster}
      camera-controls
      camera-orbit={cameraOrbit}
      min-camera-orbit="auto 5deg auto"
      max-camera-orbit="auto 85deg auto"
      min-field-of-view="20deg"
      max-field-of-view="60deg"
      environment-image={lights.environmentImage}
      exposure={lights.exposure}
      shadow-intensity={lights.shadowIntensity}
      shadow-softness={0.5}
      auto-rotate
      ar
      ar-modes="webxr scene-viewer quick-look"
      ar-scale="auto"
      loading="eager"
      reveal="auto"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "300px",
        background: "transparent",
        display: "block",
      }}
      suppressHydrationWarning
    />
  );
}
