"use client";

import * as React from "react";
import { loadModelViewer } from "@/components/configurator/shared";

type SharedModelViewerProps = {
  modelSrc: string;
  posterSrc: string;
  iosSrc?: string;
  materials?: {
    primary?: string;
  };
  components?: Record<string, boolean>;
  exposure?: number;
};

export const SharedModelViewer = React.forwardRef<any, SharedModelViewerProps>(({ 
  modelSrc, 
  posterSrc, 
  iosSrc,
  materials, 
  components,
  exposure = 1.0 
}, ref) => {
  const [ready, setReady] = React.useState(false);
  const internalRef = React.useRef<any>(null);

  // Merge the forwarded ref and internal ref
  React.useImperativeHandle(ref, () => internalRef.current);

  React.useEffect(() => {
    loadModelViewer().then(() => setReady(true)).catch(() => setReady(true));
  }, []);

  React.useEffect(() => {
    if (!ready || !internalRef.current) return;
    const viewer = internalRef.current;

    const applyMaterials = () => {
      const model = viewer.model;
      if (!model) return;
      
      // 1. Apply primary material color
      model.materials.forEach((material: any) => {
        if (materials?.primary) {
          material.pbrMetallicRoughness.setBaseColorFactor(materials.primary);
        }
      });

      // 2. Handle component (accessory) visibility
      if (components) {
        model.materials.forEach((material: any) => {
          const matName = material.name.toLowerCase();
          Object.entries(components).forEach(([id, visible]) => {
            if (matName.includes(id.toLowerCase())) {
              if (visible) {
                material.setAlphaMode("OPAQUE");
                if (materials?.primary) {
                   material.pbrMetallicRoughness.setBaseColorFactor(materials.primary);
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

    if (viewer.loaded) {
      applyMaterials();
    }
    viewer.addEventListener("load", applyMaterials);
    return () => viewer.removeEventListener("load", applyMaterials);
  }, [ready, materials, components]);

  return (
    <div className="relative h-full w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
        </div>
      )}
      {React.createElement("model-viewer", {
        ref: internalRef,
        src: modelSrc,
        // ios-src: iosSrc, // Removed to allow dynamic USDZ generation with custom colors
        poster: posterSrc,
        "auto-rotate": true,
        "camera-controls": true,
        "touch-action": "pan-y",
        "shadow-intensity": "1",
        "environment-image": "neutral",
        exposure: exposure,
        ar: true,
        "ar-modes": "webxr scene-viewer quick-look",
        "ar-placement": "floor",
        style: { width: "100%", height: "100%", "--poster-color": "transparent" }
      }, (
        <button
          slot="ar-button"
          className="hidden" // Hide the default button as we will trigger it from the header
        />
      ))}
    </div>
  );
});

SharedModelViewer.displayName = "SharedModelViewer";
