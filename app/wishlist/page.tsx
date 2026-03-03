"use client";

import * as React from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useWishlistStore } from "@/store/wishlistStore";
import { getProductBySlug } from "@/lib/products";
import { ProductCard } from "@/components/catalog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const { wishlist } = useWishlistStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const wishlistedProducts = wishlist
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 min-h-[calc(100vh-140px)]">
      <div className="flex flex-col gap-6">
        {/* Back Button (Mobile only) */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="-ml-2 mb-2 flex items-center gap-2 text-slate-600 dark:text-slate-400"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            {locale === "hi" ? "पीछे" : "Back"}
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("navWishlist")}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {locale === "hi" 
              ? "आपके द्वारा सहेजे गए पसंदीदा उत्पादों की सूची।" 
              : "A collection of your favorite saved products."}
          </p>
        </div>

        {wishlistedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-4">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {t("wishlistEmpty")}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-zinc-400 max-w-sm">
              {locale === "hi"
                ? "जब आपको कोई पसंद आए, तो उसे अपनी विशलिस्ट में जोड़ने के लिए दिल के आइकन पर क्लिक करें।"
                : "When you find something you like, click the heart icon to save it here for later."}
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-8 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:scale-105 active:scale-95 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {t("browseProducts")}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
