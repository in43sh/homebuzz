<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

```bash
npm run dev          # dev server on :3000
npm run build        # production build
npm test             # vitest unit tests (tests/unit/)
npm run test:e2e     # playwright e2e (tests/e2e/)
npm run lint         # eslint
npm run db:migrate   # apply migrations (use this, not db:push in scripts)
npm run db:seed      # seed 2 users + 15 categories + 12 products
npm run db:generate  # generate migration from schema change
npm run db:studio    # Drizzle Studio
```

## Architecture

Next.js 16 App Router, Drizzle ORM + Neon Postgres, NextAuth v5 (beta), Tailwind v4, Zod + react-hook-form.

```text
app/             # Route segments (App Router)
  actions/       # Server Actions (auth, cart, orders, reviews, admin)
  api/auth/      # NextAuth route handler
  admin/         # Admin-only pages (products CRUD)
  store/         # Storefront pages
components/      # Shared UI, cart, store, admin, auth blocks
db/              # schema.ts, index.ts, seed.ts, migrations/
lib/             # Server-safe utilities, validation, types
auth.ts          # NextAuth config (root-level)
tests/unit/      # Vitest tests
tests/e2e/       # Playwright tests
```

## Environment

Env file must be `.env.local` (not `.env`). Three required vars:

- `DATABASE_URL` — Neon pooled URL (contains `-pooler`), used by the app
- `DATABASE_URL_UNPOOLED` — Neon direct URL (no `-pooler`), used by drizzle-kit
- `AUTH_SECRET` — generate with `npx auth secret`

## Key Gotchas

- **`db:push` needs an interactive TTY** — use `db:migrate` in scripts/CI.
- **Two DB URLs required**: app uses pooled connection (`prepare: false`); migrations need direct because DDL doesn't work through the pooler.
- **Auth is NextAuth v5 beta** — API differs significantly from v4; check `auth.ts` and NextAuth v5 beta docs.
- **Seeded test accounts** (password: `password1234`): `demo@homebuzz.test` (customer), `admin@homebuzz.test` (admin).
- **Roles**: `userRole` enum is `customer | admin`; admin routes are protected via middleware checking session role.
