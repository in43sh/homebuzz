# Homebuzz — Roadmap

> **Living document.** Updated as work ships. For the original architecture decisions and scope rationale, see [PLAN_ORIGINAL.md](PLAN_ORIGINAL.md). For how the current system works, see [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md).

---

## What's shipped

All three planned slices are complete as of 2026-06-19.

| Slice | Scope | Status |
| ----- | ----- | ------ |
| 1 | Home, catalog browse, PDP, privacy, error pages, DB-backed products | Done |
| 2 | Auth (sign up / sign in), server-side cart with guest→user merge, search, filter, pagination, account page | Done |
| 3 | Checkout → orders, order history, reviews (purchase-gated), admin product CRUD | Done |

Also shipped alongside slices: Vitest unit tests, Playwright E2E, stock enforcement at checkout, quantity guards, re-runnable seed, responsive mobile nav, system graph, full docs suite.

---

## Not yet done

### Must-have before production

- [ ] **Deploy to Vercel + Neon** — project is not yet deployed; env vars, domain, and Vercel project setup needed
- [ ] **Payments (Stripe)** — checkout currently creates an order with no payment gate; Stripe hosted checkout or Elements needed before real money can move
- [ ] **Email** — no transactional email at all; minimum: order confirmation and password reset (Resend or Postmark recommended)
- [ ] **Image uploads** — admin product form accepts a URL string; real uploads via Vercel Blob needed for production
- [ ] **Error tracking** — no Sentry or equivalent; add from Slice 2 per the original plan

### Quality / hardening

- [ ] **Lighthouse audit** — target ≥ 90 perf / SEO / a11y; not yet measured
- [ ] **WCAG 2.1 AA pass** — keyboard nav, focus styles, color-contrast check on yellow-on-dark
- [ ] **SEO metadata** — per-page `<title>` / `<meta description>`, OpenGraph, `sitemap.xml`, JSON-LD `Product` schema on PDPs
- [ ] **Rate limiting** — no rate limiting on auth or mutation endpoints
- [ ] **Structured logging + request IDs** — currently relies on Next.js default console output

### Nice-to-have (post-v1)

- [ ] **Password reset flow** — currently impossible without contacting an admin
- [ ] **OAuth sign-in** — Auth.js config already supports it; just needs provider credentials
- [ ] **Admin image upload UI** — replace URL field with drag-and-drop Blob upload
- [ ] **Pagination on admin product list** — currently loads all products
- [ ] **Search improvements** — current `ILIKE` is good enough for dev; `pg_trgm` or full-text index for production scale
- [ ] **Related products ("You Might Also Need")** — PDP section exists in Figma but not implemented; simple category-based query is enough for v1
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

Wishlists · multi-currency / i18n · promo/coupon codes · inventory reservation · shipping-rate calc & tax service · product Q&A · recommendations engine · CMS for banners/tutorials · mobile app.

---

## Suggested next milestone

**Get to a real production deploy.** The order is:

1. Vercel project + Neon integration + env vars
2. Stripe checkout (at minimum a "pay now" redirect to Stripe hosted checkout)
3. Resend/Postmark for order confirmation email
4. Vercel Blob for admin image uploads
5. Sentry for error tracking
6. Lighthouse + a11y pass
7. SEO metadata + sitemap
