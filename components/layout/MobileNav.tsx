"use client";

import { useRouter, usePathname } from "next/navigation";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useUIStore } from "@/store/uiStore";
import { useWishlistStore } from "@/store/wishlistStore";

export function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useI18n();
  const { setIsMobileFilterOpen } = useUIStore();
  const { wishlist } = useWishlistStore();

  const isProductsPage = pathname === "/products";
  const isWishlistPage = pathname === "/wishlist";
  const isHomePage = pathname === "/";
  const isSharePage = pathname.startsWith("/share");
  
  if (isWishlistPage || isSharePage) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#161616] border-t border-slate-200 dark:border-gray-800 backdrop-blur-xl h-16 flex items-center justify-around px-2 pb-safe">


      <button
        onClick={() => router.push("/products")}
        className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
          isProductsPage ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300"
        }`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
        <span className="text-[10px] font-medium">{locale === "hi" ? "उत्पाद" : "Products"}</span>
      </button>

      {isProductsPage && (
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-slate-500 hover:text-slate-900 dark:text-gray-500 dark:hover:text-gray-300 transition-colors relative"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <span className="text-[10px] font-medium">{locale === "hi" ? "फ़िल्टर" : "Filters"}</span>
        </button>
      )}

      <button
        onClick={() => router.push("/wishlist")}
        className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative ${
          isWishlistPage ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300"
        }`}
      >
        {wishlist.length > 0 && (
          <span className="absolute top-2 right-5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white dark:border-[#161616]"></span>
        )}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        <span className="text-[10px] font-medium">{locale === "hi" ? "विशलिस्ट" : "Wishlist"}</span>
      </button>
    </nav>
  );
}
