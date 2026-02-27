"use client";

import Image from "next/image";
import Link from "next/link";

import { useI18n } from "@/components/i18n/I18nProvider";
import type { Product } from "@/lib/products";

function formatPrice(priceCents: number, locale: "en" | "hi") {
  const price = priceCents / 100;
  return new Intl.NumberFormat(locale === "hi" ? "hi-IN" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductCard({ product }: { product: Product }) {
  const { locale } = useI18n();

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="relative aspect-3/2 w-full bg-slate-100 dark:bg-slate-900">
        <Image
          src={product.thumbnailSrc}
          alt={product.title[locale]}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold tracking-tight">{product.title[locale]}</h3>
          <span className="shrink-0 text-sm text-slate-700 dark:text-slate-200">
            {formatPrice(product.priceCents, locale)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
          {product.description[locale]}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

