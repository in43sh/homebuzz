# Base Hardware — Roadmap

> **Living document.** Updated as work ships. For the original architecture decisions and scope rationale, see [plan_original.md](plan_original.md). For how the current system works, see [technical_guide.md](technical_guide.md).

---

## What's shipped

All three planned slices are complete as of 2026-06-19.

| Slice | Scope | Status |
| ----- | ----- | ------ |
| 1 | Home, catalog browse, PDP, privacy, error pages, DB-backed products | Done |
| 2 | Auth (sign up / sign in), server-side cart with guest→user merge, search, filter, pagination, account page | Done |
| 3 | Checkout → orders, order history, reviews (purchase-gated), admin product CRUD | Done |

Also shipped alongside slices: Vitest unit tests, Playwright E2E, stock enforcement at checkout, quantity guards, re-runnable seed, responsive mobile nav, system graph, full docs suite. Renamed from Homebuzz to Base Hardware on 2026-10-31, with a new favicon (see [naming_research.md](naming_research.md) for how the name was chosen).

---

## Not yet done

### Must-have before production

- [ ] **Deploy to Vercel + Neon** — project is not yet deployed; env vars, domain (`basehardware.store`), and Vercel project setup needed. Milestone 1
- [ ] **Payments (Stripe)** — checkout currently creates an order with no payment gate; Stripe hosted checkout or Elements needed before real money can move. Plan it together with the checkout redesign (Milestone 3): Stripe hosted checkout collects the shipping address itself
- [ ] **Email** — no transactional email at all; minimum: order confirmation and password reset (Resend or Postmark recommended)
- [ ] **Image uploads** — admin product form accepts a URL string; real uploads via Vercel Blob needed for production
- [ ] **Error tracking** — no Sentry or equivalent; add from Slice 2 per the original plan

### Quality / hardening

- [x] **Lighthouse audit** — measured 2026-07-05 (desktop, prod build): all pages ≥ 96 across perf / a11y / best-practices / SEO. One remaining a11y issue: `text-gray-500` fails WCAG AA contrast on light backgrounds. See [lighthouse_audit.md](audits/lighthouse_audit.md)
- [ ] **WCAG 2.1 AA pass** — the five known findings are fixed (Milestone 2, 2026-11-01); the broader keyboard-only pass is still part of the redesign research ([redesign_research_prompt.md](redesign_research_prompt.md))
- [x] **SEO metadata** — per-page `<title>` / `<meta description>`, site-wide OpenGraph/Twitter + dynamic OG image, `sitemap.xml`, `robots.txt`, JSON-LD `Product` schema on PDPs (set `NEXT_PUBLIC_SITE_URL` in prod for absolute URLs)
- [ ] **Rate limiting** — no rate limiting on auth or mutation endpoints
- [ ] **Structured logging + request IDs** — currently relies on Next.js default console output

### Nice-to-have (post-v1)

- [ ] **Password reset flow** — currently impossible without contacting an admin
- [ ] **OAuth sign-in** — Auth.js config already supports it; just needs provider credentials
- [ ] **Admin image upload UI** — replace URL field with drag-and-drop Blob upload
- [ ] **Pagination on admin product list** — currently loads all products
- [ ] **Search improvements** — current `ILIKE` is good enough for dev; `pg_trgm` or full-text index for production scale
- [ ] **Related products ("You Might Also Need")** — PDP section exists in Figma but not implemented; simple category-based query is enough for v1. The Stitch product-page mockup includes it (Milestone 5)
- [ ] **Storybook** — design-system components are not documented in isolation
- [ ] **Docker / local Postgres** — a `docker-compose.yml` running Postgres locally so contributors don't need a Neon account to develop. **Pros:** zero external dependencies for local dev, faster onboarding, works offline, no Neon free-tier limits during heavy seeding/testing. **Cons:** irrelevant for production (Vercel + Neon need no container); adds a Docker Desktop requirement; contributors still need `.env.local` wired correctly; local Postgres lacks Neon-specific features (branching, serverless scale-to-zero). Worth it if contributor onboarding becomes a pain point; not urgent while the team is small.

### Future experiments (learning)

This is a learning project. Once the production milestone is done, good candidates for rebuilding parts of the stack to explore different paradigms:

#### Backend / API

| Option | Why try it |
| ------ | ---------- |
| **Go + Chi + sqlc** | You have a Go backend in the old repo as a reference; sqlc generates type-safe DB code from raw SQL — very different from Drizzle's ORM approach |
| **Rust + Axum** | Steepest curve; forces deep thinking about types and ownership; most transferable systems knowledge |
| **Python + FastAPI** | Easiest pivot from JS; natural fit if ML/recommendations are ever added |

#### Frontend

| Option | Why try it |
| ------ | ---------- |
| **SvelteKit** | Least boilerplate in the JS ecosystem; reactivity without a virtual DOM; very different mental model from React |
| **Remix** | Similar to Next.js App Router but more explicit about loaders/actions; good for understanding what Next.js abstracts away |
| **Astro** | Islands architecture — teaches you to default to zero JS and add interactivity only where needed; natural fit for a catalog-heavy storefront |

#### Full-stack paradigm shifts

| Option | Why try it |
| ------ | ---------- |
| **Rails** | Convention-over-configuration taken to its logical extreme; shows you what Next.js and Drizzle borrowed; builds a working store in a day |
| **Laravel + Livewire** | Same idea as Rails but PHP; enormous ecosystem; Livewire delivers reactivity without writing a separate frontend |
| **Elixir + Phoenix LiveView** | Teaches concurrency and real-time (channels) without a separate WebSocket service; very different execution model |

