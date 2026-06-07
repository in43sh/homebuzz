import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Stars } from "./Stars";
import { PricePer } from "./PricePer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
      <Link
        href={`/product/${product.slug}`}
        className="relative mb-4 block aspect-square overflow-hidden rounded-md bg-gray-200"
      >
        {product.onSale && (
          <Badge className="absolute left-2 top-2 z-10">On Sale</Badge>
        )}
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-4 transition-transform group-hover:scale-105"
        />
      </Link>

      <Stars rating={product.rating} count={product.ratingCount} className="mb-1" />

      <Link href={`/product/${product.slug}`} className="mb-2">
        <h3 className="line-clamp-2 font-bold text-ink-900 hover:text-slate-700">
          {product.title}
        </h3>
      </Link>

      <PricePer price={product.price} unit={product.unit} className="mt-auto" />

      <Button size="small" variant="default" className="mt-3 w-full">
        Add to cart
      </Button>
    </article>
  );
}
