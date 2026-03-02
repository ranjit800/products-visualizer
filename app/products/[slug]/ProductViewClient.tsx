"use client";

import * as React from "react";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Product } from "@/lib/products";

const ModelViewer3D = dynamic(
  () => import("@/components/configurator/ModelViewer3D").then((m) => m.ModelViewer3D),
  {
    ssr: false,
    loading: () => (
      <div style={{
        width: "100%", height: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            border: "4px solid rgba(0,0,0,0.08)",
            borderTopColor: "#7c3aed",
            animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500 }}>Loading 3D Model…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    ),
  },
);

type Props = {
  product: Product;
  formatPrice: string;
  configId?: string;
};

export function ProductViewClient({ product, formatPrice, configId }: Props) {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const data = {
        slug: product.slug,
        title: product.title.en,
        timestamp: Date.now(),
      };
      localStorage.setItem("visualizer_last_viewed", JSON.stringify(data));
    }
  }, [product.slug, product.title.en]);

  return (
    <Suspense fallback={null}>
      <ModelViewer3D product={product} formatPrice={formatPrice} configId={configId} />
    </Suspense>
  );
}
