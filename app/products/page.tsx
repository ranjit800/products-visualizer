import type { Metadata } from "next";

import { Filters, Pagination, ProductCard } from "@/components/catalog";
import { queryProducts, type ProductCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products | Visualizer",
  description:
    "Browse our curated catalog of chairs, lamps, and desks. Filter by category and price, then configure your product in 3D.",
  openGraph: {
    title: "Products | Visualizer",
    description: "Browse and configure premium furniture products in 3D.",
    type: "website",
  },
};


function parseIntOrUndefined(v: string | undefined) {
  if (!v) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const page = parseIntOrUndefined(typeof sp.page === "string" ? sp.page : undefined) ?? 1;

  const category =
    typeof sp.category === "string" && (sp.category === "Chair" || sp.category === "Lamp" || sp.category === "Desk")
      ? (sp.category as ProductCategory)
      : undefined;

  const tag = typeof sp.tag === "string" && sp.tag.length > 0 ? sp.tag : undefined;

  const minPrice = parseIntOrUndefined(typeof sp.minPrice === "string" ? sp.minPrice : undefined);
  const maxPrice = parseIntOrUndefined(typeof sp.maxPrice === "string" ? sp.maxPrice : undefined);

  const { items, total, totalPages } = queryProducts({
    page,
    pageSize: 6,
    category,
    tag,
    minPriceCents: typeof minPrice === "number" ? minPrice * 100 : undefined,
    maxPriceCents: typeof maxPrice === "number" ? maxPrice * 100 : undefined,
  });

  const currentSearch = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") currentSearch.set(key, value);
  }
  if (!currentSearch.get("page")) currentSearch.set("page", String(page));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Products
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Apply filters and browse the product catalog.
          </p>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {total} results
        </p>
      </div>

      <div className="mt-6">
        <Filters
          value={{
            category,
            tag,
            minPrice: typeof sp.minPrice === "string" ? sp.minPrice : "",
            maxPrice: typeof sp.maxPrice === "string" ? sp.maxPrice : "",
          }}
        />
      </div>

      <section aria-label="Product results" className="mt-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {items.length === 0 ? (
          <p className="mt-8 text-sm text-slate-600 dark:text-slate-300">
            No products found.
          </p>
        ) : null}

        <Pagination page={page} totalPages={totalPages} searchParams={currentSearch} />
      </section>
    </main>
  );
}

