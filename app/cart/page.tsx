import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCart } from "@/lib/cart";
import { computeTotals } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { CartItemControls, CartFooter } from "@/components/cart/CartControls";
import { formatPrice } from "@/lib/utils";
import { cartLineProblem } from "@/lib/stock";
import { StockBadge } from "@/components/store/StockBadge";

export const metadata: Metadata = { title: "Shopping cart" };

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

  const { tax, total } = computeTotals(subtotal);
  const noun = count === 1 ? "item" : "items";

  // Derived from live stock on every render, so it can never go stale.
  const problems = new Map(
    items.flatMap((i) => {
      const p = cartLineProblem(i.quantity, i.stock);
      return p ? [[i.productId, p] as const] : [];
    }),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="text-heading font-black text-ink-900">Shopping cart</h1>
        <span className="text-sm text-gray-500">
          {count} {noun}
        </span>
      </div>

      {/* Announces quantity changes to screen readers. */}
      <p role="status" className="sr-only">
        {count} {noun} in cart, total {formatPrice(total)}
      </p>

      {problems.size > 0 && (
        <p
          role="alert"
          className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          Some items are not available in the quantity you chose. Fix the items
          marked below to check out.
        </p>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-gray-200 border-y border-gray-200">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-4">
              <Link
                href={`/product/${item.slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-200"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-bold text-ink-900 hover:text-slate-700"
                >
                  {item.title}
                </Link>
                <span className="text-sm text-gray-500">
                  {formatPrice(item.price)} / {item.unit}
                </span>
                {problems.has(item.productId) ? (
                  <p className="text-sm font-bold text-red-700">
                    {problems.get(item.productId)}
                  </p>
                ) : (
                  <StockBadge stock={item.stock} hideWhenInStock />
                )}
                <div className="mt-auto">
                  <CartItemControls
                    productId={item.productId}
                    quantity={item.quantity}
                    stock={item.stock}
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
          <CartFooter blocked={problems.size > 0} />
        </aside>
      </div>
    </div>
  );
}
