/**
 * Order pricing shared by the cart, the checkout page, and order placement.
 * Pure functions only, so they can be unit-tested without a database.
 * Money is computed in whole cents, so totals never drift by a fraction of a cent.
 */

export const TAX_RATE = 0.08;

export const DELIVERY_METHODS = {
  standard: { label: "Standard", detail: "3 to 5 business days", cents: 0 },
  express: { label: "Express", detail: "1 to 2 business days", cents: 1299 },
} as const;

export type DeliveryMethod = keyof typeof DELIVERY_METHODS;

export const DELIVERY_METHOD_KEYS = ["standard", "express"] as const;

export type Totals = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

/** Subtotal, shipping, tax, and total in dollars, rounded to the cent. */
export function computeTotals(
  subtotal: number,
  method: DeliveryMethod = "standard",
): Totals {
  const subtotalCents = Math.round(subtotal * 100);
  const shippingCents = DELIVERY_METHODS[method].cents;
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  return {
    subtotal: subtotalCents / 100,
    shipping: shippingCents / 100,
    tax: taxCents / 100,
    total: (subtotalCents + shippingCents + taxCents) / 100,
  };
}