**Suggested order:** Go API rewrite first (head start from the old repo), then SvelteKit for the frontend. Two different paradigms, both practical, covers compiled-typed-backend + lightweight-reactive-frontend.

### Explicitly out of scope (park, don't build)

Wishlists · multi-currency / i18n · promo/coupon codes · inventory reservation · a real shipping-rate calc & tax service (fixed demo values for shipping and tax are in scope for the checkout redesign, see Milestone 3) · product Q&A · recommendations engine · CMS for banners/tutorials · mobile app.

---

## Milestones

The plan from here, in order. Each milestone ships on its own. Small follow-ups that don't fit a milestone live in [backlog.md](backlog.md). Design references are the "Base Hardware" screens in the [Stitch project](https://stitch.withgoogle.com/projects/16265252575452222178).

### Milestone 1 — Go live

- [ ] Run the two open name checks from [naming_research.md](naming_research.md): the USPTO trademark search and the say-it-once test
- [ ] Register `basehardware.store`
- [ ] Create the Vercel project and Neon integration, and set the env vars
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://basehardware.store` so OpenGraph, canonical URLs, sitemap, and JSON-LD resolve to absolute production URLs (it falls back to `http://localhost:3000` in `lib/site.ts`)
- [ ] In Stitch, delete the three old Homebuzz screens and rename the project and the checkout screen

Done when: the site loads on `https://basehardware.store` and the sitemap and OpenGraph URLs use that domain.

### Milestone 2 — Accessibility fixes

The five open findings from [accessibility_audit.md](audits/accessibility_audit.md), already written up as items in [backlog.md](backlog.md): muted-text contrast, search-input focus outlines, focus-ring contrast, mobile drawer focus management, and the skip-to-content link. Do these before the redesign research so the research spends its effort on new problems.

Done when: the five backlog items are closed and the Lighthouse accessibility check no longer reports the muted-text contrast failure.

Status: **done 2026-11-01.** All five are fixed, plus two related findings (placeholder contrast and the duplicate "Close menu" label). Three more contrast failures on the home page surfaced during verification and are fixed too (hero text on gray, and the delivery banner heading on yellow). axe-core (WCAG 2.0/2.1 A and AA) reports no violations on 9 pages, and a keyboard walkthrough confirmed the skip link, the search focus ring, and the drawer (focus moves in, Tab stays inside, Escape restores focus). Four pages still list one "needs review" item for text over images, which automated tools cannot measure. Lighthouse was not re-run. Regression tests now protect the fixes: an axe scan of 9 pages, keyboard tests for the skip link, search ring, and drawer, and a unit test of the token contrast (see [testing.md](testing.md#accessibility-tests)).

### Milestone 3 — Checkout

Order placement used to be one server action from the cart: no address, delivery, or review step, and no payment. This milestone replaces that.

- [x] Run the checkout part of the redesign research ([redesign_research_prompt.md](redesign_research_prompt.md), limited to the checkout walkthrough, evaluation, and gap analysis), with the report at `docs/audits/redesign_research.md`. Record the current step count as the baseline
- [x] Decided 2026-11-01: a custom checkout page now, with Stripe added later as a payment step. Accounts stay required; fix the sign-in return path
- [x] Write an implementation plan from the research findings (the "Prioritized roadmap" in the research report)
- [x] Build the checkout page to the "Base Hardware - Checkout" Stitch screen: address, delivery method, order summary, place order (done 2026-11-02)
- [ ] Add Stripe payment (see "Must-have before production")
- [x] Add the order confirmation step (a banner on the order page after placing, done 2026-11-02; the confirmation email is Milestone 4)
- [x] Decided 2026-11-01: drop the "cancel within 1 hour" promise (cancellation does not exist). Regenerate the Stitch checkout screen without it

Scope decision: shipping and tax use fixed demo values (Standard free, Express $12.99, a fixed tax percentage), not a real rate or tax service.

Done when: the full flow (cart, checkout, payment, confirmation) has a passing e2e test, and the before/after step count is recorded in the research report.

Progress (2026-11-01): the small truthfulness fixes and the stock and error work are shipped, with tests (see "Decisions and progress" in [redesign_research.md](audits/redesign_research.md)). The sign-in return path is shipped and "Buy now" is removed.

Progress (2026-11-02): the checkout page is shipped. The cart's Checkout button now links to `/checkout`, which collects a shipping address and a delivery method and shows the order for review. Only "Place order" creates an order, and the order stores its subtotal, shipping, tax, total, delivery method and address as placed (migration `0001`). The order page shows a confirmation, the address and the stored totals. Still to build: Stripe payment, which will set `paid`.

### Milestone 4 — Production services

- [ ] **Email** — order confirmation (needs the Milestone 3 confirmation step) and password reset
- [ ] **Image uploads** — Vercel Blob for the admin product form
- [ ] **Error tracking** — Sentry

Details for each are under "Must-have before production".

### Milestone 5 — Catalog and product-page improvements

Candidates from the Stitch catalog and product-page screens. Check what already exists first (filter and pagination shipped in Slice 2), and let the redesign research decide which gaps matter.

- [ ] Catalog filters and sort: price range, customer rating, in stock only, on sale; sort by price, rating, and newest
- [x] Stock states: "Only N left" and out-of-stock handling on cards and the product page (done 2026-11-01, with the cart limits, as part of Milestone 3)
- [ ] Related products ("You Might Also Need") on the product page
- [ ] Reviews: sort order and a "Verified purchase" label (reviews are already purchase-gated)

### Later

The rest of the redesign research (home, account, admin), rate limiting, structured logging, the nice-to-haves, and the learning experiments above.
