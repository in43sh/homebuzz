<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

Before any code change, read the `next` version in `package.json`, then open the matching docs in `node_modules/next/dist/docs/` and follow the sections relevant to the change. Do not infer behavior from memory.

If `node_modules/next/dist/docs/` is missing, run `npm install`. If that fails, stop and report the exact error. If no docs match the `package.json` version, stop and report that the local docs are unavailable for that version.

APIs, conventions, and file structure may differ from your training data. Heed all deprecation notices in the docs.
<!-- END:nextjs-agent-rules -->

## Commands

The `db/` module throws at import if `DATABASE_URL` is unset, so database commands need `.env.local` in place first; see Environment below. Before reporting a code change as done, run `npm run lint` and `npm test`.

```bash
npm run dev          # dev server on :3000
npm run build        # production build
npm test             # vitest unit tests (tests/unit/) — see docs/testing.md
npm run test:e2e     # playwright e2e (tests/e2e/)    — see docs/testing.md
npm run lint         # eslint
npm run db:migrate   # apply migrations
npm run db:seed      # seed 2 users + 15 categories + 12 products
npm run db:generate  # generate migration from schema change
npm run db:studio    # Drizzle Studio
```

If `db:migrate` or `db:seed` fails, stop and report the exact error. Do not try `db:push`, and do not change code to work around a failed seed.

## Architecture

Next.js 16.2.7 (App Router) with React 19, Drizzle ORM + Neon Postgres, NextAuth v5 (beta), Tailwind v4, Zod + react-hook-form.

```text
app/             # Route segments (App Router)
  actions/       # Server Actions (auth, cart, orders, reviews, admin)
  api/auth/      # NextAuth route handler (the only route handler)
  admin/products/  # Admin-only product CRUD
  store/           # Storefront: store/, store/[category]/
  product/[slug]/  # Product detail + reviews
  cart/            # Cart page
  account/         # Account and order history (account/orders/[id])
  signin/ signup/ help/ privacy/  # Auth and static pages
components/      # ui/ primitives, plus admin, auth, cart, store, blocks
db/              # schema.ts, index.ts, seed.ts, migrations/
lib/             # Server-safe data access, validation, types
auth.ts          # NextAuth config (root-level)
tests/unit/      # Vitest tests
tests/e2e/       # Playwright tests
```

## Project Docs

Read the docs that match the task. Paths are relative to `docs/`. Check `docs/` for an existing answer before asking the user about a design or history question.

Loaded every session:

- Backlog: @docs/backlog.md

Start here:

- [technical_guide.md](docs/technical_guide.md) — architecture, data model, subsystems, operations, and the reasons behind them. Read before non-trivial work.
- [concepts.md](docs/concepts.md) — explains RSC, Server Actions, Auth.js sessions, Drizzle, and the data model as this project uses them.
- [walkthrough.md](docs/walkthrough.md) — annotated end-to-end traces of each major feature.
- [testing.md](docs/testing.md) — test layout, how to run each suite, and how to add tests.
- [roadmap.md](docs/roadmap.md) — what has shipped and what comes next.
- [questions.md](docs/questions.md) — log of unclear points and their answers. Add an entry when something clicks.

Accessibility and performance:

- [audits/accessibility_audit.md](docs/audits/accessibility_audit.md) — WCAG 2.1 AA findings (2026-07-05), referenced by the backlog.
- [audits/lighthouse_audit.md](docs/audits/lighthouse_audit.md) — Lighthouse results and perf opportunities (2026-07-05).

Graph tooling:

- [graphify.md](docs/graphify.md) — how to query the knowledge graph in `graphify-out/`.
- [graphify_plan.md](docs/graphify_plan.md) — the plan for installing Graphify and its Claude Code integration.
- [system-graph/README.md](docs/system-graph/README.md) — interactive architecture map (`system-graph/index.html`, data in `data.json`).

Naming (rename from Homebuzz to Base Hardware is done; these record the research):

- [naming_research.md](docs/naming_research.md) — decision summary and owner answers.
- [naming_research_prompt.md](docs/naming_research_prompt.md) — the prompt that produced the research.
- [naming_research_2026-10-31.md](docs/naming_research_2026-10-31.md) — first research round.
- [naming_research_round_2_2026-10-31.md](docs/naming_research_round_2_2026-10-31.md) — second round of candidates.

Historical and planning (context only, not current guidance):

- [plan_original.md](docs/plan_original.md) — the original rebuild plan (2026-06-04). Explains why things are as they are.
- [redesign_research_prompt.md](docs/redesign_research_prompt.md) — prompt for an evidence-driven redesign. Not yet acted on.

## Environment

Env file must be `.env.local` (not `.env`). `.env.example` lists the required vars:

- `DATABASE_URL` — Neon pooled URL (contains `-pooler`), used by the app
- `DATABASE_URL_UNPOOLED` — Neon direct URL (no `-pooler`), used by drizzle-kit
- `AUTH_SECRET` — generate with `npx auth secret`

Optional: `NEXT_PUBLIC_SITE_URL` sets the canonical origin for metadata, sitemap, robots and JSON-LD (`lib/site.ts`). It falls back to `http://localhost:3000`, so set it in production.

**If `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, or `AUTH_SECRET` is empty, contains placeholder values such as `your-.../changeme`, or does not match the required Neon/secret format, stop and ask the user to create or fix `.env.local` before running any command.**

Treat empty strings, placeholder values such as `your_database_url_here` or `changeme`, malformed Neon URLs, and secrets shorter than 32 characters as invalid; ask the user to replace them before any command is run.

## Key Gotchas

- **In package.json scripts and CI workflow steps, use `npm run db:migrate`** — do not run `drizzle-kit db:push` from package scripts or CI jobs.
- **Two DB URLs required** (see Environment): the app uses the pooled URL with `prepare: false`, and migrations need the direct URL because DDL doesn't work through the pooler.
- **Auth is NextAuth v5 beta** — API differs significantly from v4; check `auth.ts` and NextAuth v5 beta docs.
- **Seeded test accounts** (password: `password1234`): `demo@homebuzz.test` (customer), `admin@homebuzz.test` (admin).
- **Roles**: `userRole` enum is `customer | admin`. There is no middleware. Admin access is enforced in `app/admin/layout.tsx` and in each admin Server Action, both via `isAdmin()` in `lib/admin.ts`. Any new admin page or action needs the same check.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
