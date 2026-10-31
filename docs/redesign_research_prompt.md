# Research Prompt: Evidence-Driven Redesign of Homebuzz

You are conducting **redesign research** for Homebuzz, a Next.js e-commerce store
(App Router, Drizzle + Neon Postgres, NextAuth v5 beta, Tailwind v4). This is a
**research-only task**: produce a findings report and a prioritized redesign
roadmap. Do **not** change any code.

## Mission

Identify what should change in the site's design and functionality so that it
becomes **measurably more usable and more capable** — not merely different.

The core rule: **every recommendation must trace back to evidence.** Acceptable
evidence is one of:

1. Observed friction during a task walkthrough (something took extra steps,
   was ambiguous, or failed)
2. A violated, named usability heuristic or WCAG criterion
3. A measured metric (Lighthouse, bundle size, interaction latency)
4. A missing capability that a user of a store of this type would reasonably
   expect (functionality gap)

Recommendations based purely on visual taste ("this would look more modern",
"trendy gradient", "rebrand the palette") are **out of scope and must not
appear in the report**. If the current design of an element works, say so — the
report must include a "Keep as-is" section listing what should *not* be
churned.

## Ground rules

- Read `AGENTS.md` first and follow its prerequisite phases (installed Next.js
  version, local docs in `node_modules/next/dist/docs/`, `.env.local`
  validation) before running anything.
- Run the real app (`npm run dev`) and evaluate it in a browser — do not judge
  UX from source code alone. Use browser automation (Playwright) at **two
  viewports minimum**: desktop (1280px+) and mobile (375px).
- Code is read-only; **database state is not**. When a finding depends on data
  the seed lacks (it has only 12 products across 15 categories), create the
  data through the admin UI and observe the real behavior — never present
  at-scale behavior you did not actually reproduce. `npm run db:seed` restores
  the baseline.
- Test as all three user types, using the seeded accounts from `AGENTS.md`:
  - Guest (signed out)
  - Customer: `demo@homebuzz.test` / `password1234`
  - Admin: `admin@homebuzz.test` / `password1234`
- Cite evidence precisely: `file:line` for code; for observed behavior, the
  page URL, the steps to reproduce, and a screenshot saved under
  `docs/audits/redesign_research_assets/`.
- Orient in the codebase with `graphify query "<question>"` before grepping
  raw files (repo rule — see `CLAUDE.md`).
- Build on prior work instead of rediscovering it. Known findings already
  documented — reference them, do not re-report them as new:
  - `docs/audits/accessibility_audit.md` — 5 open findings (muted-text
    contrast, missing focus outlines on search, focus-ring contrast, mobile
    drawer focus management, missing skip link)
  - `docs/audits/lighthouse_audit.md` — performance is already 99–100; treat
    that as a **budget to protect**, not a problem to solve
  - `docs/backlog.md` — open follow-ups

## Site map (current state)

Storefront: `/` (home), `/store` (catalog), `/store/[category]`,
`/product/[slug]`, `/cart`, `/help`, `/privacy`.
Auth: `/signin`, `/signup`.
Account: `/account`, `/account/orders`, `/account/orders/[id]`.
Admin: `/admin`, `/admin/products` (CRUD: list, new, edit).
Server actions in `app/actions/`: auth, cart, orders, reviews, admin.
Data model in `db/schema.ts`: users, categories, products, carts, cartItems,
orders, orderItems, reviews.

Note: order placement is currently a single server action from the cart
(`app/actions/orders.ts` → `placeOrderAction`) — there is no checkout page, no
address/shipping step, and no order-confirmation review step. Treat the
checkout experience as a primary research area.

## Phase 1 — Task walkthroughs (observed friction)

Perform each task end-to-end, at both viewports. Record the number of steps
(clicks + form inputs) each task takes — these step counts are the baseline
the redesign will later be measured against. Log every point of friction
(extra clicks, unclear labels, missing feedback, dead ends, layout problems)
and rate it:

- **Blocker** — the task cannot be completed, or the user cannot tell whether
  it succeeded
- **Major** — the task completes, but with wasted steps, real confusion, or an
  error that looks unrecoverable
- **Minor** — polish: wording, spacing, small inconsistencies

Guest and customer tasks:

1. Land on home → understand what the store sells within 5 seconds
2. Find a specific product three ways: browse via category, use search, scan
   the catalog
3. Evaluate a product page: is there enough information to decide? (price,
   stock, images, specs, reviews, shipping expectations)
