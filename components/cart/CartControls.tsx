"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import {
  setQtyAction,
  removeItemAction,
  clearCartAction,
} from "@/app/actions/cart";
import { placeOrderAction } from "@/app/actions/orders";

export function CartItemControls({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) {
  const [pending, startTransition] = useTransition();

  const update = (q: number) =>
    startTransition(async () => {
      await setQtyAction(productId, q);
    });

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-md border border-gray-200">
        <button
          aria-label="Decrease quantity"
          disabled={pending}
          className="h-8 w-8 text-lg font-bold text-ink-900 hover:bg-gray-200 disabled:opacity-50"
          onClick={() => update(quantity - 1)}
        >
          −
        </button>
        <span className="w-8 text-center text-sm">{quantity}</span>
        <button
          aria-label="Increase quantity"
          disabled={pending}
          className="h-8 w-8 text-lg font-bold text-ink-900 hover:bg-gray-200 disabled:opacity-50"
          onClick={() => update(quantity + 1)}
        >
          +
        </button>
      </div>
      <button
        disabled={pending}
        className="text-sm text-gray-500 underline hover:text-ink-900 disabled:opacity-50"
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

export function CartFooter() {
  const [pending, startTransition] = useTransition();
  return (
    <>
      <Button
        variant="warning"
        className="mt-6 w-full"
        disabled={pending}
        onClick={() => startTransition(async () => placeOrderAction())}
      >
        {pending ? "Placing order…" : "Checkout"}
      </Button>
      <button
        disabled={pending}
        className="mt-3 w-full text-center text-sm text-gray-500 underline hover:text-ink-900 disabled:opacity-50"
        onClick={() => startTransition(async () => clearCartAction())}
      >
        Clear cart
      </button>
      <p className="mt-3 text-center text-xs text-gray-500">
        Demo checkout — no payment is taken. Stripe lands later.
      </p>
    </>
  );
}
