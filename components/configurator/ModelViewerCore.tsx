"use client";

/**
 * ModelViewerCore — wraps <model-viewer> with configurator store bindings.
 * Loaded only client-side via dynamic import (ssr: false) in Configurator.tsx.
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

/* ── Props ── */

type ModelViewerCoreProps = {
  src: string;
  alt: string;
  poster?: string;
};

export function ModelViewerCore({ src, alt, poster }: ModelViewerCoreProps) {
  const { lighting, camera } = useConfiguratorStore();
  const lights = LIGHTING_MAP[lighting];

  const cameraOrbit = `${camera.azimuth}deg ${camera.elevation}deg ${camera.distance}m`;

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
      ar
      ar-modes="webxr scene-viewer quick-look"
      ar-scale="auto"
      loading="lazy"
      reveal="auto"
      style={{ width: "100%", height: "100%", background: "transparent" }}
    />
  );
}
