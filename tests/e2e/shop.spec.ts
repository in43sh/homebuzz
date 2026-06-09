import { test, expect } from "@playwright/test";

test.describe("storefront", () => {
  test("browses the catalog", async ({ page }) => {
    await page.goto("/store");
    await expect(
      page.getByRole("heading", { name: "All products" }),
    ).toBeVisible();
    // At least one product card with an Add to cart button.
    await expect(
      page.getByRole("button", { name: "Add to cart" }).first(),
    ).toBeVisible();
  });

  test("filters by search query", async ({ page }) => {
    await page.goto("/store?q=drill");
    await expect(
      page.getByRole("heading", { name: /Results for/ }),
    ).toBeVisible();
    await expect(page.getByText(/Drill/i).first()).toBeVisible();
  });

  test("adds a product to the cart", async ({ page }) => {
    await page.goto("/store");

    // Stable handle on the first card's button (its label flips after click).
    const addButton = page.locator("article").first().getByRole("button");
    await addButton.click();
    // Server action confirms by flipping the label.
    await expect(addButton).toHaveText(/Added/);

    await page.goto("/cart");
    await expect(
      page.getByRole("heading", { name: "Shopping cart" }),
    ).toBeVisible();
    // Order summary total renders a USD amount.
    await expect(page.getByText("Total", { exact: true })).toBeVisible();
    await expect(page.getByText(/\$\d+\.\d{2}/).first()).toBeVisible();
  });
});
