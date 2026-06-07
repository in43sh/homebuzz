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
import { Badge } from "@/components/ui/Badge";
import { ProductPurchase } from "@/components/cart/ProductPurchase";

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

          <div className="mt-2">
            <ProductPurchase product={product} />
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
