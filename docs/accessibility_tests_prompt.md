# Implementation Prompt: Accessibility Regression Tests for Base Hardware

You are adding **automated accessibility regression tests** to Base Hardware, a
Next.js e-commerce store (App Router, Drizzle + Neon Postgres, NextAuth v5 beta,
Tailwind v4). Milestone 2 in [roadmap.md](roadmap.md) fixed the known WCAG 2.1
AA findings by hand on 2026-11-01. These tests exist so those fixes cannot
quietly regress. You may change test files, test config, and `docs/testing.md`.
You may **not** change application code, except as the rule in "If a test finds
a real violation" below allows.

## Mission

Add three kinds of tests, in this order of value:

1. **An axe-core scan** of nine pages that fails on any WCAG 2.0 or 2.1 A/AA
   violation
2. **Keyboard tests** for the three behaviors axe cannot see: the skip link, the
   search focus ring, and the mobile drawer
3. **A fast unit test** that checks the contrast of the design tokens in
   `app/globals.css`

The core rule: **a test must fail when the fix it protects is removed.** A test
that cannot fail is worse than no test. Prove each one with the mutation check
in "Verification".

## Ground rules

- Read `AGENTS.md` first and complete its two prerequisite phases (installed
  Next.js version, local docs in `node_modules/next/dist/docs/`) and its
  `.env.local` validation before running anything. If `DATABASE_URL`,
  `DATABASE_URL_UNPOOLED`, or `AUTH_SECRET` is missing, a placeholder, or
  malformed, stop and ask the owner.
- Orient with `graphify query "<question>"` before grepping raw files (repo rule
  in `CLAUDE.md`).
- The e2e tests need a seeded database. If `npm run db:seed` fails, stop and
  report the exact error. Never use `db:push`.
- Do not weaken a test to make it pass: no skipped rules, no widened selectors,
  no raised thresholds without a recorded reason.
- Do not add `waitForTimeout` sleeps. Use Playwright's auto-waiting assertions.
- Leave the work **uncommitted** and report. The owner commits.

## Read first

- `docs/testing.md`, `playwright.config.*`, `vitest.config.*`, and everything
  under `tests/`: match the existing conventions (file names, base URL, how the
  dev server starts, how the seed is used). This prompt deliberately does not
  guess them.
- [accessibility_audit.md](audits/accessibility_audit.md) and the Milestone 2
  status in [roadmap.md](roadmap.md): the findings these tests protect.
- `app/globals.css`, `components/blocks/MobileMenu.tsx`,
  `components/blocks/Header.tsx`, and `app/layout.tsx`: the code under test.
- Check whether `.github/workflows/` exists and whether CI runs the e2e suite.
  Report the answer. Do not add CI.

## Part 1 — The axe scan

- Add `@axe-core/playwright` as a dev dependency and record the installed
  version in your report.
- Create `tests/e2e/accessibility.spec.ts` with one test per page, so a failure
  names the page:

| Page | Note |
| --- | --- |
| `/` | Includes the hero and the delivery banner |
| `/store` | |
| `/store/hardware` | A category page |
| `/product/glidden-premium-interior-paint-1` | Confirm the slug exists in the seed |
| `/cart` | Guest cart, empty state |
| `/help` | |
| `/privacy` | |
| `/signin` | |
| `/signup` | |

- Run axe with the tags `wcag2a`, `wcag2aa`, `wcag21a`, and `wcag21aa`. Fail on
  any violation.
- Write one helper that formats a failure readably: rule id, impact, the
  offending element's selector, and the help URL. A bare "expected 0, received 3"
  is not acceptable.
- Do **not** fail on axe's `incomplete` ("needs review") results. Four pages list
  one for text over images, which axe cannot measure. Attach the incomplete rule
  ids to the test output so they stay visible.
- Run the scan at a desktop viewport (1280 wide). Run the home page and the
  product page again at 375 wide.

## Part 2 — Keyboard tests

Add `tests/e2e/keyboard.spec.ts`. Use real key presses
(`page.keyboard.press`), never synthetic events or `element.focus()`, because the
point is to test the real focus order.

