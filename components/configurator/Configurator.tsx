"use client";

/**
 * Configurator — the full 3D configurator panel.
 * - Dynamically imports ModelViewerCore (ssr: false) so 3D code only loads
 *   when the user opens the configurator section.
 * - Shows ConfiguratorControls sidebar.
 * - AR button (model-viewer handles AR natively via ar attribute).
 * - Save / Share button (stub for Step 8).
 */

import dynamic from "next/dynamic";
import * as React from "react";

import { ConfiguratorControls } from "./ConfiguratorControls";
import { Button, Badge } from "@/components/ui";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/cn";

/* ── Dynamically import the heavy model-viewer component ── */
const ModelViewerCore = dynamic(
  () => import("./ModelViewerCore").then((m) => m.ModelViewerCore),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600 dark:border-slate-700 dark:border-t-slate-300" />
          <span className="text-sm">Loading 3D model…</span>
        </div>
      </div>
    ),
  },
);

/* ── Props ── */
type ConfiguratorProps = {
  productSlug: string;
  modelSrc?: string;
  productName: string;
};

export function Configurator({ productSlug, modelSrc, productName }: ConfiguratorProps) {
  const { openProduct, materials } = useConfiguratorStore();
  const { flags } = useUIStore();
  const [isOpen, setIsOpen] = React.useState(false);

  // Register which product is open in the store
  React.useEffect(() => {
    openProduct(productSlug);
  }, [productSlug, openProduct]);

  // Derive the model tint color from store
  const tintColor = materials["primary"] ?? "#1e293b";

  if (!isOpen) {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <Button size="lg" onClick={() => setIsOpen(true)} aria-expanded={false}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>
          </svg>
          Open 3D Configurator
        </Button>
        <p className="text-sm text-slate-500">Configure materials, lighting &amp; more</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            3D Configurator
          </h2>
          <Badge variant="info">Interactive</Badge>
        </div>
        <div className="flex items-center gap-2">
          {flags.enableAR && (
            <Badge variant="success">AR Ready</Badge>
          )}
          <button
            type="button"
            aria-label="Close configurator"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main layout: 3D viewer + controls */}
      <div className="grid lg:grid-cols-[1fr_300px]">
        {/* 3D Viewer */}
        <div
          className="relative min-h-[400px] bg-slate-100 dark:bg-slate-950"
          style={{ "--model-color": tintColor } as React.CSSProperties}
        >
          {modelSrc ? (
            <ModelViewerCore
              src={modelSrc}
              alt={`3D model of ${productName}`}
            />
          ) : (
            /* Fallback when no GLB model is available */
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 p-8">
              <div
                className="flex h-48 w-48 items-center justify-center rounded-2xl shadow-lg transition-all duration-500"
                style={{ backgroundColor: tintColor }}
                aria-label={`Preview with color ${tintColor}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
                </svg>
              </div>
              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                3D model preview — color changes apply in real time
                <br />
                <span className="text-xs">(GLB model file not yet provided)</span>
              </p>
            </div>
          )}
        </div>

        {/* Controls sidebar */}
        <div className="overflow-y-auto border-l border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <ConfiguratorControls />

          {/* Save config button (stub — wired in Step 8) */}
          <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
            <Button className="w-full" aria-label="Save your configuration">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Configuration
            </Button>
            <p className="mt-1 text-center text-xs text-slate-400">
              Save &amp; get a shareable link
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
