import Link from "next/link";

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Catalog page placeholder. Filters + pagination will be implemented next.
      </p>

      <div className="mt-6">
        <Link className="underline underline-offset-4" href="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}

