# System Graph

An interactive visualization of the Homebuzz architecture — nodes, edges, and annotated flow traces for the major user journeys.

## Viewing it

Open `index.html` directly in a browser (no server needed):

```bash
open docs/system-graph/index.html
```

Or, while the dev server is running, navigate to it from the project root. The graph renders entirely client-side from `data.json`.

## What it shows

- **Nodes** — the major system components (actors, client layers, server layers, data stores, external services, background jobs), each with a category color and an optional file path.
- **Edges** — the connections between them, labelled with what flows across (HTTP request, Drizzle select, revalidatePath, etc.).
- **Flows** — step-by-step traces of the 8 major user journeys (checkout, browse, add to cart, sign up, sign in + merge, submit review, admin save, seed). Each flow highlights the relevant edges in sequence.

## Updating `data.json`

Edit `docs/system-graph/data.json`. The structure:

```jsonc
{
  "name": "...",
  "description": "...",
  "categories": [
    { "id": "server", "label": "Server", "color": "#4ade80" }
    // actor | client | server | data | job | external
  ],
  "nodes": [
    {
      "id": "lib-cart",           // unique slug, used in edges + flows
      "label": "Cart logic",      // display name
      "category": "server",       // must match a categories[].id
      "path": "lib/cart.ts",      // optional — shown in the node tooltip
      "detail": "..."             // optional — one-line description
    }
  ],
  "edges": [
    {
      "from": "client-components",
      "to": "server-actions",
      "label": "invoke action"    // short verb phrase
    }
  ],
  "flows": [
    {
      "id": "checkout",
      "name": "Checkout / place order",
      "description": "...",
      "steps": [
        {
          "from": "shopper",
          "to": "server-actions",
          "label": "Submit checkout form",
          "detail": "placeOrderAction() — app/actions/orders.ts"   // optional
        }
      ]
    }
  ],
  "meta": {
    "generatedAt": "YYYY-MM-DD",
    "sourceCommit": "abc1234",
    "notes": "Any modelling decisions or shortcuts worth noting."
  }
}
```

### When to update

- A new `lib/*` module is added → add a node and wire its edges.
- A major user flow changes significantly → update or add a flow in `flows`.
- New external service is integrated → add a node with `"category": "external"`.
- After a non-trivial commit → bump `meta.generatedAt` and `meta.sourceCommit`.

The graph does not need to show every file — only the components that matter for understanding data flow and authorization boundaries. Internal helpers that don't cross a layer boundary (e.g. `lib/utils.ts`, `lib/validation.ts`) are intentionally omitted.
