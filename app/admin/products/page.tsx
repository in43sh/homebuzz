import Link from "next/link";
import { listProductsForAdmin } from "@/lib/admin";
import { Button } from "@/components/ui/Button";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await listProductsForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-black text-ink-900">
          Products ({products.length})
        </h2>
        <Button href="/admin/products/new" size="small">
          New product
        </Button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="py-2 pr-4 font-medium">Title</th>
            <th className="py-2 pr-4 font-medium">Category</th>
            <th className="py-2 pr-4 font-medium">Price</th>
            <th className="py-2 pr-4 font-medium">Stock</th>
            <th className="py-2 pr-4 font-medium">Sale</th>
            <th className="py-2 pr-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-gray-200">
              <td className="py-3 pr-4 font-medium text-ink-900">{p.title}</td>
              <td className="py-3 pr-4 text-gray-500">{p.categoryName}</td>
              <td className="py-3 pr-4">{formatPrice(Number(p.price))}</td>
              <td className="py-3 pr-4">{p.stock}</td>
              <td className="py-3 pr-4">{p.onSale ? "Yes" : "—"}</td>
              <td className="flex items-center gap-4 py-3 pr-4">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="text-sm text-slate-700 underline hover:text-ink-900"
                >
                  Edit
                </Link>
                <DeleteProductButton id={p.id} title={p.title} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
