# WCAG 2.1 AA Accessibility Audit

- **Date:** 2026-07-05
- **Scope:** Keyboard navigation, focus visibility, and color contrast (the "yellow-on-dark" concern from `docs/roadmap.md`).
- **Method:** Static review of design tokens (`app/globals.css`), shared UI (`components/ui/`), navigation blocks (`components/blocks/`), and page-level usage. Contrast ratios computed per the WCAG 2.1 relative-luminance formula.

---

## TL;DR

- ✅ **The "yellow-on-dark" worry is unfounded.** Brand yellow `#ffce3a` on the dark surfaces passes AAA (11.3:1 on `ink-900`, 7.7:1 on `slate-700`).
- ❌ **The real contrast failure is muted text on white:** `gray-500` (`#879095`) on white is **3.25:1** and fails AA (needs 4.5:1). It is used as body/label text across nearly every page.
- ❌ **Focus is invisible on the search inputs** (`focus:outline-none` with no replacement).
- ❌ **The yellow focus ring on light backgrounds is 1.49:1**, failing the 3:1 non-text-contrast requirement for focus indicators.
- ⚠️ **The mobile drawer has no focus trap / focus management** and lacks a skip-to-content link.

Priority order to fix: **P1** contrast of `gray-500` → **P1** restore focus outlines → **P2** focus-ring contrast → **P2** drawer focus management + skip link.

---

## 1. Color contrast

### Token luminance reference

| Token | Hex | Rel. luminance |
| --- | --- | --- |
| `brand` (yellow) | `#ffce3a` | 0.657 |
| `white` | `#ffffff` | 1.000 |
| `gray-200` | `#cfd7dc` | 0.670 |
| `gray-500` | `#879095` | 0.273 |
| `slate-700` | `#353b3e` | 0.042 |
| `ink-900` | `#1b1e1f` | 0.013 |

### Results

| Foreground | Background | Ratio | Normal text (4.5) | Large text (3.0) | Where |
| --- | --- | ---: | :---: | :---: | --- |
| `brand` | `ink-900` | **11.3:1** | ✅ AAA | ✅ | Category strip labels, footer wordmark |
| `brand` | `slate-700` | **7.7:1** | ✅ AAA | ✅ | Header wordmark, hover states, promo banner |
| `white` | `slate-700` | **11.4:1** | ✅ AAA | ✅ | Header text |
| `gray-200` | `ink-900` | **11.5:1** | ✅ AAA | ✅ | Desktop category nav, footer links |
| `gray-500` | `ink-900` | **5.2:1** | ✅ AA | ✅ | Footer tagline & copyright |
| `ink-900` | `brand` | **11.3:1** | ✅ AAA | ✅ | Default buttons, badges, cart count |
| **`gray-500`** | **`white`** | **3.25:1** | ❌ **FAIL** | ✅ (only if large) | **See below — widespread** |
| `gray-500` placeholder | `white` | 3.25:1 | ⚠️ advisory | — | Search & form inputs |

### ❌ P1 — `gray-500` muted text on white fails AA (1.4.3 Contrast Minimum)

`text-gray-500` on the default white background yields **3.25:1**. It passes only for *large* text (≥ 24px, or ≥ 18.66px bold). Most usages are `text-sm` / `text-xs` and are therefore **non-conformant**. Representative occurrences (grep `text-gray-500`):

- `app/product/[slug]/page.tsx:127` — product **description** (primary content)
- `app/product/[slug]/page.tsx:145,156,166,175` — reviews / empty states
- `app/cart/page.tsx:26,41,77,99,103` — cart labels & subtotal rows
- `app/account/page.tsx:40,44,49,61,80` — profile field labels
- `app/store/page.tsx:32`, `app/store/[category]/page.tsx:47` — result counts
- `components/store/ProductGrid.tsx:7`, `ProductCard.tsx:28`, `PricePer.tsx:18`, `CategorySidebar.tsx:9`, `Stars.tsx:40`
- `components/cart/CartControls.tsx:49,76,81`, `components/auth/AuthForm.tsx:132`
- `app/help/page.tsx:28`, `app/privacy/page.tsx:11`, `app/page.tsx:17,23`

