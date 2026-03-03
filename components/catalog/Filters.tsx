"use client";

import Link from "next/link";
import { getAllCategories, getAllTags, type ProductCategory } from "@/lib/products";
import { useI18n } from "@/components/i18n/I18nProvider";

export type CatalogFiltersValue = {
  category?: ProductCategory;
  tag?: string;
  minPrice?: string;
  maxPrice?: string;
};

export function Filters({
  value,
}: {
  value: CatalogFiltersValue;
}) {
  const { locale } = useI18n();
  const categories = getAllCategories();
  const tags = getAllTags();

  const labelClass = "text-sm font-medium text-slate-800 dark:text-slate-100";
  const controlClass =
    "mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50";

  return (
    <form method="GET" className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-[#161616] shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className={labelClass} htmlFor="category">
            {locale === "hi" ? "श्रेणी" : "Category"}
          </label>
          <select id="category" name="category" defaultValue={value.category ?? ""} className={controlClass}>
            <option value="">{locale === "hi" ? "सभी" : "All"}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="tag">
            {locale === "hi" ? "टैग" : "Tag"}
          </label>
          <select id="tag" name="tag" defaultValue={value.tag ?? ""} className={controlClass}>
            <option value="">{locale === "hi" ? "सभी" : "All"}</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="minPrice">
            {locale === "hi" ? "न्यूनतम मूल्य" : "Min price"}
          </label>
          <input
            id="minPrice"
            name="minPrice"
            inputMode="numeric"
            placeholder={locale === "hi" ? "उदा. 50" : "e.g. 50"}
            defaultValue={value.minPrice ?? ""}
            className={controlClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="maxPrice">
            {locale === "hi" ? "अधिकतम मूल्य" : "Max price"}
          </label>
          <input
            id="maxPrice"
            name="maxPrice"
            inputMode="numeric"
            placeholder={locale === "hi" ? "उदा. 300" : "e.g. 300"}
            defaultValue={value.maxPrice ?? ""}
            className={controlClass}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-500 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {locale === "hi" ? "लागू करें" : "Apply"}
        </button>

        <Link
          href="/products"
          className="text-sm text-slate-600 underline underline-offset-4 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          {locale === "hi" ? "रीसेट करें" : "Reset"}
        </Link>
      </div>
    </form>
  );
}
