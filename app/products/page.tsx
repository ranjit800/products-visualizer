import type { Metadata } from "next";

import { Suspense } from "react";
import { Filters, MobileFilters, Pagination, ProductCard } from "@/components/catalog";
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


import { cookies } from "next/headers";
import { getDictionary, type Locale } from "@/lib/i18n";
import { LOCALE_COOKIE_KEY } from "@/components/i18n/I18nProvider";

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
  const cookieStore = await cookies();
  const locale = (cookieStore.get(LOCALE_COOKIE_KEY)?.value as Locale) ?? "en";
  const dict = getDictionary(locale);

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
      {/* Desktop Header */}
      <div className="hidden md:flex items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{dict.navProducts || "Products"}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {locale === "hi" ? "फ़िल्टर लागू करें और उत्पाद सूची ब्राउज़ करें।" : "Apply filters and browse the product catalog."}
          </p>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {total} {locale === "hi" ? "परिणाम" : "results"}
        </p>
      </div>

      {/* Mobile Top Nav (Slide Filters) */}
      <Suspense fallback={<div className="h-14 animate-pulse bg-slate-100 dark:bg-slate-900 md:hidden" />}>
        <MobileFilters />
      </Suspense>

      {/* Desktop Inline Filters */}
      <div className="mt-6 hidden md:block">
        <Filters
          value={{
            category,
            tag,
            minPrice: typeof sp.minPrice === "string" ? sp.minPrice : "",
            maxPrice: typeof sp.maxPrice === "string" ? sp.maxPrice : "",
          }}
        />
      </div>

      <section aria-label="Product results" className="mt-4 md:mt-8 pb-20 md:pb-4">
        {/*
          2 columns on mobile (grid-cols-2)
          3 columns on desktop (md:grid-cols-3)
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {items.length === 0 ? (
          <p className="mt-8 text-sm text-slate-600 dark:text-slate-300">
            {locale === "hi" ? "कोई उत्पाद नहीं मिला।" : "No products found."}
          </p>
        ) : null}

        <Pagination page={page} totalPages={totalPages} searchParams={currentSearch} />
      </section>
    </main>
  );
}

