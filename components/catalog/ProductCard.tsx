"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInWishlist(!isInWishlist);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="relative flex flex-col bg-white dark:bg-[#161616] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_0px_15px_3px_rgba(0,0,0,0.10)] border border-slate-200 dark:border-transparent transition-transform hover:-translate-y-1"
    >
      {/* Wishlist Button */}
      <div
        className="absolute top-0 right-0 z-10 rounded-bl-xl rounded-tr-xl transition-colors"
        style={{ backgroundColor: isInWishlist ? "#ef4444" : "#9ca3af" }}
      >
        <button
          onClick={handleWishlistClick}
          className="p-2 transition-transform active:scale-95"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg 
            width="20" height="20" viewBox="0 0 24 24" 
            fill={isInWishlist ? "currentColor" : "none"} 
            stroke={isInWishlist ? "currentColor" : "white"} 
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={isInWishlist ? "text-white" : ""}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>
      </div>

      <div className="flex flex-col px-3 pt-3 pb-4 gap-4 w-full justify-center items-center relative">
        <div className="rounded-lg overflow-clip aspect-square w-full relative bg-slate-50 dark:bg-[#1f1f1f]">
          <Image
            src={product.thumbnailSrc}
            alt={`${product.title[locale]} thumbnail`}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-contain p-4"
          />
        </div>

        <div className="flex flex-col w-full justify-center gap-1">
          <h1 className="md:text-lg text-sm font-semibold truncate text-slate-900 dark:text-white">
            {product.title[locale]}
          </h1>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {formatPrice(product.priceCents, locale)}
          </h2>
        </div>
      </div>
    </Link>
  );
}
