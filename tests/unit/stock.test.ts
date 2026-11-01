import { describe, it, expect } from "vitest";
import {
  LOW_STOCK_THRESHOLD,
  cartLineProblem,
  clampToStock,
  pickerQuantities,
  stockStatus,
} from "@/lib/stock";

describe("stockStatus", () => {
  it("is out of stock at zero and below", () => {
    expect(stockStatus(0)).toEqual({ kind: "out", label: "Out of stock" });
    expect(stockStatus(-3).kind).toBe("out");
  });

  it("says how many are left at or below the low-stock threshold", () => {
    expect(stockStatus(1)).toEqual({ kind: "low", label: "Only 1 left" });
    expect(stockStatus(LOW_STOCK_THRESHOLD)).toEqual({
      kind: "low",
      label: `Only ${LOW_STOCK_THRESHOLD} left`,
    });
  });

  it("is in stock above the threshold", () => {
    expect(stockStatus(LOW_STOCK_THRESHOLD + 1)).toEqual({
      kind: "in",
      label: "In stock",
    });
  });
});

describe("clampToStock", () => {
  it("never exceeds the available stock", () => {
    expect(clampToStock(100, 99)).toBe(99);
    expect(clampToStock(2, 99)).toBe(2);
  });

  it("never goes below zero", () => {
    expect(clampToStock(5, 0)).toBe(0);
    expect(clampToStock(5, -2)).toBe(0);
  });
});

describe("pickerQuantities", () => {
  it("offers 1 to 5 when plenty is in stock", () => {
    expect(pickerQuantities(100)).toEqual([1, 2, 3, 4, 5]);
  });

  it("offers only what exists when stock is low", () => {
    expect(pickerQuantities(3)).toEqual([1, 2, 3]);
  });

  it("offers nothing when out of stock", () => {
    expect(pickerQuantities(0)).toEqual([]);
  });
});

describe("cartLineProblem", () => {
  it("is null when the quantity fits", () => {
    expect(cartLineProblem(2, 99)).toBeNull();
    expect(cartLineProblem(99, 99)).toBeNull();
  });

  it("names how many are left when the quantity is too high", () => {
    expect(cartLineProblem(100, 99)).toMatch(/Only 99 left/);
  });

  it("tells the shopper to remove an out-of-stock line", () => {
    expect(cartLineProblem(1, 0)).toMatch(/Out of stock/);
  });
});
