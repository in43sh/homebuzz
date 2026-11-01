import { describe, it, expect } from "vitest";
import { authHref, safeNextPath } from "@/lib/redirect";

describe("safeNextPath", () => {
  it("accepts same-site paths", () => {
    expect(safeNextPath("/cart")).toBe("/cart");
    expect(safeNextPath("/account/orders/4")).toBe("/account/orders/4");
    expect(safeNextPath("/store?q=drill")).toBe("/store?q=drill");
  });

  it("rejects other sites, so sign-in cannot be an open redirect", () => {
    expect(safeNextPath("https://evil.example")).toBeNull();
    expect(safeNextPath("//evil.example")).toBeNull();
    expect(safeNextPath("/\\evil.example")).toBeNull();
    expect(safeNextPath("javascript:alert(1)")).toBeNull();
  });

  it("rejects empty, relative, and non-string values", () => {
    expect(safeNextPath("")).toBeNull();
    expect(safeNextPath("cart")).toBeNull();
    expect(safeNextPath(undefined)).toBeNull();
    expect(safeNextPath(["/cart", "/store"])).toBeNull();
  });

  it("rejects control characters and whitespace", () => {
    expect(safeNextPath("/cart\n")).toBeNull();
    expect(safeNextPath("/ca rt")).toBeNull();
  });
});

describe("authHref", () => {
  it("builds a plain link with no return address", () => {
    expect(authHref("/signin", null)).toBe("/signin");
  });

  it("adds the return address and reason", () => {
    expect(authHref("/signin", "/cart", "checkout")).toBe(
      "/signin?next=%2Fcart&reason=checkout",
    );
  });
});
