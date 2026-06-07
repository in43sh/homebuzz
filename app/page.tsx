import Link from "next/link";
import { getProducts } from "@/lib/mock-products";
import { ProductGrid } from "@/components/store/ProductGrid";
import { Button } from "@/components/ui/Button";
import { ItemsStrip } from "@/components/blocks/ItemsStrip";
import { PromoBanners } from "@/components/blocks/PromoBanners";
import { Tutorials } from "@/components/blocks/Tutorials";
import { DeliveryBanner } from "@/components/blocks/DeliveryBanner";

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
            <Button href="/store">Shop the store</Button>
          </div>
        </div>
      </section>

      <ItemsStrip />

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

      <PromoBanners />
      <Tutorials />
      <DeliveryBanner />
    </>
  );
}
