import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          Visualizer
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
          <Link href="/products" className="hover:text-slate-900 dark:hover:text-white">
            Products
          </Link>
          <Link href="/admin/preview" className="hover:text-slate-900 dark:hover:text-white">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

