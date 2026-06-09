import { describe, it, expect } from "vitest";
import {
  signInSchema,
  signUpSchema,
  reviewSchema,
  productSchema,
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
