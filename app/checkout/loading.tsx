export default function CheckoutLoading() {
  return (
    <div role="status" className="mx-auto max-w-7xl px-4 py-10">
      <span className="sr-only">Loading checkout…</span>
      <div aria-hidden className="mb-8 h-9 w-48 animate-pulse rounded bg-gray-200" />
      <div aria-hidden className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="h-96 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-72 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
