"use client";

import { useState, useTransition } from "react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { addToCartAction } from "@/app/actions/cart";
import { pickerQuantities } from "@/lib/stock";

export function ProductPurchase({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [pending, startTransition] = useTransition();
  const quantities = pickerQuantities(product.stock);
  const outOfStock = quantities.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <label htmlFor="qty" className="text-sm font-bold text-ink-900">
          Quantity
        </label>
        <select
          id="qty"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          disabled={outOfStock}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm"
        >
          {quantities.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <Button
          variant="default"
          disabled={pending || outOfStock}
          onClick={() =>
            startTransition(async () => {
              await addToCartAction(product.id, qty);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1500);
            })
          }
        >
          {added ? "Added ✓" : pending ? "Adding…" : "Add to cart"}
        </Button>
      </div>
    </div>
  );
}
