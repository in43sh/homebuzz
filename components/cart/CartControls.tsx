"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import {
  setQtyAction,
  removeItemAction,
  clearCartAction,
} from "@/app/actions/cart";

export function CartItemControls({
  productId,
  quantity,
  stock,
}: {
  productId: string;
  quantity: number;
  stock: number;
}) {
  const [pending, startTransition] = useTransition();

  const update = (q: number) =>
    startTransition(async () => {
      await setQtyAction(productId, q);
    });

  return (
    // Wraps on narrow screens: 44px controls plus Remove do not fit beside the
    // image and price at 375px.
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <div className="flex items-center rounded-md border border-gray-200">
        <button
          aria-label="Decrease quantity"
          // At 1, "−" would silently remove the item; "Remove" does that on purpose.
          disabled={pending || quantity <= 1}
          className="h-11 w-11 text-lg font-bold text-ink-900 hover:bg-gray-200 disabled:opacity-50"
          onClick={() => update(quantity - 1)}
        >
          −
        </button>
        <span className="w-8 text-center text-sm">{quantity}</span>
        <button
          aria-label="Increase quantity"
          // Cannot add more than is in stock.
          disabled={pending || quantity >= stock}
          className="h-11 w-11 text-lg font-bold text-ink-900 hover:bg-gray-200 disabled:opacity-50"
          onClick={() => update(quantity + 1)}
        >
          +
        </button>
      </div>
      <button
        disabled={pending}
        className="inline-flex min-h-11 items-center px-1 text-sm text-gray-500 underline hover:text-ink-900 disabled:opacity-50"
        onClick={() =>
          startTransition(async () => {
            await removeItemAction(productId);
          })
        }
      >
        Remove
      </button>
    </div>
  );
}

export function CartFooter({ blocked = false }: { blocked?: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <>
      {blocked ? (
        <Button variant="warning" className="mt-6 w-full" disabled>
          Checkout
        </Button>
      ) : (
        <Button href="/checkout" variant="warning" className="mt-6 w-full">
          Checkout
        </Button>
      )}
      <button
        disabled={pending}
        className="mt-3 flex min-h-11 w-full items-center justify-center text-sm text-gray-500 underline hover:text-ink-900 disabled:opacity-50"
        onClick={() => {
          if (!window.confirm("Remove all items from your cart?")) return;
          startTransition(async () => clearCartAction());
        }}
      >
        Clear cart
      </button>
      <p className="mt-3 text-center text-xs text-gray-500">
        Demo store — no payment is taken.
      </p>
    </>
  );
}
