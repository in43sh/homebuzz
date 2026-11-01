import { test, expect, type Page, type TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// WCAG 2.0 and 2.1, levels A and AA: the conformance target in
// docs/audits/accessibility_audit.md.
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

const PAGES = [
  { name: "home", path: "/" },
  { name: "catalog", path: "/store" },
  { name: "category", path: "/store/hardware" },
  // Slug is `${slugify(title)}-${index + 1}` from lib/mock-products.ts, so it is
  // stable across reseeds.
  { name: "product", path: "/product/glidden-premium-interior-paint-1" },
  { name: "guest cart", path: "/cart" },
  { name: "help", path: "/help" },
  { name: "privacy", path: "/privacy" },
  { name: "sign in", path: "/signin" },
  { name: "sign up", path: "/signup" },
];

/** Runs axe and returns one readable string per violation (empty when clean). */
async function violationsOn(page: Page, path: string, testInfo: TestInfo) {
  await page.goto(path);
  await expect(page.locator("main")).toBeVisible();

  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

  // "Needs review" items (for example text over images) cannot be decided by
  // axe. Keep them visible in the report without failing the test.
  if (results.incomplete.length > 0) {
    await testInfo.attach("axe-needs-review", {
      body: results.incomplete
        .map((r) => `${r.id}: ${r.nodes.length} element(s)`)
        .join("\n"),
      contentType: "text/plain",
    });
  }

  return results.violations.map((v) => {
    const where = v.nodes
      .slice(0, 5)
      .map((n) => {
        // Contrast failures carry the measured colors; show them.
        const d = n.any[0]?.data as
          | { fgColor?: string; bgColor?: string; contrastRatio?: number }
          | undefined;
        const colors = d?.contrastRatio
          ? `  [${d.fgColor} on ${d.bgColor} = ${d.contrastRatio}:1]`
          : "";
        return `    ${n.target.join(" ")}${colors}`;
      })
      .join("\n");
    return `${v.id} (${v.impact}): ${v.help}\n  ${v.helpUrl}\n${where}`;
  });
}

test.describe("axe scan, desktop", () => {
  for (const { name, path } of PAGES) {
    test(`${name} page has no WCAG 2.1 A/AA violations`, async ({ page }, testInfo) => {
      expect(await violationsOn(page, path, testInfo)).toEqual([]);
    });
  }
});

test.describe("axe scan, mobile (375px)", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  for (const { name, path } of PAGES.filter((p) =>
    ["home", "product"].includes(p.name),
  )) {
    test(`${name} page has no WCAG 2.1 A/AA violations at phone width`, async ({ page }, testInfo) => {
      expect(await violationsOn(page, path, testInfo)).toEqual([]);
    });
  }
});
