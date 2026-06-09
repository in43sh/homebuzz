import { describe, it, expect } from "vitest";
import { cn, formatPrice } from "@/lib/utils";

describe("formatPrice", () => {
  it("formats whole and fractional dollars", () => {
    expect(formatPrice(49.99)).toBe("$49.99");
    expect(formatPrice(159)).toBe("$159.00");
  });

  it("rounds to two decimals", () => {
    expect(formatPrice(70.182)).toBe("$70.18");
  });
});

describe("cn", () => {
  it("merges conditional classes", () => {
    expect(cn("p-2", false && "hidden", "text-sm")).toBe("p-2 text-sm");
  });

  it("resolves conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
