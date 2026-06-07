import Link from "next/link";
import { getProducts } from "@/lib/mock-products";
import { ProductGrid } from "@/components/store/ProductGrid";

export default function Home() {
  const popular = getProducts().slice(0, 8);
  return (
    <>
      {/* Hero */}
      <section className="bg-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-20 md:py-28">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
            Furniture Week
          </p>
          <h1 className="max-w-2xl text-4xl font-black leading-none text-ink-900 md:text-display">
            Everything for your home, in one place.
          </h1>
          <p className="max-w-xl text-gray-500">
            More than 2 million items in store. Paint, tools, hardware and more —
            delivered fast, efficient and free.
          </p>
          <div>
            <Link
              href="/store"
              className="inline-block rounded-md bg-brand px-6 py-3 font-bold text-ink-900 hover:brightness-95"
            >
              Shop the store
            </Link>
          </div>
        </div>
      </section>

      {/* Popular products */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-heading font-black text-ink-900">
            Popular Products
          </h2>
          <Link href="/store" className="text-sm font-bold hover:text-slate-700">
            View all →
          </Link>
        </div>
        <ProductGrid products={popular} />
      </section>

      {/* Delivery banner */}
      <section className="bg-brand">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-12 text-center">
          <h2 className="text-heading font-black text-white">WE DELIVER</h2>
          <p className="text-lg font-bold text-ink-900">
            Fast. Efficient. Free.
          </p>
        </div>
      </section>
    </>
  );
}
