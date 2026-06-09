import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { auth } from "@/auth";
import { slugify } from "@/lib/categories";
import type { ProductValues } from "@/lib/validation";

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "admin";
}

export type AdminProductRow = {
  id: number;
  title: string;
  slug: string;
  price: string;
  stock: number;
  onSale: boolean;
  categoryName: string;
};

export async function listProductsForAdmin(): Promise<AdminProductRow[]> {
  return db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      price: products.price,
      stock: products.stock,
      onSale: products.onSale,
      categoryName: categories.name,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.id));
}

export type EditableProduct = typeof products.$inferSelect;

export async function getProductById(
  id: number,
): Promise<EditableProduct | null> {
  const [row] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return row ?? null;
}

export async function listCategoryOptions() {
  return db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .orderBy(categories.name);
}

async function uniqueSlug(title: string, excludeId?: number): Promise<string> {
  const base = slugify(title);
  const existing = await db
    .select({ id: products.id, slug: products.slug })
    .from(products)
    .where(eq(products.slug, base))
    .limit(1);
  if (!existing[0] || existing[0].id === excludeId) return base;
  return `${base}-${Date.now().toString().slice(-5)}`;
}

export async function createProduct(values: ProductValues): Promise<void> {
  const slug = await uniqueSlug(values.title);
  await db.insert(products).values({
    slug,
    title: values.title,
    description: values.description ?? "",
    price: values.price.toFixed(2),
    unit: values.unit,
    image: values.image,
    stock: values.stock,
    onSale: values.onSale,
    categoryId: values.categoryId,
  });
}

export async function updateProduct(
  id: number,
  values: ProductValues,
): Promise<void> {
  const slug = await uniqueSlug(values.title, id);
  await db
    .update(products)
    .set({
      slug,
      title: values.title,
      description: values.description ?? "",
      price: values.price.toFixed(2),
      unit: values.unit,
      image: values.image,
      stock: values.stock,
      onSale: values.onSale,
      categoryId: values.categoryId,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));
}

export async function deleteProduct(id: number): Promise<void> {
  await db.delete(products).where(eq(products.id, id));
}
