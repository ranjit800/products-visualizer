"use client";

import * as React from "react";
import { loadModelViewer } from "@/components/configurator/shared";

type SharedModelViewerProps = {
  modelSrc: string;
  posterSrc: string;
  materials?: {
    primary?: string;
  };
  exposure?: number;
};

export function SharedModelViewer({ modelSrc, posterSrc, materials, exposure = 1.0 }: SharedModelViewerProps) {
  const [ready, setReady] = React.useState(false);
  const viewerRef = React.useRef<any>(null);

  React.useEffect(() => {
    loadModelViewer().then(() => setReady(true)).catch(() => setReady(true));
  }, []);

  React.useEffect(() => {
    if (!ready || !viewerRef.current) return;
    const viewer = viewerRef.current;

    const applyMaterials = () => {
      const model = viewer.model;
      if (!model) return;
      
      model.materials.forEach((material: any) => {
        if (materials?.primary) {
          material.pbrMetallicRoughness.setBaseColorFactor(materials.primary);
        }
      });
    };

    if (viewer.loaded) {
      applyMaterials();
    }
    viewer.addEventListener("load", applyMaterials);
    return () => viewer.removeEventListener("load", applyMaterials);
  }, [ready, materials]);

  return (
    <div className="relative h-full w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
        </div>
      )}
      {React.createElement("model-viewer", {
        ref: viewerRef,
        src: modelSrc,
        poster: posterSrc,
        "auto-rotate": true,
        "camera-controls": true,
        "touch-action": "pan-y",
        "shadow-intensity": "1",
        "environment-image": "neutral",
        exposure: exposure,
        ar: true,
        "ar-modes": "webxr scene-viewer quick-look",
        style: { width: "100%", height: "100%", "--poster-color": "transparent" }
      }, (
        <button
          slot="ar-button"
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition active:scale-95 dark:bg-slate-900 dark:text-white"
        >
          <span>🕶️ View in AR</span>
        </button>
      ))}
    </div>
  );
}
