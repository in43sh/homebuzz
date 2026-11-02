import { describe, it, expect } from "vitest";
import { computeTotals, DELIVERY_METHODS, TAX_RATE } from "@/lib/pricing";

describe("computeTotals", () => {
  it("adds 8% tax and no shipping for standard delivery", () => {
    expect(computeTotals(100)).toEqual({
      subtotal: 100,
      shipping: 0,
      tax: 8,
      total: 108,
    });
  });

  it("adds the express price, and tax applies to the goods only", () => {
    const t = computeTotals(100, "express");
    expect(t.shipping).toBe(12.99);
    expect(t.tax).toBe(8);
    expect(t.total).toBe(120.99);
  });

  it("rounds tax to the cent", () => {
    // 19.99 * 0.08 = 1.5992 -> 1.60
    expect(computeTotals(19.99).tax).toBe(1.6);
  });

  it("never drifts by a fraction of a cent", () => {
    for (const subtotal of [0.1 + 0.2, 33.33, 1234.56, 0.01]) {
      const t = computeTotals(subtotal, "express");
      expect(Math.round(t.total * 100)).toBe(
        Math.round(t.subtotal * 100) +
          Math.round(t.shipping * 100) +
          Math.round(t.tax * 100),
      );
    }
  });

  it("uses the shared rate and delivery table", () => {
    expect(TAX_RATE).toBe(0.08);
    expect(DELIVERY_METHODS.standard.cents).toBe(0);
    expect(DELIVERY_METHODS.express.cents).toBe(1299);
  });
});
