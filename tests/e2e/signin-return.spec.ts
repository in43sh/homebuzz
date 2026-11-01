import { test, expect, type Page } from "@playwright/test";

// The sign-in return path from the checkout research (finding CK-05). Signing in
// as the seeded demo customer merges the guest cart into theirs, so every test
// empties the cart afterwards (see afterEach). No test places
// an order.

/** Adds the first catalog product and returns its title. */
async function addFirstProduct(page: Page): Promise<string> {
  await page.goto("/store");
  const card = page.locator("article").first();
  const title = (await card.getByRole("img").getAttribute("alt")) ?? "";
  const addButton = card.getByRole("button");
  await addButton.click();
  await expect(addButton).toHaveText(/Added/);
  return title;
}

async function clearCartIfAny(page: Page) {
  await page.goto("/cart");
  const clear = page.getByRole("button", { name: "Clear cart" });
  if (await clear.isVisible()) {
    page.once("dialog", (dialog) => dialog.accept());
    await clear.click();
    await expect(
      page.getByRole("heading", { name: "Your cart is empty" }),
    ).toBeVisible();
  }
}

test.describe("sign-in return path", () => {
  // Runs even when a test fails, so a failure cannot leave items in the demo
  // customer's cart and break the next run.
  test.afterEach(async ({ page }) => {
    await clearCartIfAny(page);
  });

  test("a guest who clicks Checkout is told why and returns to the cart after signing in", async ({
    page,
  }) => {
    const title = await addFirstProduct(page);
    await page.goto("/cart");
    await page.getByRole("button", { name: "Checkout" }).click();

    await expect(page).toHaveURL(/\/signin\?next=%2Fcart&reason=checkout/);
    await expect(
      page.getByText("Sign in to place your order. Your cart is saved."),
    ).toBeVisible();

    await page.getByLabel("Email").fill("demo@homebuzz.test");
    await page.getByLabel("Password").fill("password1234");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Back at the cart, not the account page, with the item still there.
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole("link", { name: title }).first()).toBeVisible();
  });

  test("the create-account link keeps the return address", async ({ page }) => {
    await page.goto("/signin?next=%2Fcart&reason=checkout");

    await expect(page.getByRole("link", { name: "Create one" })).toHaveAttribute(
      "href",
      "/signup?next=%2Fcart&reason=checkout",
    );
  });

  test("a return address pointing at another site is ignored", async ({ page }) => {
    await page.goto("/signin?next=https%3A%2F%2Fevil.example");
    await page.getByLabel("Email").fill("demo@homebuzz.test");
    await page.getByLabel("Password").fill("password1234");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/account$/);
  });

  test("opening your account while signed out returns you there after sign-in", async ({
    page,
  }) => {
    await page.goto("/account");

    await expect(page).toHaveURL(/\/signin\?next=%2Faccount/);
  });
});

test.describe("product page", () => {
  test("has no misleading Buy now button", async ({ page }) => {
    await page.goto("/product/glidden-premium-interior-paint-1");

    await expect(page.getByRole("button", { name: "Add to cart" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Buy now" })).toHaveCount(0);
  });
});