4. Add to cart, change quantity, remove an item; verify feedback at each step
5. Attempt to place an order as a guest — what happens?
6. Sign up, sign in, recover from a wrong password
7. Place an order as a customer; find that order afterwards; understand its
   status
8. Write a review; find your review afterwards
9. Trigger error and edge states deliberately: empty cart, out-of-stock
   product, empty search results, invalid form input, direct URL to a
   protected page

Admin tasks:

1. Sign in as admin and understand what needs attention (is there any
   dashboard signal, or just a product list?)
2. Create a product, edit it, take it out of stock, delete it
3. Handle a mistake: recover from a validation error mid-form

## Phase 2 — Systematic evaluation

Score the site against each lens below. For every failure, name the specific
principle violated and point at the evidence.

1. **Nielsen's 10 heuristics** — especially visibility of system status
   (loading/pending states on server actions), user control (undo, cancel),
   error prevention and recovery (form validation messaging)
2. **E-commerce conventions** (Baymard-style): category/IA clarity, product
   list scannability (filter, sort, pagination behavior at scale), product
   page trust signals, cart transparency (totals, taxes/shipping expectations),
   checkout friction
3. **Forms**: label/placeholder usage, inline vs. on-submit validation, error
   message specificity, autofill/autocomplete attributes, password UX
4. **State coverage**: for each page, verify loading, empty, error, and
   partial-data states exist and are designed (not just default browser
   behavior or unstyled fallbacks)
5. **Accessibility beyond the known 5 findings**: keyboard-only pass of every
   flow, heading hierarchy, landmark structure, form-error announcement,
   touch-target size on mobile
6. **Content and copy**: microcopy at decision points (buttons, empty states,
   errors), consistency of terminology across pages
7. **Responsive behavior**: anything that works on desktop but degrades on
   mobile (tables, admin forms, image sizing)

## Phase 3 — Functionality gap analysis

For each gap, state the expected behavior, whether it is in scope for this
product's ambition (portfolio-grade demo store), and what the minimal credible
version would be. Investigate at least:

- Checkout flow (address, confirmation step, order summary before commit)
- Search quality (matching behavior, empty-state guidance, result ranking)
- Catalog controls (filtering, sorting, pagination/infinite scroll — create
  enough products via the admin UI to observe list behavior at 50–100+ items
  rather than guessing)
- Order lifecycle (statuses, cancellation, re-order)
- Review system depth (editing, deletion, verified-purchase signal, sorting)
- Stock handling (low-stock display, out-of-stock UX on product and cart)
- Account management (profile editing, password change, address book)
- Admin capabilities (order management, category management, bulk operations,
  image handling)

Do not assume every gap must be filled — part of the research is deciding
which gaps matter for this product and which are deliberate scope cuts.

## Phase 4 — Synthesis and roadmap

Deliver a single report at `docs/audits/redesign_research.md` containing:

1. **Executive summary** — the 3–5 changes with the highest usability return
2. **Keep as-is** — what works and must survive the redesign untouched
   (include the performance budget: Lighthouse ≥ current scores)
3. **Findings table** — every finding with: ID, area, severity
   (blocker/major/minor), evidence (file:line or URL + observation), principle
   or expectation violated, recommendation, rough effort (S/M/L)
4. **Prioritized roadmap** — findings grouped into ordered milestones by
   impact-per-effort; fold in the open items from `docs/backlog.md` rather
   than duplicating them
5. **Open questions** — decisions that need the owner's input (scope
   judgments, feature ambition), listed rather than assumed
6. **Verification plan** — for each executive-summary change, the before/after
   measurement that will prove it worked: task step count from Phase 1, a
   contrast ratio, a Lighthouse/axe score, or a new e2e assertion

Report quality bar:

- Cluster repeated issues into one finding with multiple evidence citations
  (the same copy problem on five pages is one finding, not five). The report
  must be decision-ready, not an exhaustive defect log — if everything is
  important, nothing is.
- The report must pass `npx markdownlint-cli2` with zero issues.

Constraints on recommendations:

- Stay on the current stack (Next.js App Router, Tailwind v4, Drizzle,
  NextAuth v5). No framework, library, or database migrations.
- No rebranding or purely visual churn; visual changes are only justified
  when they fix a finding (e.g., contrast, hierarchy, scannability).
- Each roadmap item must be independently shippable and testable
  (`npm test`, `npm run test:e2e`).
