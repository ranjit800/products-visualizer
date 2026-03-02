import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { formatPriceCents, getAllSlugs, getProductBySlug } from "@/lib/products";
import { ProductViewClient } from "./ProductViewClient";

/* ── Static params for SSG ── */
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/* ── Per-product SEO metadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return { title: "Product Not Found | Visualizer" };

  const title = `${product.title.en} | Visualizer`;
  const description = product.description.en;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: product.thumbnailSrc, width: 400, height: 300, alt: product.title.en }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* ── Page ── */
export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ configId?: string }>;
}) {
  const { slug } = await params;
  const { configId } = (await searchParams) || {};
  const product = getProductBySlug(slug);

  if (!product) notFound();

  return (
    <main style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <ProductViewClient
        product={product}
        formatPrice={formatPriceCents(product.priceCents)}
        configId={configId}
      />
    </main>
  );
}
