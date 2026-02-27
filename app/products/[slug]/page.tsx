import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Configurator } from "@/components/configurator";
import { Badge } from "@/components/ui";
import { formatPriceCents, getAllSlugs, getProductBySlug } from "@/lib/products";

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

  if (!product) {
    return { title: "Product Not Found | Visualizer" };
  }

  const title = `${product.title.en} | Visualizer`;
  const description = product.description.en;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: product.thumbnailSrc,
          width: 400,
          height: 300,
          alt: product.title.en,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ── Page ── */
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const relatedCategory = product.category;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/products" className="hover:text-slate-900 dark:hover:text-white">
          Products
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white">{product.title.en}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Hero image */}
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900">
          <Image
            src={product.thumbnailSrc}
            alt={product.title.en}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-8"
          />
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-6">
          {/* Category + title */}
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {relatedCategory}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {product.title.en}
            </h1>
            <p className="mt-1 text-lg font-semibold text-slate-700 dark:text-slate-300">
              {formatPriceCents(product.priceCents)}
            </p>
          </div>

          {/* Description */}
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {product.description.en}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Divider */}
          <hr className="border-slate-200 dark:border-slate-700" />

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/products/${product.slug}#configurator`}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              Open 3D Configurator
            </Link>
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              ← Back to catalog
            </Link>
          </div>

          {/* Feature list */}
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400" aria-label="Product features">
            <li className="flex items-center gap-2">
              <span className="text-emerald-500" aria-hidden="true">✓</span>
              Interactive 3D configuration
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500" aria-hidden="true">✓</span>
              AR preview on supported mobile devices
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500" aria-hidden="true">✓</span>
              Save and share your configuration
            </li>
          </ul>
        </div>
      </div>

      {/* 3D Configurator — dynamically imported (ssr: false) */}
      <section id="configurator" aria-label="3D Configurator" className="mt-16 scroll-mt-20">
        <Configurator
          productSlug={product.slug}
          productName={product.title.en}
          modelSrc={`/models/${product.slug}.glb`}
        />
      </section>
    </main>
  );
}
