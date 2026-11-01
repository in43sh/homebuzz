# Base Hardware — Testing Guide

How the test suite is structured, how to run it, and how to add to it.

---

## Running the tests

```bash
# Unit tests (fast, no server needed)
npm test

# Unit tests in watch mode
npm test -- --watch

# E2E tests (starts the dev server automatically)
npm run test:e2e

# E2E with the Playwright UI (shows a browser, useful for debugging)
npm run test:e2e -- --ui
```

---

## Unit tests — Vitest

**Location:** `tests/unit/`

**Config:** [vitest.config.ts](../vitest.config.ts) — runs in `node` environment, resolves `@/` path aliases via `tsconfigPaths`.

**What's covered (37 tests, 5 files):**

| File | Tests |
| ---- | ----- |
| `categories.test.ts` | `slugify()` — lowercasing, `&` expansion, edge-trimming, idempotency; seed categories list length + unique slugs |
| `utils.test.ts` | `formatPrice()` — whole dollars, decimals, rounding; `cn()` — conditional classes, Tailwind conflict resolution |
| `validation.test.ts` | All Zod schemas: `signInSchema`, `signUpSchema`, `reviewSchema`, `productSchema` (including the local-path rule for `image`) |
| `contrast.test.ts` | WCAG contrast of the design tokens in `app/globals.css` (6 color pairs), and a check that a missing token fails loudly |
| `stock.test.ts` | Stock rules in `lib/stock.ts`: status labels, clamping quantities to stock, the product page picker, and cart line problems |

### What unit tests cover here

Unit tests only cover **pure functions with no I/O** — no database, no cookies, no network. This is intentional: the most useful things to unit-test (cart logic, checkout, auth) all require a real database to be meaningful. Mocking Drizzle would let tests pass while hiding the same bugs that real integration tests would catch.

The corollary: if a function imports `db` from `@/db`, it belongs in an integration test (none yet), not a unit test.

### Adding a unit test

Drop a `*.test.ts` file anywhere under `tests/unit/`. Vitest picks it up automatically.

```ts
// tests/unit/my-module.test.ts
import { describe, it, expect } from "vitest";
import { myPureFunction } from "@/lib/my-module";

describe("myPureFunction", () => {
  it("does the thing", () => {
    expect(myPureFunction("input")).toBe("expected");
  });
});
```

The `@/` alias resolves to the project root, same as in the app. No setup file is needed for pure function tests.

---

## E2E tests — Playwright

**Location:** `tests/e2e/` (`shop.spec.ts`, `accessibility.spec.ts`, `keyboard.spec.ts`, `cart.spec.ts`, `auth-forms.spec.ts`, `stock-and-errors.spec.ts`)

**Config:** [playwright.config.ts](../playwright.config.ts) — Chromium only, fully serial (`fullyParallel: false`), zero retries, auto-starts `npm run dev` on `localhost:3000` (`reuseExistingServer: true`).

**What's covered (32 tests):**

