"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { Product } from "@/lib/products";
import { useWishlistStore } from "@/store/wishlistStore";

function formatPrice(priceCents: number, locale: "en" | "hi") {
  const price = priceCents / 100;
  return new Intl.NumberFormat(locale === "hi" ? "hi-IN" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { locale } = useI18n();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const active = isInWishlist(product.slug);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.slug);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative flex flex-col bg-white dark:bg-[#161616] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_0px_15px_3px_rgba(0,0,0,0.15)] border border-slate-200 dark:border-white/5 group transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
      >
        {/* Wishlist Button */}
        <div
          className="absolute top-0 right-0 z-10 rounded-bl-xl rounded-tr-xl transition-colors"
          style={{ backgroundColor: active ? "#ef4444" : "#9ca3af" }}
        >
          <motion.button
            onClick={handleWishlistClick}
            className="p-2"
            aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.15 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={active ? "currentColor" : "none"}
              stroke={active ? "currentColor" : "white"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={active ? "text-white" : ""}
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </motion.button>
        </div>

        <div className="flex flex-col px-3 pt-3 pb-4 gap-4 w-full justify-center items-center relative">
          {/* Thumbnail with hover scale */}
          <div className="rounded-lg overflow-clip aspect-square w-full relative bg-slate-50 dark:bg-[#1f1f1f]">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Image
                src={product.thumbnailSrc}
                alt={`${product.title[locale]} thumbnail`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-contain p-4"
              />
            </motion.div>
          </div>

          <div className="flex flex-col w-full justify-center gap-1">
            <h2 className="md:text-lg text-sm font-semibold truncate text-slate-900 dark:text-zinc-50">
              {product.title[locale]}
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              {formatPrice(product.priceCents, locale)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
