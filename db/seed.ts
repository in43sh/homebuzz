import bcrypt from "bcryptjs";
import { db } from "./index";
import {
  categories as categoriesTable,
  products as productsTable,
  users as usersTable,
} from "./schema";
import { categories as categorySeed } from "../lib/categories";
import { products as productSeed } from "../lib/mock-products";

async function main() {
  console.log("Seeding database…");

  // Idempotent: clear in FK-safe order.
  await db.delete(productsTable);
  await db.delete(categoriesTable);
  await db.delete(usersTable);

  // Demo users (password for both: "password1234")
  const passwordHash = await bcrypt.hash("password1234", 10);
  await db.insert(usersTable).values([
    { name: "Demo Customer", email: "demo@homebuzz.test", passwordHash },
    {
      name: "Admin",
      email: "admin@homebuzz.test",
      passwordHash,
      role: "admin",
    },
  ]);
  console.log("  2 users (demo@homebuzz.test / admin@homebuzz.test)");

  // Categories
  const insertedCategories = await db
    .insert(categoriesTable)
    .values(categorySeed.map((c) => ({ name: c.name, slug: c.slug })))
    .returning({ id: categoriesTable.id, slug: categoriesTable.slug });

  const idBySlug = new Map(insertedCategories.map((c) => [c.slug, c.id]));
  console.log(`  ${insertedCategories.length} categories`);

  // Products
  const rows = productSeed.map((p) => {
    const categoryId = idBySlug.get(p.categorySlug);
    if (!categoryId) {
      throw new Error(`No category for slug "${p.categorySlug}"`);
    }
    return {
      slug: p.slug,
      title: p.title,
      description: p.description,
      price: p.price.toFixed(2),
      unit: p.unit,
      ratingAvg: p.rating.toFixed(1),
      ratingCount: p.ratingCount,
      stock: 100,
      image: p.image,
      onSale: Boolean(p.onSale),
      categoryId,
    };
  });

  await db.insert(productsTable).values(rows);
  console.log(`  ${rows.length} products`);

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
