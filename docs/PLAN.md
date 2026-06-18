# Homebuzz — Rebuild Plan

> **Historical document.** This plan was written on 2026-06-04, before the rebuild started. The decisions it proposed have all been made and the project is now built. Read it for context on *why* things are the way they are, not as a guide to what to do next. For current architecture see [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md); for current status see the git log.

A from-scratch rebuild of **Homebuzz**, a home-improvement / hardware e-commerce store
(Home Depot–style). This document captures what existed at the time, the Figma design, and a
recommended path to a clean, best-practices implementation. Architecture and scope are
presented as **options** for you to choose.

- **Figma:** https://www.figma.com/design/XapEJYnL4l2NFiUIEspMCL/BuildStore_new--Copy-?node-id=2-7089&p=f&m=dev
- **Date:** 2026-06-04

## TL;DR

Three stale repos (CRA frontend, Go API, Vite frontend) → one clean build. Recommended:
**Next.js 16 + Drizzle + Neon + Auth.js on Vercel**, shipped as **Slice 2** (catalog +
cart + auth) for v1, then Slice 3 (checkout/orders/reviews/admin). Design + 9 screens
already in Figma; tokens and 15 categories extracted. **Two decisions unblock build:
architecture (§4) + scope (§5).** Defaults stand if you don't object.

---

## 1. What exists today

Three generations of the project live in `homebuzz-everything/`:

| Repo | Stack | State | Useful for |
|------|-------|-------|------------|
| `homebuzz` | CRA + Redux + SCSS + styled-components, React 19, react-router 5 | Original. Most **features**: auth (PrivateRoute, `axiosWithAuth`), cart/redux, reviews, search bar, contact form, mobile menu | Feature reference, UX flows |
| `homebuzz-backend` | Go 1.23 + Gin + Bun ORM + Postgres + JWT + Swagger | Current backend. Endpoints for auth + products | API reference, possible reuse |
| `homebuzz-frontend` | Vite + React 19 + TS + Tailwind 4 + react-router 7 | Newest frontend, WIP. Marketing pages only | Design-aligned starting point |

### Known weaknesses to fix in the rebuild

**Backend**
- Hardcoded JWT secret `"your_secret_key"` in source (`routes/user/user.go:28`).
- No auth middleware — `DELETE /users/:id`, product mutations are unprotected.
- No DB migrations / schema versioning.
- User model = `username` + `password` only. No email, roles, timestamps.
- Product model thin: `image, product_title, price, unit, rating`. No category,
  description, slug, stock, SKU, images[].
- No cart / orders / checkout endpoints.
- No pagination, filtering, sorting, search.
- No tests, no structured logging, no request validation layer beyond Gin bindings.
- Errors/responses inconsistent (mix of typed structs and `gin.H`).

**Frontend**
- Newest frontend has no API wiring, no auth, no cart, no state management.
- Old frontend has those features but on a dead stack (CRA, raw Redux, react-router 5).

---

## 2. The product (from Figma)

Home-improvement marketplace. Dark slate UI with a bold yellow accent, Inter Black
display type, large product imagery.

### Screens in the design

| Screen | Notes |
|--------|-------|
| **Home** (Index, Index2 variants) | Hero banner ("Furniture Week"), "2M+ items" strip, Popular Products grid, promo banners, "Inspire Yourself with Tutorials", "WE DELIVER" delivery banner, prefooter, footer |
| **Login / Sign up** (`main-login`) | Auth |
| **Store — Product list** | Catalog grid with category header nav |
| **Store — Product details** | PDP |
| **Cart** | Cart line items |
| **Account page** (2 variants) | User account |
| **Privacy** | Static content page |
| **404 / 405 / 406 / 407** | Error pages |

### Screen layouts (from Figma, key screens)

Shared chrome on every screen: dark top bar (logo, nav, search, account, cart) +
category nav strip · `delivery` "WE DELIVER" banner · `prefooter` · `footer`.

