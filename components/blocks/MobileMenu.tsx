"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CategoryNav } from "@/lib/products";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ categories }: { categories: CategoryNav[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // While open: lock scroll, close on Escape, move focus in, trap Tab inside
  // the drawer, and hand focus back to the hamburger when it closes.
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
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
          {/* backdrop: pointer-only dismiss, hidden from keyboard and screen
              readers (the X button inside the dialog is the accessible one) */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute inset-0 bg-ink-900/60"
            onClick={() => setOpen(false)}
          />
          {/* drawer — close when any link inside is activated */}
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col bg-slate-700 text-white shadow-xl"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
          >
            <div className="flex items-center justify-between border-b border-ink-900 px-4 py-4">
              <span className="text-xl font-black">
                base<span className="text-brand">hardware</span>
              </span>
              <button
                ref={closeRef}
                type="button"
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
                className="w-full rounded-l-md bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-gray-500 focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-slate-700"
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
