# Using Graphify on HomeBuzz

A queryable knowledge graph of this codebase lives in `graphify-out/`. Instead of grepping,
you (and the AI assistant) can ask **relationship questions** — "what calls this", "what breaks if I
change this", "trace this flow" — and get a scoped answer with source locations.

- **What it is and how it was set up:** [GRAPHIFY_PLAN.md](GRAPHIFY_PLAN.md)
- **How it differs from the hand-built [system-graph/](system-graph/):** see the comparison at the
  bottom of this doc.

---

## TL;DR

```bash
cd <repo root>                          # graphify-out/ must be here
graphify query "how does checkout work?"   # broad orientation
graphify affected "formatPrice()"          # impact analysis — what depends on it
graphify explain "isAdmin()"               # a node + its neighbors
graphify path "AddToCartButton()" "carts"  # shortest route between two things
```

Or just **ask the assistant** ("what uses `formatPrice`?") — a PreToolUse hook makes it consult the
graph automatically before searching files.

---

## Setup notes (one-time, already done)

- Installed via pipx: package **`graphifyy`** (double `y`), CLI command **`graphify`** (single `y`).
- The CLI lives in `~/.local/bin`. It's on `PATH` in any **new** terminal. If you ever see
  `command not found: graphify` in an old shell, run `export PATH="$HOME/.local/bin:$PATH"`.
- Always run from the **repo root** — the commands look for `graphify-out/graph.json` relative to the
  current directory.

---

## The commands that pay off

### `graphify affected "<symbol>"` — impact analysis

Before refactoring something shared, see everything that depends on it (reverse traversal, 2 hops).

```text
$ graphify affected "formatPrice()"
- OrderDetailPage() [calls]  app/account/orders/[id]/page.tsx:L11
- CartPage()        [calls]  app/cart/page.tsx:L12
- PricePer()        [calls]  components/store/PricePer.tsx:L4
- ProductCard.tsx   [imports_from] components/store/ProductCard.tsx:L1
- utils.test.ts     [imports] tests/unit/utils.test.ts:L1
  ... (admin products, account page, product page)
```

You get the exact change-surface **and the test that guards it** — without missing a caller two hops
out.

### `graphify explain "<symbol>"` — understand a node and its boundary

```text
$ graphify explain "isAdmin()"
Node: isAdmin()  (lib/admin.ts:L9, community 0, degree 6)
Connections:
  <-- saveProductAction()   [calls]
  <-- deleteProductAction() [calls]
  <-- AdminLayout()         [calls]
  ...
```

That's the **entire admin-authorization boundary** in one view. Add a new admin action? This shows
the enforcement pattern to follow.

### `graphify query "<question>"` — broad orientation

BFS traversal from the concepts in your question; returns a scoped subgraph with `source` locations.
Cap the size with `--budget N`.

```bash
graphify query "how does guest cart merge into a user cart on sign in?"
graphify query "where are numeric prices converted from strings?" --budget 800
```

### `graphify path "<A>" "<B>"` — trace a route

```bash
graphify path "AddToCartButton()" "carts"   # UI button → database table
```

---

## When to use which

| Question shape | Tool |
| --- | --- |
| "What calls / uses this?" · "What breaks if I change it?" | `graphify affected` |
| "What is this and what does it touch?" | `graphify explain` |
| "How does <feature/flow> work?" | `graphify query` |
| "How does A connect to B?" | `graphify path` |
| Editing a specific known line | just open the file — skip graphify |

Rule of thumb: reach for graphify when the question is about **relationships**, not when you already
know the exact line to edit.

---

## Keeping the graph fresh

Code files are parsed locally (free, no API). After meaningful code changes:

```bash
graphify update .     # AST-only re-extract, no LLM cost
```

`CLAUDE.md` reminds the assistant to do this. A fuller rebuild (re-running semantic extraction over
docs/images) is the `/graphify .` skill inside the AI assistant.

> **Note:** `graphify-out/` is gitignored — it's regenerable and machine-specific, so it is not
> committed. Rebuild it locally with `graphify update .` or `/graphify .`.

---

## How this differs from `docs/system-graph/`

Both visualize HomeBuzz, but they are different tools and **both are worth keeping**.

| | `docs/system-graph/` | graphify (`graphify-out/`) |
| --- | --- | --- |
| Origin | Hand-authored by a human | Auto-extracted (AST + LLM) |
| Granularity | ~dozens of high-level components | ~400 nodes, function/symbol level |
| Structure | Curated columns + 8 named flow traces | 38 auto-detected communities |
| Best at | A narrative "how the checkout journey works" | Querying "what calls X", "what breaks if I change Y" |
| Updated by | A human editing `data.json` | `graphify update .` (automatic) |
| Audience | Humans, for understanding | The assistant + ad-hoc relationship queries |

In short: **system-graph answers "why/how"** (curated, narrative); **graphify answers "what/where"**
(exhaustive, queryable). Use the first to learn a journey, the second to navigate the code.
