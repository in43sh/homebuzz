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
- [ ] **WCAG 2.1 AA pass** — the five known findings are tracked in [backlog.md](backlog.md) (Milestone 2); the broader keyboard-only pass is part of the redesign research ([redesign_research_prompt.md](redesign_research_prompt.md))
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

### Milestone 3 — Checkout

Today, order placement is one server action from the cart (`placeOrderAction`): no address, delivery, or review step, and no payment. This milestone replaces that.

- [ ] Run the checkout part of the redesign research ([redesign_research_prompt.md](redesign_research_prompt.md), limited to the checkout walkthrough, evaluation, and gap analysis), with the report at `docs/audits/redesign_research.md`. Record the current step count as the baseline
- [ ] Decide Stripe hosted checkout vs. Elements before designing the form: hosted checkout collects the shipping address itself, so a custom address form may be unnecessary
- [ ] Write an implementation plan from the research findings
- [ ] Build the checkout page to the "Base Hardware - Checkout" Stitch screen: address, delivery method, order summary, place order
- [ ] Add Stripe payment (see "Must-have before production")
- [ ] Add the order confirmation step
- [ ] The mockup promises "cancel within 1 hour of placing your order": confirm whether order cancellation exists, then build it or drop the line from the design

Scope decision: shipping and tax use fixed demo values (Standard free, Express $12.99, a fixed tax percentage), not a real rate or tax service.

Done when: the full flow (cart, checkout, payment, confirmation) has a passing e2e test, and the before/after step count is recorded in the research report.

### Milestone 4 — Production services

- [ ] **Email** — order confirmation (needs the Milestone 3 confirmation step) and password reset
- [ ] **Image uploads** — Vercel Blob for the admin product form
- [ ] **Error tracking** — Sentry

Details for each are under "Must-have before production".

### Milestone 5 — Catalog and product-page improvements

Candidates from the Stitch catalog and product-page screens. Check what already exists first (filter and pagination shipped in Slice 2), and let the redesign research decide which gaps matter.

- [ ] Catalog filters and sort: price range, customer rating, in stock only, on sale; sort by price, rating, and newest
- [ ] Stock states: "Only N left" and out-of-stock handling on cards and the product page
- [ ] Related products ("You Might Also Need") on the product page
- [ ] Reviews: sort order and a "Verified purchase" label (reviews are already purchase-gated)

### Later

The rest of the redesign research (home, account, admin), rate limiting, structured logging, the nice-to-haves, and the learning experiments above.
