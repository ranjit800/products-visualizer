"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllCategories, getAllTags } from "@/lib/products";

export function MobileFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    if (isFilterOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempTag(currentTag);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempMinPrice(currentMinPrice);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempMaxPrice(currentMaxPrice);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isFilterOpen, currentTag, currentMinPrice, currentMaxPrice]);

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
    setIsFilterOpen(false);
  };

  const clearModalFilters = () => {
    setTempTag("");
    setTempMinPrice("");
    setTempMaxPrice("");
    updateFilters({ tag: "", minPrice: "", maxPrice: "" });
    setIsFilterOpen(false);
  };

  return (
    <>
      {/* ── Sliding Categories Bar (Top) ── */}
      {isMounted && (
        <div className="md:hidden w-full overflow-x-auto no-scrollbar py-3 px-4 flex gap-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-20">
        <button
          onClick={() => handleCategorySelect("")}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !currentCategory
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          All
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
            {c}
          </button>
        ))}
        </div>
      )}

      {/* ── Fixed Bottom Navigation (Mobile) ── */}
      {isMounted && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#161616] border-t border-slate-200 dark:border-gray-800 backdrop-blur-xl h-16 flex items-center justify-around px-2 pb-safe">
        <button
          onClick={() => router.push("/")}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-slate-500 hover:text-slate-900 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-slate-900 dark:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
          <span className="text-[10px] font-medium">Catalog</span>
        </button>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-slate-500 hover:text-slate-900 dark:text-gray-500 dark:hover:text-gray-300 transition-colors relative"
        >
          {(currentTag || currentMinPrice || currentMaxPrice) && (
            <span className="absolute top-2 right-5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white dark:border-[#161616]"></span>
          )}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <span className="text-[10px] font-medium">Filters</span>
        </button>
        <button
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-slate-500 hover:text-slate-900 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          <span className="text-[10px] font-medium">Wishlist</span>
        </button>
      </nav>
      )}

      {/* ── Filter Bottom Sheet Modal ── */}
      {isMounted && isFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="relative bg-white dark:bg-[#131313] rounded-t-2xl w-full flex flex-col max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 text-slate-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
              {/* Tag filter */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Select Tag</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTempTag("")}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors border ${
                      !tempTag 
                        ? "bg-slate-900 text-white border-transparent dark:bg-white dark:text-black" 
                        : "bg-transparent text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700"
                    }`}
                  >
                    All Tags
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
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Price Range ($)</h3>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={tempMinPrice}
                    onChange={(e) => setTempMinPrice(e.target.value)}
                    className="flex-1 bg-slate-100 dark:bg-[#1f1f1f] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none text-slate-900 dark:text-white" 
                  />
                  <span className="text-slate-400">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={tempMaxPrice}
                    onChange={(e) => setTempMaxPrice(e.target.value)}
                    className="flex-1 bg-slate-100 dark:bg-[#1f1f1f] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none text-slate-900 dark:text-white" 
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-3 bg-white dark:bg-[#131313]">
              <button 
                onClick={clearModalFilters}
                className="flex-1 py-3.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-[#2a2a2a] dark:hover:bg-[#333]"
              >
                Clear
              </button>
              <button 
                onClick={applyModalFilters}
                className="flex-2 py-3.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
              >
                Apply Filters
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
