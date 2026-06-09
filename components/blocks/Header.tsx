import Link from "next/link";
import { categories } from "@/lib/categories";
import { CartLink } from "@/components/cart/CartLink";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="bg-slate-700 text-white">
      {/* Top bar */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:gap-6">
        <MobileMenu />
        <Link href="/" className="text-2xl font-black tracking-tight">
          home<span className="text-brand">buzz</span>
        </Link>

        <form
          action="/store"
          className="ml-2 hidden flex-1 items-center md:flex"
          role="search"
        >
          <input
            type="search"
            name="q"
            placeholder="Search products…"
            aria-label="Search products"
            className="w-full rounded-l-md bg-white px-4 py-2 text-ink-900 placeholder:text-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-r-md bg-brand px-4 py-2 font-bold text-ink-900"
          >
            Search
          </button>
        </form>

        <nav className="ml-auto flex items-center gap-5 text-sm font-medium">
          <Link href="/account" className="hidden hover:text-brand sm:inline">
            Account
          </Link>
          <CartLink />
        </nav>
      </div>

      {/* Category strip (desktop only; mobile uses the drawer) */}
      <nav aria-label="Categories" className="hidden bg-ink-900 md:block">
        <ul className="mx-auto flex max-w-7xl flex-wrap gap-x-5 gap-y-1 px-4 py-2 text-sm text-gray-200">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/store/${c.slug}`}
                className="whitespace-nowrap hover:text-brand"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
