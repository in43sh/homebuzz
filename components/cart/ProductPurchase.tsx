"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { useCart } from "./CartProvider";

export function ProductPurchase({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

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
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <Button
          variant="default"
          onClick={() => {
            add(product, qty);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1500);
          }}
        >
          {added ? "Added ✓" : "Add to cart"}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            add(product, qty);
            router.push("/cart");
          }}
        >
          Buy now
        </Button>
      </div>
    </div>
  );
}
