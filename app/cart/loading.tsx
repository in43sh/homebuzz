export default function CartLoading() {
  return (
    <div role="status" className="mx-auto max-w-7xl px-4 py-10">
      <span className="sr-only">Loading your cart…</span>
      <div aria-hidden className="mb-8 h-9 w-56 animate-pulse rounded bg-gray-200" />
      <div aria-hidden className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-md bg-gray-200" />
          <div className="h-24 animate-pulse rounded-md bg-gray-200" />
        </div>
        <div className="h-56 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
