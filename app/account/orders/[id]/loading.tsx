export default function OrderLoading() {
  return (
    <div role="status" className="mx-auto max-w-3xl px-4 py-10">
      <span className="sr-only">Loading your order…</span>
      <div aria-hidden className="mb-8 h-9 w-48 animate-pulse rounded bg-gray-200" />
      <div aria-hidden className="space-y-4">
        <div className="h-24 animate-pulse rounded-md bg-gray-200" />
        <div className="h-24 animate-pulse rounded-md bg-gray-200" />
      </div>
    </div>
  );
}
