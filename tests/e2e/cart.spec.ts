import { test, expect, type Page } from "@playwright/test";

// Cart behavior from the checkout research (docs/audits/redesign_research.md,
// findings CK-10, CK-11, CK-12). None of these tests place an order, so they
// leave no data behind in the database.

/** Adds the first catalog product and opens the cart (fresh cookies per test). */
async function openCartWithOneItem(page: Page) {
  await page.goto("/store");
  const addButton = page.locator("article").first().getByRole("button");
  await addButton.click();
  await expect(addButton).toHaveText(/Added/);

  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: "Shopping cart" }),
  ).toBeVisible();
}

test.describe("cart", () => {
  test("uses the singular for a single item", async ({ page }) => {
    await openCartWithOneItem(page);

    await expect(page.getByText("1 item", { exact: true })).toBeVisible();
    await expect(page.locator("main")).not.toContainText("1 items");
  });

  test("minus is disabled at quantity 1 so it cannot silently remove the item", async ({
    page,
  }) => {
    await openCartWithOneItem(page);
    const decrease = page.getByRole("button", { name: "Decrease quantity" });

    await expect(decrease).toBeDisabled();

    await page.getByRole("button", { name: "Increase quantity" }).click();
    await expect(decrease).toBeEnabled();
  });

  test("Clear cart asks first, keeps the cart when declined, and clears when confirmed", async ({
    page,
  }) => {
    await openCartWithOneItem(page);
    const clear = page.getByRole("button", { name: "Clear cart" });

    let message = "";
    page.once("dialog", (dialog) => {
      message = dialog.message();
      return dialog.dismiss();
    });
    await clear.click();
    expect(message).toMatch(/remove all items/i);
    await expect(
      page.getByRole("heading", { name: "Shopping cart" }),
    ).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await clear.click();
    await expect(
      page.getByRole("heading", { name: "Your cart is empty" }),
    ).toBeVisible();
  });

  test("shows a customer-safe demo notice, with no roadmap language", async ({
    page,
  }) => {
    await openCartWithOneItem(page);

    await expect(
      page.getByText("Demo store — no payment is taken."),
    ).toBeVisible();
    await expect(page.locator("main")).not.toContainText("Stripe");
  });
});

test.describe("cart on a phone (375px)", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test("the cart does not scroll sideways", async ({ page }) => {
    await openCartWithOneItem(page);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("every cart control is at least 44px tall", async ({ page }) => {
    await openCartWithOneItem(page);

    const controls = [
      page.getByRole("button", { name: "Decrease quantity" }),
      page.getByRole("button", { name: "Increase quantity" }),
      page.getByRole("button", { name: "Remove" }),
      page.getByRole("button", { name: "Clear cart" }),
    ];
    for (const control of controls) {
      const box = await control.boundingBox();
      expect(box, "control should be rendered").not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }

    // The quantity buttons should also be 44px wide.
    for (const name of ["Decrease quantity", "Increase quantity"]) {
      const box = await page.getByRole("button", { name }).boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(44);
    }
  });
});