| Test | Viewport | Steps | Must assert |
| --- | --- | --- | --- |
| Skip link | 1280 | Go to `/`, press Tab | The focused element is the link named "Skip to main content" and is visible. Press Enter: the URL hash is `#main-content` and `#main-content` has focus |
| Search focus ring | 1280 | Press Tab until the "Search products" field is focused | The field's `box-shadow` contains the brand yellow `rgb(255, 206, 58)`, and its outline is not the only indicator |
| Drawer opens | 375 | Tab to "Open menu", press Enter | A dialog named "Menu" is visible, has `aria-modal="true"`, and the focused element is "Close menu" |
| Drawer traps focus | 375 | With the drawer open, press Shift+Tab, then Tab | Shift+Tab from the first control moves to the last control in the dialog, and Tab from the last returns to "Close menu". Focus never leaves the dialog |
| Drawer closes | 375 | Press Escape | The dialog is gone, and focus is back on "Open menu" |

Use role-based locators (`getByRole('dialog', { name: 'Menu' })`) so the tests
also check the accessible names.

## Part 3 — The token contrast unit test

Add `tests/unit/contrast.test.ts` (Vitest, no browser, no database).

- Read `app/globals.css` and parse the `--color-*` custom properties inside
  `@theme`. **Fail loudly if a token is missing**, so the test cannot pass by
  checking nothing.
- Implement the WCAG relative-luminance formula in a small helper. Do not add a
  dependency for it.
- Assert these pairs, with the threshold and the value measured on 2026-11-01:

| Foreground | Background | Threshold | Measured | Protects |
| --- | --- | --- | --- | --- |
| `gray-500` | `white` | 4.5 | 4.83 | Muted text on light pages |
| `gray-400` | `ink-900` | 4.5 | 5.15 | Footer text |
| `slate-700` | `gray-200` | 4.5 | 7.8 | Home hero text |
| `ink-900` | `brand` | 4.5 | 11.3 | Buttons, banner heading |
| `ink-900` | `white` | 3 | 16.8 | Focus ring on light surfaces |
| `brand` | `slate-700` | 3 | 7.7 | Focus ring on the header and drawer |

## If a test finds a real violation

Stop and report it. Do not loosen the test. You may fix it only if the fix is a
small class or token change in the same pattern as Milestone 2 (for example,
changing a text color class), and you record it in your report. Otherwise add a
line to `docs/backlog.md` and mark the test `test.fixme` with a comment linking
that backlog item, so the gap stays visible. Never leave a failing test in the
suite.

## Verification

### Run the suites

`npm run lint`, `npm test`, and `npm run test:e2e` all pass. Report the exact
test counts before and after.

### Mutation check

Do this on a **clean working tree**. For each change below, confirm the named
test fails, then restore the file with `git checkout -- <file>`. Never run these
on a tree with other uncommitted changes, because the restore would discard
them. Commit or stash your new tests first.

| Temporary change | Test that must fail |
| --- | --- |
| In `app/page.tsx`, change `text-slate-700` back to `text-gray-500` on the hero | The axe scan for `/` |
| In `app/globals.css`, set `--color-gray-500` to `#879095` | The unit test |
| In `components/blocks/MobileMenu.tsx`, remove `role="dialog"` | "Drawer opens" |
| In `components/blocks/MobileMenu.tsx`, remove the `trigger?.focus()` line | "Drawer closes" |
| In `app/layout.tsx`, remove the skip link | "Skip link" |
| In `components/blocks/Header.tsx`, remove `focus-visible:ring-brand` | "Search focus ring" |

### Check for flakiness

Run the e2e suite twice in a row. Any test that fails once and passes once is
flaky: fix it or remove it, but do not retry it silently.

## Deliverables

- The three test files, the dev dependency, and any config change they need
- A new "Accessibility tests" section in `docs/testing.md`: what is covered, what
  is not (screen-reader wording, reading order, text over images), and the
  command to run them
- One sentence added to the Milestone 2 status in [roadmap.md](roadmap.md)
  saying regression tests now protect the fixes
- A report with: test counts before and after, the axe version, the mutation
  results (one line per mutation), the CI answer, any violation found, and
  anything you could not run

Quality bar:

- Every test name says what it protects, for example "skip link is first in tab
  order and targets main"
- Every new Markdown file or section passes `npx markdownlint-cli2` with zero
  issues
- The suite stays fast: the axe scan and keyboard tests together should add
  under a minute to `npm run test:e2e`; report the actual figure
