import { listCategoryOptions } from "@/lib/admin";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await listCategoryOptions();
  return (
    <div>
      <h2 className="mb-6 text-lg font-black text-ink-900">New product</h2>
      <ProductForm id={null} categories={categories} />
    </div>
  );
}
