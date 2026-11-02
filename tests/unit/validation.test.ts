import { describe, it, expect } from "vitest";
import {
  signInSchema,
  signUpSchema,
  reviewSchema,
  productSchema,
  checkoutSchema,
} from "@/lib/validation";

describe("signInSchema", () => {
  it("accepts a valid email + password", () => {
    expect(
      signInSchema.safeParse({ email: "a@b.com", password: "password1" })
        .success,
    ).toBe(true);
  });

  it("rejects a bad email and a short password", () => {
    expect(signInSchema.safeParse({ email: "nope", password: "x" }).success).toBe(
      false,
    );
  });
});

describe("signUpSchema", () => {
  const base = {
    name: "Sam",
    email: "sam@b.com",
    password: "password1",
    confirmPassword: "password1",
  };

  it("accepts matching passwords", () => {
    expect(signUpSchema.safeParse(base).success).toBe(true);
  });

  it("rejects mismatched passwords with a path", () => {
    const res = signUpSchema.safeParse({
      ...base,
      confirmPassword: "different1",
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].path).toContain("confirmPassword");
    }
  });
});

describe("reviewSchema", () => {
  it("coerces a string rating to a number", () => {
    const res = reviewSchema.safeParse({ rating: "5" });
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.rating).toBe(5);
  });

  it("rejects out-of-range ratings", () => {
    expect(reviewSchema.safeParse({ rating: 6 }).success).toBe(false);
    expect(reviewSchema.safeParse({ rating: 0 }).success).toBe(false);
  });
});

describe("productSchema", () => {
  it("coerces numeric fields and applies defaults", () => {
    const res = productSchema.safeParse({
      title: "Hammer",
      price: "12.50",
      categoryId: "3",
      image: "/products/hammer.png",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.price).toBe(12.5);
      expect(res.data.categoryId).toBe(3);
      expect(res.data.unit).toBe("each");
      expect(res.data.stock).toBe(0);
      expect(res.data.onSale).toBe(false);
    }
  });

  it("requires a local image path", () => {
    const base = { title: "Hammer", price: "5", categoryId: "1" };
    // missing / empty image is rejected
    expect(productSchema.safeParse(base).success).toBe(false);
    expect(productSchema.safeParse({ ...base, image: "" }).success).toBe(false);
    // remote URL is rejected (no next/image remotePatterns configured)
    expect(
      productSchema.safeParse({ ...base, image: "https://x.com/a.png" }).success,
    ).toBe(false);
    // local public path is accepted
    expect(
      productSchema.safeParse({ ...base, image: "/products/h.png" }).success,
    ).toBe(true);
  });

  it("rejects a non-positive price", () => {
    expect(
      productSchema.safeParse({ title: "X", price: "0", categoryId: "1" })
        .success,
    ).toBe(false);
  });

  it("requires a title", () => {
    expect(
      productSchema.safeParse({ title: "", price: "5", categoryId: "1" })
        .success,
    ).toBe(false);
  });
});

describe("checkoutSchema", () => {
  const valid = {
    name: "Alex Rivera",
    line1: "123 Main St",
    line2: "",
    city: "Austin",
    state: "TX",
    zip: "78701",
    phone: "",
    deliveryMethod: "standard",
  };

  it("accepts a complete address", () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts ZIP+4, a phone with separators, and an apartment line", () => {
    const r = checkoutSchema.safeParse({
      ...valid,
      zip: "78701-1234",
      phone: "(512) 555-0100",
      line2: "Apt 4B",
    });
    expect(r.success).toBe(true);
  });

  it("trims whitespace", () => {
    const r = checkoutSchema.parse({ ...valid, city: "  Austin  " });
    expect(r.city).toBe("Austin");
  });

  it.each([
    ["name", ""],
    ["line1", "12"],
    ["city", ""],
    ["state", ""],
    ["state", "ZZ"],
    ["zip", "1234"],
    ["zip", "abcde"],
    ["phone", "12345"],
    ["deliveryMethod", "overnight"],
  ])("rejects %s = %j", (field, value) => {
    const r = checkoutSchema.safeParse({ ...valid, [field]: value });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path[0]).toBe(field);
  });
});
