// Seed category list (from the legacy homebuzz-frontend constants).
// Slugs are derived for routing: /store/:slug.

export type Category = {
  name: string;
  slug: string;
};

const names = [
  "Bath & Faucets",
  "Decor & Furniture",
  "Paint & Building Materials",
  "Doors & Windows",
  "Electrical",
  "Flooring",
  "Hardware",
  "Heating & Cooling",
  "Ceiling Fans",
  "Plumbing",
  "Lawn & Garden",
  "Seasonal & Outdoor Living",
  "Kitchenware",
  "Appliances",
  "Storage",
] as const;

export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const categories: Category[] = names.map((name) => ({
  name,
  slug: slugify(name),
}));
