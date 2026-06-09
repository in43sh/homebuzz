import { notFound } from "next/navigation";
import { getProductById, listCategoryOptions } from "@/lib/admin";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) notFound();

  const [product, categories] = await Promise.all([
    getProductById(productId),
    listCategoryOptions(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h2 className="mb-6 text-lg font-black text-ink-900">
        Edit “{product.title}”
      </h2>
      <ProductForm
        id={product.id}
        categories={categories}
        defaults={{
          title: product.title,
          description: product.description,
          price: Number(product.price),
          unit: product.unit,
          categoryId: product.categoryId,
          image: product.image,
          stock: product.stock,
          onSale: product.onSale,
        }}
      />
    </div>
  );
}
