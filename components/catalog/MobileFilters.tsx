"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllCategories, getAllTags } from "@/lib/products";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useUIStore } from "@/store/uiStore";

export function MobileFilters() {
  const { locale } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMobileFilterOpen, setIsMobileFilterOpen } = useUIStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const categories = getAllCategories();
  const tags = getAllTags();

  const currentCategory = searchParams.get("category") || "";
  const currentTag = searchParams.get("tag") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  // Temporary state for the filter modal so it only applies on "Set Filters"
  const [tempTag, setTempTag] = useState(currentTag);
  const [tempMinPrice, setTempMinPrice] = useState(currentMinPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(currentMaxPrice);

  useEffect(() => {
    if (isMobileFilterOpen) {
      setTempTag(currentTag);
      setTempMinPrice(currentMinPrice);
      setTempMaxPrice(currentMaxPrice);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileFilterOpen, currentTag, currentMinPrice, currentMaxPrice]);

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`/products?${params.toString()}`);
  };

  const handleCategorySelect = (c: string) => {
    updateFilters({ category: c });
  };

  const applyModalFilters = () => {
    updateFilters({
      tag: tempTag,
      minPrice: tempMinPrice,
      maxPrice: tempMaxPrice,
    });
    setIsMobileFilterOpen(false);
  };

  const clearModalFilters = () => {
    setTempTag("");
    setTempMinPrice("");
    setTempMaxPrice("");
    updateFilters({ tag: "", minPrice: "", maxPrice: "" });
    setIsMobileFilterOpen(false);
  };

  if (!isMounted) return null;

  return (
    <>
      {/* ── Sliding Categories Bar (Top) ── */}
      <div className="md:hidden w-full overflow-x-auto no-scrollbar py-3 px-4 flex gap-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-20">
        <button
          onClick={() => handleCategorySelect("")}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !currentCategory
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {locale === "hi" ? "सभी" : "All"}
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => handleCategorySelect(c)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentCategory === c
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {locale === "hi" ? (c === "Chair" ? "कुर्सी" : c === "Lamp" ? "लैम्प" : "डेस्क") : c}
          </button>
        ))}
      </div>

      {/* ── Filter Bottom Sheet Modal ── */}
      {isMobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative bg-white dark:bg-[#131313] rounded-t-2xl w-full flex flex-col max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{locale === "hi" ? "फ़िल्टर" : "Filters"}</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 text-slate-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
              {/* Tag filter */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{locale === "hi" ? "टैग चुनें" : "Select Tag"}</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTempTag("")}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors border ${
                      !tempTag 
                        ? "bg-slate-900 text-white border-transparent dark:bg-white dark:text-black" 
                        : "bg-transparent text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {locale === "hi" ? "सभी टैग" : "All Tags"}
                  </button>
                  {tags.map(t => (
                    <button
                      key={t}
                      onClick={() => setTempTag(t)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors border ${
                        tempTag === t
                          ? "bg-slate-900 text-white border-transparent dark:bg-white dark:text-black" 
                          : "bg-transparent text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{locale === "hi" ? "मूल्य सीमा" : "Price Range"} ($)</h3>
                <div className="flex items-center gap-3 w-full">
                  <input 
                    type="number" 
                    placeholder={locale === "hi" ? "न्यूनतम" : "Min"} 
                    value={tempMinPrice}
                    onChange={(e) => setTempMinPrice(e.target.value)}
                    className="flex-1 min-w-0 bg-slate-100 dark:bg-[#1f1f1f] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none text-slate-900 dark:text-white" 
                  />
                  <span className="text-slate-400 shrink-0">-</span>
                  <input 
                    type="number" 
                    placeholder={locale === "hi" ? "अधिकतम" : "Max"} 
                    value={tempMaxPrice}
                    onChange={(e) => setTempMaxPrice(e.target.value)}
                    className="flex-1 min-w-0 bg-slate-100 dark:bg-[#1f1f1f] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none text-slate-900 dark:text-white" 
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-3 bg-white dark:bg-[#131313]">
              <button 
                onClick={clearModalFilters}
                className="flex-1 py-3.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-[#2a2a2a] dark:hover:bg-[#333]"
              >
                {locale === "hi" ? "साफ़ करें" : "Clear"}
              </button>
              <button 
                onClick={applyModalFilters}
                className="flex-2 py-3.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
              >
                {locale === "hi" ? "फ़िल्टर लागू करें" : "Apply Filters"}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      `}</style>
    </>
  );
}
