export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Product: {slug}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Product detail placeholder. SSR product data + metadata + configurator
        entry will be implemented next.
      </p>
    </main>
  );
}

