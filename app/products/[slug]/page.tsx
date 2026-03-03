import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { formatPriceCents, getAllSlugs, getProductBySlug } from "@/lib/products";
import { ProductViewClient } from "./ProductViewClient";

import { cookies } from "next/headers";
import { getDictionary, type Locale } from "@/lib/i18n";
import { LOCALE_COOKIE_KEY } from "@/components/i18n/I18nProvider";

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

  const cookieStore = await cookies();
  const locale = (cookieStore.get(LOCALE_COOKIE_KEY)?.value as Locale) ?? "en";

  const title = `${product.title[locale]} | Visualizer`;
  const description = product.description[locale];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: product.thumbnailSrc, width: 400, height: 300, alt: product.title[locale] }],
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

  const cookieStore = await cookies();
  const locale = (cookieStore.get(LOCALE_COOKIE_KEY)?.value as Locale) ?? "en";

  return (
    <main style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <ProductViewClient
        product={product}
        configId={configId}
      />
    </main>
  );
}
