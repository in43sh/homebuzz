"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { categories } from "@/lib/categories";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  // lock scroll + close on Escape while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="rounded p-1 hover:text-brand md:hidden"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* backdrop */}
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-ink-900/60"
            onClick={() => setOpen(false)}
          />
          {/* drawer — close when any link inside is activated */}
          <div
            className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col bg-slate-700 text-white shadow-xl"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
          >
            <div className="flex items-center justify-between border-b border-ink-900 px-4 py-4">
              <span className="text-xl font-black">
                home<span className="text-brand">buzz</span>
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded p-1 hover:text-brand"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <form action="/store" role="search" className="flex px-4 py-3">
              <input
                type="search"
                name="q"
                placeholder="Search products…"
                aria-label="Search products"
                className="w-full rounded-l-md bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-r-md bg-brand px-3 py-2 text-sm font-bold text-ink-900"
              >
                Go
              </button>
            </form>

            <nav className="flex items-center gap-4 border-b border-ink-900 px-4 pb-3 text-sm font-medium">
              <Link href="/account" className="hover:text-brand">
                Account
              </Link>
              <Link href="/cart" className="hover:text-brand">
                Cart
              </Link>
            </nav>

            <nav
              aria-label="Categories"
              className="flex-1 overflow-y-auto px-4 py-3"
            >
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-200">
                Categories
              </p>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/store"
                    className="block rounded px-2 py-2 hover:bg-ink-900"
                  >
                    All products
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/store/${c.slug}`}
                      className="block rounded px-2 py-2 hover:bg-ink-900"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
