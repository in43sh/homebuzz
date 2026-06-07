import type { Metadata } from "next";
import { getProducts } from "@/lib/mock-products";
import { ProductGrid } from "@/components/store/ProductGrid";
import { CategorySidebar } from "@/components/store/CategorySidebar";

export const metadata: Metadata = {
  title: "Store",
  description: "Browse paint, tools, hardware and more.",
};

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = getProducts({ q });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-heading font-black text-ink-900">
        {q ? `Results for “${q}”` : "All products"}
      </h1>
      <div className="flex flex-col gap-8 md:flex-row">
        <CategorySidebar />
        <div className="flex-1">
          <p className="mb-4 text-sm text-gray-500">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