**Fix:** Darken the muted token. A value around `#6b7378` reaches ~4.5:1 on white while staying in the same family; `#5f676b` gives comfortable margin (~5.1:1). Because it is a single `@theme` token in `app/globals.css`, one edit fixes every call site. Verify it still passes on `ink-900` afterward (it will — darker foreground vs. dark bg drops, so re-check: prefer keeping the footer's muted text as an explicit lighter token if needed).

> Note: on `ink-900` the *current* `gray-500` passes (5.2:1). If you darken the shared token, the footer tagline/copyright contrast will drop — split into a light-surface muted token vs. a dark-surface muted token, or switch the footer muted text to `gray-200`.

---

## 2. Focus visibility (2.4.7 Focus Visible, 1.4.11 Non-text Contrast)

### ❌ P1 — Search inputs remove the focus indicator entirely

Both search fields strip the outline with no replacement:

- `components/blocks/Header.tsx:32` — `...focus:outline-none` (no ring/border added)
- `components/blocks/MobileMenu.tsx:82` — same pattern

A keyboard user tabbing to the search box gets **no visible focus**. **Fix:** add a visible focus style, e.g. `focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset` (inset works well since the field sits on a dark header) or a `focus-visible:border-brand` on a bordered field.

### ❌ P2 — Yellow focus ring is too low-contrast on light backgrounds

Shared components signal focus with the brand yellow ring:

- `components/ui/Button.tsx:8` — `focus-visible:ring-brand ... ring-offset-2`
- `components/ui/Input.tsx:10` — `focus-visible:ring-brand/40` (40% opacity — even weaker)

Brand yellow vs. white page = **1.49:1**, and the `/40` variant is lower still. WCAG **1.4.11** requires a **3:1** focus indicator against adjacent colors. On dark surfaces the ring is fine; on the many white pages it is effectively invisible.

**Fix options:**

- Use a darker ring on light surfaces (`focus-visible:ring-ink-900`, ~contrast to white is very high), or
- Add a dark ring-offset/second ring so the *edge* meeting white has ≥3:1, or
- Keep brand but pair it with a solid `ring-offset-color` and an outer `ring-ink-900`.
- For `Input`, drop the `/40` opacity — use a full-strength ring or a 2px `border-ink-900`.

Also note `ring-offset-2` has **no `ring-offset-color` set**, so it defaults to white; confirm intended per surface.

---

## 3. Keyboard navigation

### ✅ Working well

- All interactive elements are real semantic controls — no `div`/`span` click handlers acting as buttons (verified: zero `onClick` on non-interactive elements).
- Hamburger is a `<button>` with `aria-label="Open menu"` and `aria-expanded` (`MobileMenu.tsx:24-27`).
- Drawer backdrop is a focusable `<button aria-label="Close menu">`, and **Escape closes the drawer** (`MobileMenu.tsx:13`).
- Sign-out is a real submit `<button>`; search forms use `role="search"` + `aria-label`.
- A `<main>` landmark exists (`app/layout.tsx:49`); nav regions are labeled (`aria-label="Categories"`, footer column labels).
- `Stars` provides an `sr-only` text alternative for the rating (`components/store/Stars.tsx:38`).

### ⚠️ P2 — Mobile drawer lacks focus management (2.4.3 Focus Order, 4.1.2)

`components/blocks/MobileMenu.tsx` opens a drawer but:

1. **Focus is not moved into the drawer** when it opens — keyboard focus stays on the (now hidden-behind-overlay) trigger.
2. **No focus trap** — Tab can leave the drawer and land on page content behind the backdrop.
3. **Focus is not restored** to the hamburger button on close.
4. The drawer container is a plain `<div>` — no `role="dialog"` / `aria-modal="true"` / labelling.

**Fix:** on open, move focus to the close button (or first focusable); trap Tab within the drawer; on close, return focus to the trigger; add `role="dialog" aria-modal="true" aria-label="Menu"`. A small `useEffect` or a headless dialog primitive covers all four.

### ⚠️ P2 — No skip-to-content link (2.4.1 Bypass Blocks, Level A)

The header renders a search form + full category strip before `<main>`. Keyboard users must tab through all of it on every page. **Fix:** add a visually-hidden-until-focused skip link as the first child of `<body>` in `app/layout.tsx`, targeting `<main id="main-content">`.

### ⚠️ P3 — Duplicate control label

The backdrop button and the X button both use `aria-label="Close menu"` (`MobileMenu.tsx:45,61`). Harmless but consider `aria-label="Close menu overlay"` on the backdrop to disambiguate for screen-reader users navigating by controls.

---

## 4. Summary table

| # | Finding | WCAG | Level | Priority | Location |
| --- | --- | --- | --- | --- | --- |
| 1 | `gray-500` muted text on white = 3.25:1 | 1.4.3 | AA | **P1** | `globals.css` token; site-wide |
| 2 | Search inputs remove focus outline | 2.4.7 | AA | **P1** | `Header.tsx:32`, `MobileMenu.tsx:82` |
| 3 | Yellow focus ring < 3:1 on white | 1.4.11 | AA | **P2** | `Button.tsx:8`, `Input.tsx:10` |
| 4 | Drawer: no focus trap / move / restore / dialog role | 2.4.3, 4.1.2 | A/AA | **P2** | `MobileMenu.tsx` |
| 5 | No skip-to-content link | 2.4.1 | A | **P2** | `app/layout.tsx` |
| 6 | Placeholder text 3.25:1 | 1.4.3 | AA | P3 | search/form inputs |
| 7 | Duplicate "Close menu" label | 2.4.6 | AA | P3 | `MobileMenu.tsx:45,61` |
| — | Yellow-on-dark contrast | 1.4.3 | AA | ✅ Pass | header/footer/nav |

---

## Recommended next steps

1. **P1:** Split the muted-gray token — darken the on-white value to ≥ 4.5:1 (`~#6b7378`) and keep/promote a lighter token for dark surfaces. Single-file change in `app/globals.css`, re-verify the footer.
2. **P1:** Give both search inputs a visible `focus-visible` style.
3. **P2:** Make the focus ring meet 3:1 on light backgrounds; drop the `/40` opacity on `Input`.
4. **P2:** Add drawer focus management + `role="dialog"`, and a skip-to-content link in the layout.
5. Re-verify with an automated pass (axe / Lighthouse) and manual keyboard walkthrough after fixes.

> These findings are from static analysis. Recommend a follow-up manual keyboard + screen-reader (VoiceOver) pass and an automated axe-core run once the P1/P2 fixes land, before marking the roadmap item complete.
