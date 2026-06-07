export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  unit: string; // e.g. "gallon", "each"
  rating: number; // 0–5
  ratingCount: number;
  image: string;
  categorySlug: string;
  onSale?: boolean;
};
