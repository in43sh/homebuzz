import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getProduct,
  getRelatedProducts,
  products,
} from "@/lib/mock-products";
import { Stars } from "@/components/store/Stars";
import { PricePer } from "@/components/store/PricePer";
import { ProductGrid } from "@/components/store/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.title, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelatedProducts(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
          {product.onSale && (
            <Badge className="absolute left-3 top-3 z-10">On Sale</Badge>
          )}
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-8"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-heading font-black leading-tight text-ink-900">
            {product.title}
          </h1>
          <Stars rating={product.rating} count={product.ratingCount} />
          <PricePer price={product.price} unit={product.unit} />
          <p className="text-gray-500">{product.description}</p>

          <div className="mt-2 flex items-center gap-3">
            <label htmlFor="qty" className="text-sm font-bold text-ink-900">
              Quantity
            </label>
            <select
              id="qty"
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm"
              defaultValue={1}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex gap-3">
            <Button variant="default">Add to cart</Button>
            <Button variant="outline">Buy now</Button>
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mt-16">
        <h2 className="mb-6 text-heading font-black text-ink-900">
          You Might Also Need
        </h2>
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
