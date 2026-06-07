import type { Product } from "./types";
import { slugify } from "./categories";

// Temporary in-memory catalog. Phase 2 replaces this module with Drizzle/Neon
// queries — keep the function signatures stable so callers don't change.

type Seed = Omit<Product, "id" | "slug" | "categorySlug"> & {
  category?: string;
};

const seeds: Seed[] = [
  { title: "Glidden Premium Interior Paint", description: "One-coat interior latex paint with a smooth matte finish. Low-VOC, easy to apply and quick to dry.", price: 49.99, unit: "gallon", rating: 4.5, ratingCount: 128, image: "/products/paint.png", category: "Paint & Building Materials", onSale: true },
  { title: "Behr Premium Plus Paint & Primer", description: "Paint and primer in one for excellent hide and durability on interior walls and trim.", price: 38.99, unit: "gallon", rating: 4.7, ratingCount: 342, image: "/products/paint.png" },
  { title: "DeWalt 20V Cordless Drill Kit", description: "Compact, high-torque cordless drill with two batteries, charger and carrying case.", price: 159.0, unit: "each", rating: 4.8, ratingCount: 519, image: "/products/drill.png", category: "Hardware", onSale: true },
  { title: "Ryobi Lithium-Ion Drill + Charger", description: "Lightweight everyday drill/driver with a comfortable grip and LED work light.", price: 79.99, unit: "each", rating: 4.4, ratingCount: 211, image: "/products/drill.png", category: "Hardware" },
  { title: "Husky 12-Piece Screwdriver Set", description: "Chrome-vanadium steel screwdrivers with cushioned grips. Phillips and slotted sizes.", price: 24.99, unit: "set", rating: 4.6, ratingCount: 96, image: "/products/screwdrivers.png", category: "Hardware" },
  { title: "Precision Screwdriver Set", description: "Fine-tip screwdrivers for electronics and detailed work.", price: 14.99, unit: "set", rating: 4.2, ratingCount: 44, image: "/products/screwdrivers.png", category: "Electrical", onSale: true },
  { title: "Stanley 65-Piece Home Tool Kit", description: "Everything for everyday repairs: hammer, pliers, tape measure, bits and more in a sturdy case.", price: 89.99, unit: "kit", rating: 4.7, ratingCount: 274, image: "/products/toolkit.png", category: "Hardware" },
  { title: "Mechanic's Tool Kit", description: "Comprehensive socket and ratchet kit for automotive and household jobs.", price: 129.0, unit: "kit", rating: 4.5, ratingCount: 158, image: "/products/toolkit.png", category: "Hardware" },
  { title: "Exterior Weatherproof Paint", description: "Durable exterior paint that resists fading, cracking and peeling.", price: 54.99, unit: "gallon", rating: 4.3, ratingCount: 67, image: "/products/paint.png", category: "Paint & Building Materials" },
  { title: "Impact Driver 18V", description: "High-speed impact driver for driving long screws and lag bolts with ease.", price: 119.0, unit: "each", rating: 4.6, ratingCount: 183, image: "/products/drill.png", category: "Hardware" },
  { title: "Magnetic Screwdriver Bit Set", description: "Assorted driver bits with a magnetic holder for quick changes.", price: 19.99, unit: "set", rating: 4.1, ratingCount: 38, image: "/products/screwdrivers.png", category: "Hardware" },
  { title: "Pro Contractor Tool Bag", description: "Heavy-duty tool bag with reinforced base and multiple pockets.", price: 64.99, unit: "each", rating: 4.4, ratingCount: 52, image: "/products/toolkit.png", category: "Storage" },
];

export const products: Product[] = seeds.map((s, i) => {
  const category = s.category ?? "Hardware";
  return {
    ...s,
    id: String(i + 1),
    slug: `${slugify(s.title)}-${i + 1}`,
    categorySlug: slugify(category),
  };
});

export type ProductQuery = {
  category?: string;
  q?: string;
};

export function getProducts({ category, q }: ProductQuery = {}): Product[] {
  let result = products;
  if (category) {
    result = result.filter((p) => p.categorySlug === category);
  }
  if (q) {
    const needle = q.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle),
    );
  }
  return result;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(slug: string, limit = 4): Product[] {
  const current = getProduct(slug);
  if (!current) return products.slice(0, limit);
  return products
    .filter((p) => p.slug !== slug && p.categorySlug === current.categorySlug)
    .concat(products.filter((p) => p.categorySlug !== current.categorySlug))
    .slice(0, limit);
}
