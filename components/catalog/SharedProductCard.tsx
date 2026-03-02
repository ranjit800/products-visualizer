"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { SharedModelViewer } from "./SharedModelViewer";
import { formatPriceCents } from "@/lib/products";

type SharedProductCardProps = {
  product: any;
  config: any;
  id: string;
};

export function SharedProductCard({ product, config, id }: SharedProductCardProps) {
  const viewerRef = React.useRef<any>(null);
  const [canAR, setCanAR] = React.useState(false);

  React.useEffect(() => {
    const checkAR = () => {
      const viewer = viewerRef.current;
      if (viewer) {
        // model-viewer emits 'load' when the model is ready
        const handleLoad = () => {
          setCanAR(!!viewer.canActivateAR);
        };
        viewer.addEventListener("load", handleLoad);
        // If already loaded
        if (viewer.loaded) setCanAR(!!viewer.canActivateAR);
        
        return () => viewer.removeEventListener("load", handleLoad);
      }
    };
    
    // We might need a small delay or wait for model-viewer to be defined
    const timer = setTimeout(checkAR, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleARClick = () => {
    if (viewerRef.current?.canActivateAR) {
      viewerRef.current.activateAR();
    }
  };

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
          <Image
            src={product.thumbnailSrc}
            alt={product.title.en}
            fill
            sizes="64px"
            className="object-contain p-2"
          />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{product.category}</p>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">
            {product.title.en}
          </h2>
          <p className="text-xs font-medium text-slate-500">{formatPriceCents(product.priceCents)}</p>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          {canAR && (
            <button
              onClick={handleARClick}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
              </svg>
              View in AR
            </button>
          )}
          <Link
            href={`/products/${product.slug}?configId=${id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Open &amp; Edit
          </Link>
        </div>
      </div>

      {/* 3D Preview Area */}
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <SharedModelViewer
          ref={viewerRef}
          modelSrc={`/models/${product.slug}.glb`}
          iosSrc={`/models/${product.slug}.usdz`}
          posterSrc={product.thumbnailSrc}
          materials={config.materials}
          components={config.components}
          exposure={config.exposure}
        />
      </div>
    </div>
  );
}
