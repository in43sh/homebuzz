import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getCategories } from "@/lib/products";
import { ProductGrid } from "@/components/store/ProductGrid";
import { CategorySidebar } from "@/components/store/CategorySidebar";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const found = (await getCategories()).find((c) => c.slug === category);
  return { title: found?.name ?? "Store" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const found = (await getCategories()).find((c) => c.slug === category);
  if (!found) notFound();

  const products = await getProducts({ category });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-heading font-black text-ink-900">{found.name}</h1>
      <div className="flex flex-col gap-8 md:flex-row">
        <CategorySidebar activeSlug={category} />
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
