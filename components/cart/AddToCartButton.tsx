"use client";

import { useState, useTransition } from "react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { addToCartAction } from "@/app/actions/cart";

export function AddToCartButton({
  product,
  quantity = 1,
  variant = "default",
  size = "small",
  className,
  fullWidth,
}: {
  product: Product;
  quantity?: number;
  variant?: "default" | "outline" | "warning";
  size?: "regular" | "small";
  className?: string;
  fullWidth?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  return (
    <Button
      variant={variant}
      size={size}
      className={`${fullWidth ? "w-full" : ""} ${className ?? ""}`}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await addToCartAction(product.id, quantity);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1500);
        })
      }
    >
      {added ? "Added ✓" : pending ? "Adding…" : "Add to cart"}
    </Button>
  );
}
