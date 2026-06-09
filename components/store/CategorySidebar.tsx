import Link from "next/link";
import { getCategories } from "@/lib/products";
import { cn } from "@/lib/utils";

export async function CategorySidebar({ activeSlug }: { activeSlug?: string }) {
  const categories = await getCategories();
  return (
    <aside className="w-full shrink-0 md:w-56">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
        Categories
      </h2>
      <ul className="space-y-1 text-sm">
        <li>
          <Link
            href="/store"
            className={cn(
              "block rounded px-2 py-1 hover:bg-gray-200",
              !activeSlug && "bg-gray-200 font-bold",
            )}
          >
            All products
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/store/${c.slug}`}
              className={cn(
                "block rounded px-2 py-1 hover:bg-gray-200",
                activeSlug === c.slug && "bg-gray-200 font-bold",
              )}
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
