# Homebuzz — Testing Guide

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

**What's covered (19 tests, 3 files):**

| File | Tests |
| ---- | ----- |
| `categories.test.ts` | `slugify()` — lowercasing, `&` expansion, edge-trimming, idempotency; seed categories list length + unique slugs |
| `utils.test.ts` | `formatPrice()` — whole dollars, decimals, rounding; `cn()` — conditional classes, Tailwind conflict resolution |
| `validation.test.ts` | All Zod schemas: `signInSchema`, `signUpSchema`, `reviewSchema`, `productSchema` (including the local-path rule for `image`) |

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

**Location:** `tests/e2e/shop.spec.ts`

**Config:** [playwright.config.ts](../playwright.config.ts) — Chromium only, fully serial (`fullyParallel: false`), zero retries, auto-starts `npm run dev` on `localhost:3000` (`reuseExistingServer: true`).

**What's covered (3 tests):**

| Test | What it checks |
| ---- | -------------- |
| Browse catalog | Home page loads; "Popular Products" section is visible |
| Search | `/store?q=drill` returns at least one product card |
| Add to cart | Add a product from the PDP; cart page shows a non-zero total |

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

## Coverage gaps (from TECHNICAL_GUIDE.md §9)

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