| Test | What it checks |
| ---- | -------------- |
| Browse catalog | Home page loads; "Popular Products" section is visible |
| Search | `/store?q=drill` returns at least one product card |
| Add to cart | Add a product from the PDP; cart page shows a non-zero total |
| Axe scan (11 tests) | Nine pages at desktop width, plus home and product at 375px, have no WCAG 2.1 A/AA violations |
| Keyboard (5 tests) | Skip link, search focus ring, and the mobile drawer (opens, traps Tab, restores focus). See [Accessibility tests](#accessibility-tests) |
| Cart (5 tests) | Singular "1 item", "−" disabled at 1, "Clear cart" asks first, a customer-safe demo notice, and (at 375px) no sideways scroll and 44px controls |
| Auth forms (2 tests) | Sign-up states the password rule up front, and sign-in does not |
| Stock and errors (5 tests) | "In stock" and the 1–5 picker, a cart status line for screen readers, the branded 404, and announced, focus-managed form errors |

### What E2E tests are for

The Playwright suite is a smoke-level check that the app starts and the golden path works end to end. It hits a real running server (dev mode) with a real browser. It's not exhaustive — it's meant to catch "nothing boots" and "the cart is completely broken" before a deploy.

### Adding an E2E test

Add a new `it(...)` block to `tests/e2e/shop.spec.ts`, or a new spec file in `tests/e2e/`. The `webServer` block in `playwright.config.ts` handles starting the dev server.

```ts
import { test, expect } from "@playwright/test";

test("user can sign in", async ({ page }) => {
  await page.goto("/signin");
  await page.fill('input[name="email"]', "demo@homebuzz.test");
  await page.fill('input[name="password"]', "password1234");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/account");
});
```

The dev database must be seeded (`npm run db:seed`) before running E2E tests that touch auth, cart, or orders — the seed provides the two test accounts (`demo@homebuzz.test` / `admin@homebuzz.test`, password `password1234`).

---

## Accessibility tests

Added 2026-11-01 to protect the Milestone 2 fixes (see [roadmap.md](roadmap.md) and
[audits/accessibility_audit.md](audits/accessibility_audit.md)). Three layers, from
fastest to slowest:

| Layer | File | Catches |
| ----- | ---- | ------- |
| Token contrast | `tests/unit/contrast.test.ts` | A color token edit that drops contrast below WCAG (4.5:1 text, 3:1 focus rings) |
| Axe scan | `tests/e2e/accessibility.spec.ts` | Contrast, missing names, landmark, and ARIA problems on real rendered pages |
| Keyboard | `tests/e2e/keyboard.spec.ts` | Behavior axe cannot see: focus order, focus rings, the drawer's focus handling |

Run only these with `npm run test:e2e -- accessibility keyboard`.

**Reading a failure.** The axe test prints the rule, a help link, the element selector,
and for contrast failures the measured colors, for example
`[#879095 on #ffffff = 3.25:1]`.

**What is not covered:**

- Screen-reader wording, reading order, and zoom or reflow. These need manual checks
- Text over images. Axe lists these as "needs review" and the test attaches them to
  the report without failing, because automated tools cannot measure them
- Browsers other than Chromium, and pages behind sign-in (cart with items, account,
  admin)

**Troubleshooting: axe fails with old colors.** The tests run against the dev server,
and its Turbopack cache in `.next/dev` can serve stale CSS after a token change made
while no server was running. Symptom: contrast failures that show an old value (for
example `#879095` for `gray-500`) while `app/globals.css` is correct. Fix: stop the
dev server, delete `.next/dev` (a git-ignored cache), and rerun.

**Proving the tests can fail.** Each test was checked by temporarily undoing the fix it
protects (hero text back to `gray-500`, `gray-500` back to `#879095`, drawer
`role="dialog"` removed, drawer focus restore removed, skip link removed, search ring
color removed), confirming the matching test failed for the right reason, and
restoring the file. Clear `.next/dev` before each such run.

---

## Coverage gaps (from technical_guide.md §9)

These paths exist in code but have zero test coverage. They're the highest-value targets for new tests — each one has caught a real bug or edge case during development:

| Path | Type | What to test |
| ---- | ---- | ------------ |
| Sign in / sign up / session | E2E | Credentials flow; duplicate email rejection; redirect after login |
| Guest → user cart merge | E2E | Add as guest, sign in, verify items carry over |
| Checkout / `placeOrder` | E2E + integration | Happy path, out-of-stock rollback, unauthenticated redirect |
| Order history, ownership check | E2E | `/account/orders/:id` visible to owner, 404 for other user |
| Reviews + rating recompute | E2E | Purchase gate (non-buyer sees no form); submit updates star rating |
| Admin CRUD + `isAdmin` guard | E2E | Create/edit/delete product; non-admin redirected to `/` |
| `lib/cart.ts` — `resolveCartId`, `addItem`, merge | Integration | Requires a DB; test against a real Neon branch or local Postgres |

The cart and checkout logic in `lib/` is the most complex and most sensitive to regressions. Integration tests that hit a real database (a Neon dev branch works well) would give the most confidence there.
