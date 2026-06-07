"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/cart" className="relative hover:text-brand">
      Cart
      {count > 0 && (
        <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-bold text-ink-900">
          {count}
        </span>
      )}
    </Link>
  );
}
