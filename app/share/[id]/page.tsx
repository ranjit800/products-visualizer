import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Badge } from "@/components/ui";
import { SharedModelViewer } from "@/components/catalog/SharedModelViewer";
import { getProductBySlug, formatPriceCents } from "@/lib/products";

type SharePageProps = { params: Promise<{ id: string }> };

/* ── Fetch config server-side ── */
async function fetchConfig(id: string) {
  try {
    // Call Render backend directly — avoids proxy self-loop on Vercel
    const api = process.env.RENDER_API_URL ?? "http://localhost:4000";
    const res = await fetch(`${api}/api/configurations/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Shared Configuration #${id} | Visualizer`,
    description: "View a saved product configuration from Visualizer.",
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const config = await fetchConfig(id);
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  if (!config) notFound();

  const product = getProductBySlug(config.productSlug);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Shared Configuration
            </h1>
            <Badge variant="info">#{id.slice(0, 6)}</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Saved {new Date(config.createdAt).toLocaleString()}
          </p>
          {config.name && (
            <p className="mt-1 text-base font-medium text-slate-700 dark:text-slate-300">
              &ldquo;{config.name}&rdquo;
            </p>
          )}
        </div>
        <Link
          href="/products"
          className="text-sm text-slate-500 underline underline-offset-4 hover:text-slate-800 dark:hover:text-slate-200"
        >
          Browse catalog
        </Link>
      </div>

      {/* Product info & 3D Preview */}
      {product ? (
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
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
              <p className="text-[10px] uppercase tracking-widest text-slate-500">{product.category}</p>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {product.title.en}
              </h2>
              <p className="text-xs text-slate-500">{formatPriceCents(product.priceCents)}</p>
            </div>
            <Link
              href={`/products/${product.slug}?configId=${id}`}
              className="ml-auto inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Open &amp; Edit
            </Link>
          </div>

          {/* 3D Preview Area */}
          <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800">
            <SharedModelViewer
              modelSrc={`/models/${product.slug}.glb`}
              posterSrc={product.thumbnailSrc}
              materials={config.materials}
              exposure={config.exposure}
            />
          </div>
        </div>
      ) : (
        <p className="mb-6 text-sm text-slate-500">Product no longer available.</p>
      )}

      {/* Configuration details */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Color */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Color</h3>
          {config.materials?.primary ? (
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-full border border-slate-200 shadow-sm"
                style={{ backgroundColor: config.materials.primary }}
                aria-label={`Color: ${config.materials.primary}`}
              />
              <code className="text-xs text-slate-600 dark:text-slate-400">
                {config.materials.primary}
              </code>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Default</p>
          )}
        </div>

        {/* Lighting */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Lighting</h3>
          <Badge variant="default" className="capitalize">{config.lightingPreset}</Badge>
        </div>

        {/* Accessories */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Accessories</h3>
          {Object.entries(config.components as Record<string, boolean>).filter(([, v]) => v).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {Object.entries(config.components as Record<string, boolean>)
                .filter(([, v]) => v)
                .map(([k]) => (
                  <Badge key={k} variant="success" className="capitalize">{k}</Badge>
                ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">None selected</p>
          )}
        </div>

        {/* Camera */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Camera</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Rotation: {config.camera.azimuth}° · Elevation: {config.camera.elevation}° · Zoom: {config.camera.distance}m
          </p>
        </div>
      </div>

      {/* Share link */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
        <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-400">Shareable link</p>
        <code className="block break-all text-xs text-slate-800 dark:text-slate-200">
          {`${baseUrl}/share/${id}`}
        </code>
      </div>
    </main>
  );
}
