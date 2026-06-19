<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

**Before any code change, complete these two prerequisite phases:**

1. **Check the installed Next.js version**: Open `package.json` and note the `next` version. If `node_modules/next/dist/docs/` does not exist, stop and run `npm install` first; do not infer behavior from memory.
   - If `npm install` fails, stop and report the exact error.
   - After `npm install`, verify that `node_modules/next/dist/docs/` exists and contains docs matching the version in `package.json`; if verification fails, stop and report the exact result.
2. **Read version-specific docs**: Once dependencies are installed, open the Next.js docs in `node_modules/next/dist/docs/` that match the version in `package.json`.
   - If no matching docs directory exists for the version in `package.json`, stop and report that the local docs are unavailable for that version; do not infer behavior from memory.
   - Read the docs files in `node_modules/next/dist/docs/` that match the version in `package.json`, and follow only the sections relevant to the requested change before editing code.

**Breaking changes**: APIs, conventions, and file structure may differ from your training data. Heed all deprecation notices in the docs.
<!-- END:nextjs-agent-rules -->

## Commands

```bash
npm run dev          # dev server on :3000
npm run build        # production build
npm test             # vitest unit tests (tests/unit/) — see docs/TESTING.md
npm run test:e2e     # playwright e2e (tests/e2e/)    — see docs/TESTING.md
npm run lint         # eslint
npm run db:migrate   # apply migrations (use this, not db:push in scripts)
                     # If this fails, stop and report the exact error; do not attempt db:push
npm run db:seed      # seed 2 users + 15 categories + 12 products
                     # If this fails, stop and report the error; do not proceed with code changes
npm run db:generate  # generate migration from schema change
npm run db:studio    # Drizzle Studio
```

## Architecture

Use the Next.js version declared in `package.json` and the corresponding docs in `node_modules/next/dist/docs/`, along with Drizzle ORM + Neon Postgres, NextAuth v5 (beta), Tailwind v4, Zod + react-hook-form.

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

**If `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, or `AUTH_SECRET` is empty, contains placeholder values such as `your-.../changeme`, or does not match the required Neon/secret format, stop and ask the user to create or fix `.env.local` before running any command.**

Treat empty strings, placeholder values such as `your_database_url_here` or `changeme`, malformed Neon URLs, and secrets shorter than 32 characters as invalid; ask the user to replace them before any command is run.

## Key Gotchas

- **In package.json scripts and CI workflow steps, use `npm run db:migrate`** — do not run `drizzle-kit db:push` from package scripts or CI jobs.
- **Two DB URLs required**: app uses pooled connection (`prepare: false`); migrations need direct because DDL doesn't work through the pooler.
- **Auth is NextAuth v5 beta** — API differs significantly from v4; check `auth.ts` and NextAuth v5 beta docs.
- **Seeded test accounts** (password: `password1234`): `demo@homebuzz.test` (customer), `admin@homebuzz.test` (admin).
- **Roles**: `userRole` enum is `customer | admin`; admin routes are protected via middleware checking session role.