- **Store — Product list** (`Paint` example): sticky category nav; page title + search;
  **left filter sidebar** (brand / price / type facets); **4-col product grid** of
  `product-list-item` cards (image, stars, title, price/unit, yellow add-to-cart, "On
  Sale" badge); "Show more" pagination; promo banners (15% off, Financing) below grid.
- **Store — Product details (PDP)**: large product image + brand badge; title; price;
  **unit/variant selector + color swatches + quantity stepper + add-to-cart**;
  description; lifestyle image gallery (3); **Reviews** (star summary + list + load
  more); **"You Might Also Need"** related grid (4).
- **Cart**: title + item count; line-item **table** (image+title · price · quantity
  stepper · remove trash); summary (tax + total) + dark **Checkout** button.
- **Account** (2 variants): profile details + order history list.
- **Login / Sign up**: form using `inputs/small/text` (email, password) + primary
  button; sign-in ↔ sign-up toggle. (Renders over the home layout — treat as a
  dedicated route or modal.)
- **Home**: hero banner, 2M-items strip, Popular Products grid, promo banners, Tutorials.
- **Privacy / 404–407**: static content + error states.

### Design system (Figma component naming → maps cleanly to code components)

- `blocks/header/category-item` (+ hover) — top category nav
- `blocks/footer`, `blocs/prefooter`
- `blocks/delivery` — "WE DELIVER" banner
- `blocs/banner` — hero, with responsive variants **375 / 768 / 1280 / 1920**
- `blocs/promo`, `blocs/banner2..5`
- `blocks/store/product-list-item`, `blocks/store/price-per`, `blocks/stars`
- `buttons/regular/default`, `buttons/small/{default,outline,warning}`
- `inputs/small/text`
- `logos/black`

**Responsive breakpoints are baked into the design: 375, 768, 1280, 1920.**

### Categories (15, from `homebuzz-frontend` constants — seed these)

Bath & Faucets · Decor & Furniture · Paint & Building Materials · Doors & Windows ·
Electrical · Flooring · Hardware · Heating & Cooling · Ceiling Fans · Plumbing ·
Lawn & Garden · Seasonal & Outdoor Living · Kitchenware · Appliances · Storage

Each has an icon SVG in `homebuzz/src/img/categories/` — reuse as seed assets.

### Product card anatomy (`blocks/store/product-list-item`)

Image · title · star rating (`blocks/stars`) · `price-per` (price + unit, e.g.
"$49.99 / gallon") · add-to-cart button (`buttons/small/*`). Maps 1:1 to the
`Product` model below.

### Design tokens (Figma variables → seed `tailwind`/CSS vars)

```
Colors
  --slate-700  #353B3E   (primary dark)
  --ink-900    #1B1E1F   (near-black text/bg)
  --gray-500   #879095   (muted text)
  --gray-200   #CFD7DC   (borders/surfaces)
  --yellow-400 #FFCE3A   (brand accent / CTA)
  --white      #FFFFFF

Type — Inter
  H1     900 / 70px  / 100 lh
  H3     900 / 36px  / 100 lh
  links  400 / 15px  / 100 lh
```

> Action: pull the full variable set from Figma (`get_variable_defs`) per screen during
> the design-system phase; the above is the home-page subset.

---

## 3. Data model (proposed)

Expand beyond today's thin models. Minimum for a real store:

```
User        id, email (unique), password_hash, name, role(customer|admin),
            created_at, updated_at
Category    id, name, slug, icon, parent_id (nullable, for nesting)
Product     id, slug, title, description, price, unit, currency,
            rating_avg, rating_count, stock, sku, category_id,
            created_at, updated_at
ProductImage id, product_id, url, alt, position
Cart        id, user_id (nullable for guest), created_at, updated_at
CartItem    id, cart_id, product_id, quantity, unit_price_snapshot
Order       id, user_id, status, total, created_at        (when checkout in scope)
OrderItem   id, order_id, product_id, quantity, unit_price
Review      id, product_id, user_id, rating, body, created_at
```

Start with the subset your chosen **scope** (section 5) requires; design the schema for
the full set so migrations stay additive.

> **Note:** the PDP shows unit/variant + color swatches. If products have real variants
> (color, size), add a `ProductVariant` table (product_id, name, value, price_delta,
> stock, image_id) and point `CartItem`/`OrderItem` at variant, not product. Skip if v1
> products are single-variant.

**Indexes (for the §6 perf bars):** unique on `User.email`, `Product.slug`,
`Category.slug`; index `Product.category_id` (list filter) and `Cart.user_id`; a
trigram/`pg_trgm` or full-text index on `Product.title` (+ description) for search.
Add as the queries land, not all upfront.

**Seed data:** reuse the 15 categories + category icons and the product images already in
`homebuzz/src/img/` and `homebuzz-frontend/src/assets/images/products/`. Write a
`db/seed` script so dev/test DBs are reproducible.

**Carry-over from old cart (`homebuzz/src/redux/reducer.js`):** cart = line items keyed
by product `id` with `quantity`; auth kept `token` + `user` in `localStorage`. Rebuild
this server-side (persisted `Cart`/`CartItem`) with a guest cart cookie, not localStorage,
and snapshot `unit_price` at add-time so price changes don't mutate an open cart.

### API surface (indicative)

Server actions in Option B; REST routes in A/C. Same operations either way.

```
Catalog   GET  /products?category=&q=&sort=&page=     list + filter + search + paginate
          GET  /products/:slug                        detail
          GET  /categories                            nav
Cart      GET  /cart                                  current (guest or user)
          POST /cart/items        {productId, qty}    add
          PATCH/DELETE /cart/items/:id                update qty / remove
Auth      POST /auth/register | /auth/login | /auth/logout | GET /auth/me
Account   GET/PATCH /account                          profile; GET /account/orders
Orders    POST /checkout  →  GET /orders/:id          (Slice 3)
Reviews   GET /products/:slug/reviews | POST (auth)   (Slice 3)
Admin     POST/PATCH/DELETE /admin/products           role=admin (Slice 3)
```

Every mutation behind auth middleware; admin routes behind a role check.

---

## 4. Architecture — OPTIONS

Pick one. All three deliver the same UI; they differ in operational complexity and
hosting fit.

### Option A — Split: Go API + React SPA  *(closest to current direction)*

```
homebuzz-api  (Go/Gin/Bun/Postgres, cleaned up)
homebuzz-web  (Vite + React 19 + TS + Tailwind 4)
```

- **Pros:** Reuse existing Go knowledge & code; clear FE/BE separation; Go is fast/cheap
  to run; frontend already started in this stack.
- **Cons:** Two deploys, two repos, CORS, no SSR/SEO out of the box, more auth plumbing
  (token storage), no shared types without codegen.
- **Best when:** You want to keep Go and treat web as a pure client.

### Option B — Next.js fullstack monorepo  *(best Vercel fit, least infra)* ⭐ recommended default

```
homebuzz/  (Next.js App Router: UI + Route Handlers + Server Actions)
           Postgres via Drizzle or Prisma
           Auth.js (NextAuth) or Clerk
```

- **Pros:** One codebase, one deploy; SSR/SSG/ISR → great SEO for a storefront; shared
  TS types end-to-end; image optimization, server components, server actions; first-class
  on Vercel; least moving parts.
- **Cons:** Leaves the Go backend behind; couples UI and API in one runtime.
- **Best when:** Speed-to-ship, SEO, and simplicity matter most (typical for a storefront).

### Option C — Turborepo: Next.js web + Go API  *(separation + SSR)*

```
apps/web   (Next.js App Router, SSR storefront)
apps/api   (Go/Gin service)
packages/  (shared ui, config, types via OpenAPI codegen)
```

- **Pros:** Keep Go for the API, get SSR/SEO on the web; shared tooling via Turborepo;
  clean service boundary; scales to multiple frontends (web, admin, mobile).
- **Cons:** Most setup; two languages; need OpenAPI/codegen for type safety across the
  boundary; two deploy targets.
- **Best when:** You value the Go backend AND want SSR + a future admin/mobile client.

| Criterion | A: Go+SPA | B: Next.js | C: Turbo+Go |
|-----------|:---------:|:----------:|:-----------:|
| Time to v1 | medium | **fast** | slow |
| SEO/SSR | ✗ | ✓ | ✓ |
| Reuse Go backend | ✓ | ✗ | ✓ |
| Shared types | codegen | **native** | codegen |
| Ops simplicity | medium | **high** | low |
| Vercel fit | partial | **native** | good |

**Recommendation:** **Option B** for fastest path to a polished, SEO-friendly store.
Choose **C** if keeping the Go backend is a hard requirement.

### Recommended baseline stack (Option B)

Concrete defaults so Phase 0 isn't a research project. Swap any line if you disagree.

| Concern | Pick | Why |
|---------|------|-----|
| Framework | Next.js 16 (App Router) | RSC, server actions, ISR for catalog |
| Language | TypeScript (strict) | shared types end-to-end |
| Styling | Tailwind 4 + CSS vars from tokens | matches Figma vars |
| UI primitives | shadcn/ui (Radix) | accessible, unstyled base for `ui/*` |
| DB | Postgres (Neon) | serverless, branchable, Vercel Marketplace |
| ORM | Drizzle | typed schema + migrations, light |
| Auth | Auth.js (credentials + OAuth) | own the user table; Clerk if you'd rather not |
| Forms | react-hook-form + zod | validation shared client/server |
| Server state | RSC + server actions; TanStack Query only for client-heavy bits | minimize client JS |
| Images | next/image + Vercel Blob (uploads) | optimization + admin uploads |
| Payments | Stripe (Slice 3) | standard, hosted checkout option |
| Tests | Vitest + Playwright | unit + E2E |
| Hosting | Vercel | native for the stack |

---

## 5. Scope — OPTIONS (suggested slices for v1)

Ship in slices. Each builds on the previous.

### Slice 1 — Marketing + catalog browse  *(smallest)*
Home, Store product list, Product details, Privacy, error pages. Products read from DB.
No auth, no cart. **Gets the design live fastest.**

### Slice 2 — Catalog + cart + auth  ⭐ suggested v1
Slice 1 **plus**: sign up / sign in, user account page, cart (add/update/remove,
persisted), product search + category filter + pagination.
**A complete, usable store without payment risk.**

### Slice 3 — Full e-commerce
Slice 2 **plus**: checkout + orders, reviews, admin product management (CRUD + image
upload). Payments (Stripe) optional but natural here.

**Suggested target: Slice 2 for v1**, then layer Slice 3. Slice 1 is a good first
milestone / demo checkpoint inside Slice 2.

### Acceptance criteria (done = all true)

- **Slice 1:** Home, Store list, PDP render from DB; categories filter the list; pages
  responsive at all 4 breakpoints; matches Figma; Lighthouse ≥ 90 (perf/SEO/a11y).
- **Slice 2:** User can register, log in, log out; cart persists across sessions and
  survives guest→login merge; search + filter + pagination work; account page shows
  profile; protected routes redirect when logged out.
- **Slice 3:** Checkout creates an order; order history visible; users can review a
  purchased product; admin can CRUD products with image upload; (payment succeeds in
  Stripe test mode).

### Explicitly out of scope (v1)

Wishlists/favorites · multi-currency/i18n · promo/coupon codes · inventory reservation ·
shipping-rate calc & tax service · email notifications beyond auth · product Q&A ·
recommendations engine · CMS for tutorials/banners (hardcode/seed first) · mobile app.
Park these in a backlog; don't let them grow v1.

---

## 6. Best-practices checklist

**Shared**
- TypeScript strict everywhere; ESLint + Prettier; commit hooks (lint-staged + husky).
- Conventional Commits; CI on PR (lint, typecheck, test, build).
- Secrets in env (never in source); `.env.example` committed.
- Design tokens from Figma → single source (Tailwind theme / CSS vars).
- Component library mirrors Figma `blocks/*` and `buttons/*` naming.

**Frontend**
- Tailwind 4 with tokenized theme; responsive at 375/768/1280/1920.
- Accessible components (semantic HTML, focus states, alt text, color contrast).
- Data fetching: TanStack Query (SPA) or RSC + server actions (Next.js).
- Forms: react-hook-form + zod validation.
- Storybook for the design-system components (optional but recommended).
- Image optimization; lazy-load product grids.

**Backend / data**
- Real auth: hashed passwords (bcrypt/argon2), JWT or session, **auth middleware on
  mutations**, role checks for admin.
- DB migrations (Drizzle/Prisma, or `golang-migrate` for Go).
- Input validation (zod / Gin binding + validator) and consistent error envelope.
- Pagination + filtering + sorting on list endpoints.
- Structured logging, request IDs, basic rate limiting.
- OpenAPI/Swagger kept in sync (already present in Go backend).

**Testing**
- Unit (Vitest / Go test), integration (API + DB via testcontainers), E2E (Playwright)
  for the core flows: browse → add to cart → sign in → checkout.

**Deploy**
- Next.js → Vercel. Postgres → Neon / Vercel Marketplace. Go API → Render/Fly/Railway.
- Preview deploys per PR; production promotion on merge to `main`.

**Quality bars (non-functional targets)**
- Lighthouse ≥ 90 perf / SEO / a11y; Core Web Vitals green (LCP < 2.5s, CLS < 0.1).
- WCAG 2.1 AA: keyboard nav, focus visible, alt text, AA contrast (verify yellow-on-dark).
- SEO: per-page metadata, OpenGraph, sitemap, JSON-LD `Product` schema on PDPs.
- No secrets in source; deps scanned (Dependabot); error tracking (Sentry) from Slice 2.

---

## 7. Phased roadmap

> Assumes Option B (Next.js). Adjust runtime steps for A/C; the sequence holds.
> Estimates are solo-dev rough order-of-magnitude, not commitments.

| Phase | Focus | Rough effort |
|-------|-------|------|
| 0 | Foundation | 2–3 days |
| 1 | Design system | 3–5 days |
| 2 | Slice 1 (catalog browse) | 3–5 days |
| 3 | Slice 2 (cart + auth) | 5–8 days |
| 4 | Slice 3 (full commerce) | 8–12 days |
| 5 | Hardening | 3–5 days |

**Phase 0 — Foundation**
- Scaffold app (Next.js App Router + TS + Tailwind 4).
- Tooling: ESLint, Prettier, husky, CI workflow.
- Tailwind theme from Figma tokens; base layout (header, footer, prefooter).
- DB chosen + connected; ORM + first migration.

**Phase 1 — Design system**
- Build `blocks/*` + `buttons/*` + `inputs/*` components from Figma, responsive.
- Stars, price-per, product-list-item, banners, category nav.

**Phase 2 — Slice 1 (catalog browse)**
- Seed products/categories. Home, Store list, Product details, Privacy, error pages.

**Phase 3 — Slice 2 (cart + auth)**
- Auth (sign up/in, account). Cart (persisted). Search/filter/pagination.

**Phase 4 — Slice 3 (full commerce)**
- Checkout + orders, reviews, admin CRUD + image upload, (payments).

**Phase 5 — Hardening**
- E2E tests, a11y pass, perf (Lighthouse/Core Web Vitals), SEO metadata, analytics.

---

## 8. Proposed repo structure (Option B)

```
homebuzz/
  app/                 # routes (home, store, product/[slug], cart, account, auth)
    (marketing)/       # home, privacy
    store/             # list + [slug] detail
    cart/  account/  auth/
    api/               # route handlers (or prefer server actions)
  components/
    blocks/            # header, footer, prefooter, delivery, banners, promo
    store/             # product-list-item, price-per, stars
    ui/                # buttons, inputs (design-system primitives)
  lib/                 # db, auth, validation (zod), utils
  db/                  # schema, migrations, seed
  styles/              # tailwind theme / tokens
  tests/               # unit, integration, e2e
```

### Environment variables (`.env.example`)

```bash
DATABASE_URL=                 # Neon pooled connection string
AUTH_SECRET=                  # openssl rand -base64 32
AUTH_GOOGLE_ID=               # OAuth (optional)
AUTH_GOOGLE_SECRET=
BLOB_READ_WRITE_TOKEN=        # Vercel Blob (product/admin images)
STRIPE_SECRET_KEY=            # Slice 3
STRIPE_WEBHOOK_SECRET=        # Slice 3
SENTRY_DSN=                   # Slice 2+
NEXT_PUBLIC_SITE_URL=         # canonical URL for metadata/sitemap
```

---

## 9. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Scope creep → never ship | Hard-cut at Slice 2 for v1; Slice 3 is a separate milestone |
| Figma design only at 1920 for some frames | Define 375/768/1280/1920 rules per component in Phase 1; don't guess at build time |
| Auth done wrong (the old app's biggest gap) | Use Auth.js/Clerk, not hand-rolled JWT; mutations behind middleware from day one |
| Cart correctness (price drift, guest→user merge) | Snapshot `unit_price`; server-side cart + cookie; test the merge path explicitly |
| Old assets low-res / licensing | Audit reused images; replace placeholders before launch |
| Picking ORM/auth late stalls Phase 0 | Defaults pre-chosen in §4 baseline stack — start, don't deliberate |

---

## 10. Open questions / decisions needed

1. **Architecture:** A, B, or C? (recommend B)
2. **Scope for v1:** Slice 1, 2, or 3? (recommend 2)
3. **Repo:** fresh repo, or rebuild in place / new branch of an existing one?
4. **Auth provider:** roll-your-own (Auth.js) vs managed (Clerk)?
5. **Payments** in scope for v1? (Stripe if yes)
6. **Admin:** needed for v1, or seed products manually at first?
7. **Hosting/DB:** Vercel + Neon assumed — confirm.
8. **Pull remaining Figma tokens/screens** (per-screen variable defs) before Phase 1.

---

## 11. Kickoff

Only two answers unblock Phase 0: **architecture (§4)** and **v1 scope (§5)**. Defaults if
you don't object: **Option B (Next.js) + Slice 2**, fresh repo, Neon Postgres on Vercel.

First commands once decided:

```bash
npx create-next-app@latest homebuzz --typescript --tailwind --app --eslint
# then: shadcn init, drizzle + neon, auth.js, tokens → tailwind theme, base layout
```
