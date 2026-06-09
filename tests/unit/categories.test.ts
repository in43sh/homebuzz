import { describe, it, expect } from "vitest";
import { slugify, categories } from "@/lib/categories";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Doors & Windows")).toBe("doors-and-windows");
  });

  it("expands ampersands to 'and'", () => {
    expect(slugify("Bath & Faucets")).toBe("bath-and-faucets");
  });

  it("collapses non-alphanumerics and trims edges", () => {
    expect(slugify("  Paint & Building   Materials!! ")).toBe(
      "paint-and-building-materials",
    );
  });

  it("is idempotent on an already-slugged value", () => {
    const once = slugify("Heating & Cooling");
    expect(slugify(once)).toBe(once);
  });
});

describe("categories seed", () => {
  it("has 15 categories with unique slugs", () => {
    expect(categories).toHaveLength(15);
    const slugs = new Set(categories.map((c) => c.slug));
    expect(slugs.size).toBe(15);
  });
});
