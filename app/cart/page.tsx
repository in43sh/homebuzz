"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

const TAX_RATE = 0.08;

export default function CartPage() {
  const { items, subtotal, count, setQty, remove, clear } = useCart();

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
        {/* Line items */}
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

                <div className="mt-auto flex items-center gap-3">
                  <div className="flex items-center rounded-md border border-gray-200">
                    <button
                      aria-label="Decrease quantity"
                      className="h-8 w-8 text-lg font-bold text-ink-900 hover:bg-gray-200"
                      onClick={() => setQty(item.productId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      className="h-8 w-8 text-lg font-bold text-ink-900 hover:bg-gray-200"
                      onClick={() => setQty(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-sm text-gray-500 underline hover:text-ink-900"
                    onClick={() => remove(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right font-black text-ink-900">
                {formatPrice(item.price * item.quantity)}
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
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

          <Button
            variant="warning"
            className="mt-6 w-full"
            // Checkout lands in Slice 3 (Stripe). Stub for now.
            onClick={() => alert("Checkout arrives in Slice 3 (Stripe).")}
          >
            Checkout
          </Button>
          <button
            className="mt-3 w-full text-center text-sm text-gray-500 underline hover:text-ink-900"
            onClick={clear}
          >
            Clear cart
          </button>
        </aside>
      </div>
    </div>
  );
}
