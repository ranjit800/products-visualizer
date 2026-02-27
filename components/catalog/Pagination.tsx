import Link from "next/link";

import { cn } from "@/lib/cn";

function withParam(searchParams: URLSearchParams, key: string, value: string) {
  const next = new URLSearchParams(searchParams);
  next.set(key, value);
  return next.toString();
}

export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: URLSearchParams;
}) {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2">
      <Link
        aria-disabled={prevDisabled}
        tabIndex={prevDisabled ? -1 : 0}
        href={`/products?${withParam(searchParams, "page", String(page - 1))}`}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md border px-3 text-sm",
          "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900",
          prevDisabled && "pointer-events-none opacity-50",
        )}
      >
        Prev
      </Link>

      <span className="px-3 text-sm text-slate-600 dark:text-slate-300">
        {page} / {totalPages}
      </span>

      <Link
        aria-disabled={nextDisabled}
        tabIndex={nextDisabled ? -1 : 0}
        href={`/products?${withParam(searchParams, "page", String(page + 1))}`}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md border px-3 text-sm",
          "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900",
          nextDisabled && "pointer-events-none opacity-50",
        )}
      >
        Next
      </Link>
    </nav>
  );
}

