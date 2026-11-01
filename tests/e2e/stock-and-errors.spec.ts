import { test, expect } from "@playwright/test";

// Stock display and error handling from the checkout research
// (docs/audits/redesign_research.md, findings CK-06, CK-07, CK-08, CK-14).
// None of these tests place an order or change stock.

// Next.js renders its own empty role="alert" route announcer, so always filter
// alerts by their text.
const alertWith = (page: import("@playwright/test").Page, text: string | RegExp) =>
  page.getByRole("alert").filter({ hasText: text });

test.describe("stock display", () => {
  test("the product page says the item is in stock", async ({ page }) => {
    await page.goto("/product/glidden-premium-interior-paint-1");

    await expect(page.getByText("In stock", { exact: true })).toBeVisible();
    // Seeded stock is 100, so the full 1-5 picker is offered.
    await expect(page.locator("#qty option")).toHaveCount(5);
  });
});

test.describe("cart announcements", () => {
  test("the cart has a status line that screen readers can read", async ({
    page,
  }) => {
    await page.goto("/store");
    const addButton = page.locator("article").first().getByRole("button");
    await addButton.click();
    await expect(addButton).toHaveText(/Added/);

    await page.goto("/cart");
    await expect(page.getByRole("status")).toContainText(/1 item in cart, total \$/);
  });
});

test.describe("custom pages", () => {
  test("an unknown URL shows the branded 404 with a way back", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "We can't find that page" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Shop the store" })).toBeVisible();
  });
});

test.describe("form errors are announced", () => {
  test("a wrong password is announced and focus returns to the password field", async ({
    page,
  }) => {
    await page.goto("/signin");
    await page.getByLabel("Email").fill("demo@homebuzz.test");
    await page.getByLabel("Password").fill("not-the-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(alertWith(page, "Invalid email or password")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeFocused();
  });

  test("sign-up errors are announced, marked invalid, and focus the first bad field", async ({
    page,
  }) => {
    await page.goto("/signup");
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(alertWith(page, "Enter your name")).toBeVisible();
    await expect(alertWith(page, "Enter a valid email")).toBeVisible();
    await expect(alertWith(page, /at least 8 characters/i)).toBeVisible();

    const name = page.getByLabel("Name");
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAttribute("aria-describedby", "name-error");
    await expect(name).toBeFocused();
  });
});
