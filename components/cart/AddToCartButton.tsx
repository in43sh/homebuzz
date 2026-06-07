"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { useCart } from "./CartProvider";

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
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <Button
      variant={variant}
      size={size}
      className={`${fullWidth ? "w-full" : ""} ${className ?? ""}`}
      onClick={() => {
        add(product, quantity);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1500);
      }}
    >
      {added ? "Added ✓" : "Add to cart"}
    </Button>
  );
}
