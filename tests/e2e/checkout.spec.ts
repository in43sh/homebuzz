import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The checkout page and order confirmation (docs/audits/redesign_research.md,
// step 5). Signs in as the seeded demo customer. The happy-path test really
// places an order, so it leaves one order behind and takes one unit of stock
// from the first catalog product; `npm run db:seed` resets both.

async function signIn(page: Page) {
  await page.goto("/signin");
  await page.getByLabel("Email").fill("demo@homebuzz.test");
  await page.getByLabel("Password").fill("password1234");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/account$/);
}

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

async function fillAddress(page: Page) {
  await page.getByLabel("Full name").fill("Alex Rivera");
  await page.getByLabel("Street address").fill("123 Main St");
  await page.getByLabel("Apartment, suite, etc. (optional)").fill("Apt 4B");
  await page.getByLabel("City").fill("Austin");
  await page.getByLabel("State").selectOption("TX");
  await page.getByLabel("ZIP code").fill("78701");
}

test.describe("checkout", () => {
  test.afterEach(async ({ page }) => {
    await clearCartIfAny(page);
  });

  test("an empty cart sends the shopper back to the cart", async ({ page }) => {
    await signIn(page);
    await clearCartIfAny(page);
    await page.goto("/checkout");

    await expect(page).toHaveURL(/\/cart$/);
  });

  test("submitting an empty form announces what is wrong and focuses the first problem", async ({
    page,
  }) => {
    await signIn(page);
    await addFirstProduct(page);
    await page.goto("/checkout");
    await page.getByLabel("Full name").fill("");

    await page.getByRole("button", { name: "Place order" }).click();

    await expect(page.getByRole("alert").first()).toContainText(
      "need your attention",
    );
    await expect(page.locator("#name-error")).toHaveText(
      "Enter the recipient's full name",
    );
    await expect(page.locator("#zip-error")).toHaveText(
      "Enter a 5-digit ZIP code, like 78701",
    );
    await expect(page.getByLabel("Full name")).toBeFocused();
    await expect(page.getByLabel("Full name")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(page).toHaveURL(/\/checkout$/);
  });

  test("choosing Express adds its price to the total", async ({ page }) => {
    await signIn(page);
    await addFirstProduct(page);
    await page.goto("/checkout");
    const shipping = page.locator("dl > div", { hasText: "Shipping" });

    await expect(shipping).toContainText("Free");

    await page.getByLabel(/Express/).check();

    await expect(shipping).toContainText("$12.99");
  });

  test("placing an order shows a confirmation with the address and totals, and empties the cart", async ({
    page,
  }) => {
    await signIn(page);
    await addFirstProduct(page);
    await page.goto("/checkout");
    await fillAddress(page);
    await page.getByLabel(/Express/).check();

    await page.getByRole("button", { name: "Place order" }).click();

    await expect(page).toHaveURL(/\/account\/orders\/\d+\?placed=1$/);
    await expect(page.getByRole("status").first()).toContainText(
      "Your order is placed",
    );
    const address = page.locator("address");
    await expect(address).toContainText("Alex Rivera");
    await expect(address).toContainText("123 Main St");
    await expect(address).toContainText("Apt 4B");
    await expect(address).toContainText("Austin, TX 78701");
    await expect(page.getByText("Express delivery")).toBeVisible();
    await expect(page.locator("dl > div", { hasText: "Shipping" })).toContainText(
      "$12.99",
    );

    // The order is stored as placed; reloading without the flag drops the
    // banner but keeps every detail.
    await page.goto(page.url().replace("?placed=1", ""));
    await expect(page.getByText("Your order is placed")).toHaveCount(0);
    await expect(page.locator("address")).toContainText("Alex Rivera");

    await page.goto("/cart");
    await expect(
      page.getByRole("heading", { name: "Your cart is empty" }),
    ).toBeVisible();
  });

  for (const [label, size] of [
    ["desktop", { width: 1280, height: 800 }],
    ["mobile", { width: 375, height: 800 }],
  ] as const) {
    test(`has no accessibility violations at ${label} width`, async ({ page }) => {
      await page.setViewportSize(size);
      await signIn(page);
      await addFirstProduct(page);
      await page.goto("/checkout");
      await expect(
        page.getByRole("heading", { name: "Shipping address" }),
      ).toBeVisible();

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(
        results.violations.map((v) => `${v.id}: ${v.help}`),
      ).toEqual([]);
    });
  }

  test("does not scroll sideways on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await signIn(page);
    await addFirstProduct(page);
    await page.goto("/checkout");
    await expect(
      page.getByRole("heading", { name: "Shipping address" }),
    ).toBeVisible();

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
