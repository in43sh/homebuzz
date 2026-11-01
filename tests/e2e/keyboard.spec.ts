import { test, expect, type Locator, type Page } from "@playwright/test";

/**
 * Keyboard behavior that axe cannot check. These use real key presses, not
 * element.focus(), because the point is the real focus order.
 */

/** Presses Tab until `target` has focus, failing if it never does. */
async function tabTo(page: Page, target: Locator, maxPresses = 12) {
  for (let i = 0; i < maxPresses; i++) {
    if (await target.evaluate((el) => el === document.activeElement)) return;
    await page.keyboard.press("Tab");
  }
  await expect(target).toBeFocused();
}

test.describe("keyboard, desktop", () => {
  test("skip link is first in tab order and moves focus to main", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("header search field shows a yellow focus ring when tabbed to", async ({ page }) => {
    await page.goto("/");

    const search = page.getByRole("searchbox", { name: "Search products" });
    await tabTo(page, search);

    // The ring is a box-shadow (ring-brand = #ffce3a); outline is removed.
    await expect(search).toHaveCSS("box-shadow", /rgb\(255, 206, 58\)/);
  });
});

test.describe("keyboard, mobile drawer (375px)", () => {
  test.use({ viewport: { width: 375, height: 700 } });

  async function openDrawerWithKeyboard(page: Page) {
    await page.goto("/");
    const openButton = page.getByRole("button", { name: "Open menu" });
    await tabTo(page, openButton);
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    return { openButton, dialog };
  }

  test("drawer opens as a modal dialog and focuses Close menu", async ({ page }) => {
    const { dialog } = await openDrawerWithKeyboard(page);

    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog.getByRole("button", { name: "Close menu" })).toBeFocused();
  });

  test("drawer keeps Tab focus trapped inside the dialog", async ({ page }) => {
    const { dialog } = await openDrawerWithKeyboard(page);
    const close = dialog.getByRole("button", { name: "Close menu" });

    // Shift+Tab from the first control wraps to the last, and Tab wraps back.
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("link").last()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();

    // Focus never leaves the dialog, even after a full lap and more.
    const controls = await dialog.locator("a[href], button, input").count();
    for (let i = 0; i < controls + 2; i++) {
      await page.keyboard.press("Tab");
      const inside = await dialog.evaluate((d) => d.contains(document.activeElement));
      expect(inside, `focus left the dialog after ${i + 1} Tab presses`).toBe(true);
    }
  });

  test("Escape closes the drawer and returns focus to the menu button", async ({ page }) => {
    const { openButton, dialog } = await openDrawerWithKeyboard(page);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(openButton).toBeFocused();
  });
});
