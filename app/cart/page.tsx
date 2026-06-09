import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { CartItemControls, CartFooter } from "@/components/cart/CartControls";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Shopping cart" };

const TAX_RATE = 0.08;

export default async function CartPage() {
  const { items, subtotal, count } = await getCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="mb-4 text-heading font-black text-ink-900">
          Your cart is empty
        </h1>
        <p className="mb-8 text-gray-500">
          Browse the store and add a few things.
        </p>
        <Button href="/store">Shop the store</Button>
      </div>
    );
  }

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="text-heading font-black text-ink-900">Shopping cart</h1>
        <span className="text-sm text-gray-500">{count} items</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-gray-200 border-y border-gray-200">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-4">
              <Link
                href={`/product/${item.slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-200"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="80px"
                  className="object-contain p-2"
                />
              </Link>

              <div className="flex flex-1 flex-col">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-bold text-ink-900 hover:text-slate-700"
                >
                  {item.title}
                </Link>
                <span className="text-sm text-gray-500">
                  {formatPrice(item.price)} / {item.unit}
                </span>
                <div className="mt-auto">
                  <CartItemControls
                    productId={item.productId}
                    quantity={item.quantity}
                  />
                </div>
              </div>

              <div className="text-right font-black text-ink-900">
                {formatPrice(item.lineTotal)}
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-lg font-black text-ink-900">Order summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal</dt>
              <dd className="font-medium">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Estimated tax</dt>
              <dd className="font-medium">{formatPrice(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
              <dt className="font-black text-ink-900">Total</dt>
              <dd className="font-black text-ink-900">{formatPrice(total)}</dd>
            </div>
          </dl>
          <CartFooter />
        </aside>
      </div>
    </div>
  );
}
