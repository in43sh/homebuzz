# Homebuzz

_A full-stack Next.js e-commerce storefront — browse, cart, checkout, review._

A full-stack e-commerce storefront built with the Next.js App Router. It covers
the core shopping flow end to end — browsing products by category, a persistent
cart, checkout into orders, customer reviews on purchased items, and an
admin area for managing the catalog.

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router) + **React 19**
- **[Drizzle ORM](https://orm.drizzle.team)** on **[Neon](https://neon.com) Postgres**
- **[NextAuth v5](https://authjs.dev)** (beta) for authentication and roles
- **[Tailwind CSS v4](https://tailwindcss.com)** for styling
- **[Zod](https://zod.dev)** + **[react-hook-form](https://react-hook-form.com)** for forms and validation
- **[Vitest](https://vitest.dev)** (unit) + **[Playwright](https://playwright.dev)** (e2e)

## Features

- **Storefront** — product listing, category browsing, and product detail pages
- **Cart** — add/update/remove items, persisted per user
- **Orders** — checkout turns a cart into an order with line items
- **Reviews** — customers can review products they've purchased; ratings roll up to the product
- **Auth & roles** — `customer` and `admin` roles; admin routes are gated by middleware
- **Admin** — product CRUD for catalog management

## Getting started

See **[SETUP.md](SETUP.md)** for the full first-run guide (environment,
database, seeding). The short version:

```bash
cp .env.example .env.local   # then fill in DATABASE_URL, DATABASE_URL_UNPOOLED, AUTH_SECRET
npm install
npm run db:migrate           # create tables
npm run db:seed              # 2 users, 15 categories, 12 products
npm run dev
```

Open <http://localhost:3000>.

Seeded logins (password `password1234`):

- `demo@homebuzz.test` — customer
- `admin@homebuzz.test` — admin

## Common commands

```bash
npm run dev          # dev server on :3000
npm run build        # production build
npm run lint         # eslint
npm test             # vitest unit tests
npm run test:e2e     # playwright e2e tests
npm run db:migrate   # apply migrations
npm run db:seed      # seed sample data
npm run db:studio    # browse the DB in Drizzle Studio
```

## Project layout

Data mutations run through **Server Actions** in `app/actions/` rather than REST
API routes — the only route handler is `app/api/auth/` for NextAuth.

```text
app/
  actions/            # Server Actions (auth, cart, orders, reviews, admin)
  api/auth/           # NextAuth route handler
  admin/products/     # Admin-only product CRUD
  store/[category]/   # Storefront, browse by category
  product/[slug]/     # Product detail + reviews
  cart/               # Cart page
  account/orders/     # Order history
  signin/ signup/     # Auth pages
components/           # UI primitives + admin, auth, cart, store, blocks
db/                   # schema.ts, index.ts, seed.ts, migrations/
lib/                  # Server-safe data access, validation, types
auth.ts               # NextAuth config (root-level)
tests/                # unit/ (Vitest) and e2e/ (Playwright)
```

## Notes for contributors

This project pins a specific Next.js version and uses NextAuth v5 (beta), whose
APIs differ from older releases. Before making code changes, read
**[AGENTS.md](AGENTS.md)** — it documents the version-specific conventions, the
two-database-URL setup (pooled app connection vs. direct migration connection),
and other gotchas. Testing details live in [docs/TESTING.md](docs/TESTING.md).
