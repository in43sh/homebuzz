import Link from "next/link";
import { categories } from "@/lib/categories";
import { CartLink } from "@/components/cart/CartLink";

export function Header() {
  return (
    <header className="bg-slate-700 text-white">
      {/* Top bar */}
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4">
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
          <Link href="/signin" className="hover:text-brand">
            Account
          </Link>
          <CartLink />
        </nav>
      </div>

      {/* Category strip */}
      <nav aria-label="Categories" className="bg-ink-900">
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
