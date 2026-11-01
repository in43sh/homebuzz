import { test, expect } from "@playwright/test";

// Form guidance from the checkout research (finding CK-15).

test.describe("auth forms", () => {
  test("sign-up states the password rule before the user submits", async ({
    page,
  }) => {
    await page.goto("/signup");

    await expect(page.getByText("At least 8 characters.")).toBeVisible();
  });

  test("sign-in does not show the sign-up password rule", async ({ page }) => {
    await page.goto("/signin");

    await expect(page.getByText("At least 8 characters.")).toHaveCount(0);
  });
});
