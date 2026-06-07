import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/store" },
      { label: "Paint & Building", href: "/store/paint-and-building-materials" },
      { label: "Hardware", href: "/store/hardware" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/signin" },
      { label: "Cart", href: "/cart" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink-900 text-gray-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-xl font-black text-white">
            home<span className="text-brand">buzz</span>
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Everything for your home improvement projects.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="mb-3 text-sm font-bold text-white">{col.title}</h2>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-slate-700">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-gray-500">
          © {new Date().getFullYear()} Homebuzz. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
