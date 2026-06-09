import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, getRelatedProducts, getProducts } from "@/lib/products";
import { getReviews, canReview } from "@/lib/reviews";
import { auth } from "@/auth";
import { Stars } from "@/components/store/Stars";
import { PricePer } from "@/components/store/PricePer";
import { ProductGrid } from "@/components/store/ProductGrid";
import { ReviewForm } from "@/components/store/ReviewForm";
import { Badge } from "@/components/ui/Badge";
import { ProductPurchase } from "@/components/cart/ProductPurchase";

export async function generateStaticParams() {
  const all = await getProducts();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.title, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [related, reviews, session, reviewable] = await Promise.all([
    getRelatedProducts(slug),
    getReviews(Number(product.id)),
    auth(),
    canReview(Number(product.id)),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
          {product.onSale && (
            <Badge className="absolute left-3 top-3 z-10">On Sale</Badge>
          )}
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8"
              priority
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              No image
            </span>
          )}
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

      {/* Reviews */}
      <section className="mt-16">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-heading font-black text-ink-900">Reviews</h2>
          <Stars rating={product.rating} count={product.ratingCount} />
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            {reviews.length === 0 ? (
              <li className="text-gray-500">No reviews yet. Be the first.</li>
            ) : (
              reviews.map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-bold text-ink-900">{r.author}</span>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="text-xs text-gray-500">
                    {r.createdAt.toLocaleDateString()}
                  </p>
                  {r.body && <p className="mt-2 text-gray-700">{r.body}</p>}
                </li>
              ))
            )}
          </ul>

          {!session?.user ? (
            <div className="h-fit rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              <Link href="/signin" className="font-bold text-ink-900 underline">
                Sign in
              </Link>{" "}
              to write a review.
            </div>
          ) : reviewable ? (
            <ReviewForm productId={Number(product.id)} slug={product.slug} />
          ) : (
            <div className="h-fit rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              Only customers who have ordered this product can review it.
            </div>
          )}
        </div>
      </section>

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
