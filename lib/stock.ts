/**
 * Stock rules shared by the product page, the cart, and the cart library.
 * Pure functions only, so they can be unit-tested without a database.
 */

/** At or below this many units, shoppers see "Only N left". */
export const LOW_STOCK_THRESHOLD = 5;

/** Largest quantity offered in the product page picker. */
export const MAX_PICKER_QUANTITY = 5;

export type StockStatus = { kind: "out" | "low" | "in"; label: string };

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return { kind: "out", label: "Out of stock" };
  if (stock <= LOW_STOCK_THRESHOLD) {
    return { kind: "low", label: `Only ${stock} left` };
  }
  return { kind: "in", label: "In stock" };
}

/** Never let a cart quantity exceed what is available. */
export function clampToStock(quantity: number, stock: number): number {
  return Math.max(0, Math.min(quantity, stock));
}

/** Quantities offered in the product page picker: 1 up to min(5, stock). */
export function pickerQuantities(stock: number): number[] {
  const max = Math.min(MAX_PICKER_QUANTITY, Math.max(0, stock));
  return Array.from({ length: max }, (_, i) => i + 1);
}

/**
 * What is wrong with a cart line, in words the shopper can act on, or null
 * when the line is fine. Computed from live stock, so it never goes stale.
 */
export function cartLineProblem(quantity: number, stock: number): string | null {
  if (stock <= 0) return "Out of stock. Remove it to check out.";
  if (quantity > stock) {
    return `Only ${stock} left. Reduce the quantity to check out.`;
  }
  return null;
}
