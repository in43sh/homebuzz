import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) redirect("/");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-heading font-black text-ink-900">Admin</h1>
        <nav className="flex gap-4 text-sm font-medium">
          <Link href="/admin/products" className="hover:text-slate-700">
            Products
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
