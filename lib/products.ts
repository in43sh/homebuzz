import { and, desc, eq, ilike, ne, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import type { Product } from "./types";

export type CategoryNav = { name: string; slug: string };

/** Category list for nav/routing, sourced from the DB (insertion order). */
export async function getCategories(): Promise<CategoryNav[]> {
  return db
    .select({ name: categories.name, slug: categories.slug })
    .from(categories)
    .orderBy(categories.id);
}

const selection = {
  id: products.id,
  slug: products.slug,
  title: products.title,
  description: products.description,
  price: products.price,
  unit: products.unit,
  ratingAvg: products.ratingAvg,
  ratingCount: products.ratingCount,
  image: products.image,
  onSale: products.onSale,
  categorySlug: categories.slug,
};

type Row = {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: string;
  unit: string;
  ratingAvg: string;
  ratingCount: number;
  image: string;
  onSale: boolean;
  categorySlug: string;
};

function mapRow(r: Row): Product {
  return {
    id: String(r.id),
    slug: r.slug,
    title: r.title,
    description: r.description,
    price: Number(r.price),
    unit: r.unit,
    rating: Number(r.ratingAvg),
    ratingCount: r.ratingCount,
    image: r.image,
    categorySlug: r.categorySlug,
    onSale: r.onSale,
  };
}

const baseQuery = () =>
  db
    .select(selection)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id));

export type ProductQuery = {
  category?: string;
  q?: string;
};

export async function getProducts({
  category,
  q,
}: ProductQuery = {}): Promise<Product[]> {
  const filters = [];
  if (category) filters.push(eq(categories.slug, category));
  if (q) {
    filters.push(
      or(ilike(products.title, `%${q}%`), ilike(products.description, `%${q}%`)),
    );
  }
  const rows = await baseQuery()
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(products.onSale), products.id);
  return rows.map(mapRow);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const rows = await baseQuery().where(eq(products.slug, slug)).limit(1);
  return rows[0] ? mapRow(rows[0]) : undefined;
}

export async function getRelatedProducts(
  slug: string,
  limit = 4,
): Promise<Product[]> {
  const current = await getProduct(slug);
  if (!current) {
    const rows = await baseQuery().limit(limit);
    return rows.map(mapRow);
  }
  const rows = await baseQuery()
    .where(
      and(eq(categories.slug, current.categorySlug), ne(products.slug, slug)),
    )
    .orderBy(sql`random()`)
    .limit(limit);
  return rows.map(mapRow);
}
