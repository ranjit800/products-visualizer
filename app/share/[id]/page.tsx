export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Shared config</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Placeholder for configuration ID: <span className="font-mono">{id}</span>
      </p>
    </main>
  );
}

