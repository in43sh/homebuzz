# Homebuzz — Concepts

Explanations of unfamiliar patterns, anchored to how this project actually uses them.

Read in order — each section builds on the previous one.

---

## Part 1 — The Big Picture

## Architecture — what each block is and why it exists

The architecture diagram in [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md) shows several boxes connected by arrows. The three yellow groupings are **not separate servers** — they're just code locations inside one Next.js process. The question the diagram answers is: who is allowed to talk to the database?

### The blocks

**Browser** — the user's Chrome/Safari/etc. Receives rendered HTML and RSC payloads from the server, then runs the small amount of client JS (`"use client"` components).

**Client Components** (cart buttons, forms) — `AddToCartButton`, `CartControls`, `AuthForm`. They live in the browser after hydration. They cannot touch the DB or read cookies — no server access.

**Server Components** (app/**/page.tsx) — the pages. They run on the server per request, read data directly from `lib/*`, and return HTML. This code never runs in the browser.

**Server Actions** (app/actions/*.ts) — the mutation layer. Client Components call these like functions, but they actually run on the server. That's the "invoke" arrow in the diagram — a button click in the browser becomes a server-side function call.

**Route handler** (app/api/auth/[...nextauth]) — the one real HTTP endpoint in the app. Auth.js needs URLs like `/api/auth/signin` and `/api/auth/session` to function. That single two-line file exposes them all via the catch-all route.

**Domain layer** (lib/) — the actual business logic: cart resolution, order placement, review gating. Both Server Components (reads) and Server Actions (writes) delegate here. It's marked `server-only` so it can never be imported from the browser.

**auth.ts** — the NextAuth config. It sits outside both subgraphs because three different things depend on it: Server Components call `auth()` to read the session, Server Actions call it too, and the Route handler uses `handlers` from it.

**db/index.ts** — the Drizzle client, the single connection to Neon Postgres. Everything that needs the DB — `lib/*` and `auth.ts` (for user lookups at login) — goes through here.

### Why the layers exist

The layering enforces one rule: nothing that runs in the browser can ever reach the database.

```text
Browser / Client Components  →  no DB access (no credentials, no server APIs)
Server Actions               →  have DB access, but delegate to lib/
Server Components            →  have DB access, but delegate to lib/
auth.ts                      →  has DB access (needs to look up users at login)
lib/                         →  where queries actually live
db/index.ts                  →  the connection itself
```

Keeping query logic in `lib/` (rather than inline in actions or pages) means both reads and writes share the same code without duplication, and the logic can be tested without going through HTTP.

---

## Why there is only one API route

### In a traditional stack you'd write controllers

In an Express or Rails app, every operation that changes data needs an HTTP endpoint:

```text
POST /api/cart/add
POST /api/cart/remove
PATCH /api/cart/quantity
POST /api/orders
POST /api/reviews
POST /api/auth/login
POST /api/products          ← admin
DELETE /api/products/:id    ← admin
```

You write a controller for each, handle request parsing, return JSON, and the client `fetch`es them. The browser can only call the server over HTTP, so you need a URL for everything.

### Server Actions replace that entire layer

In this project there are no controllers and no manual `fetch` calls. Client Components call Server Actions directly as async functions — Next.js handles the HTTP round-trip invisibly:

```tsx
// Client Component
import { addToCartAction } from "@/app/actions/cart";

<button onClick={() => addToCartAction(product.id)}>Add to cart</button>
```

Under the hood Next.js compiles `addToCartAction` into a `POST` to a hidden, compiler-generated URL with an opaque hash. You never see or reference that URL. The function call syntax is the entire interface.

This means all mutations — cart, orders, reviews, admin product CRUD — are Server Actions in `app/actions/`, not routes. No controllers, no request parsing, no JSON serialization. The `lib/*` layer below them is also pure functions, not HTTP handlers.

### So why does the one route handler exist?

Auth.js (NextAuth) is a third-party library that was built before Server Actions existed. It needs real, stable HTTP endpoints to do its job:

- `GET /api/auth/session` — the browser's `useSession` hook polls this to check if you're logged in
- `POST /api/auth/signin/credentials` — where the login form posts to
- `GET /api/auth/csrf` — fetches a CSRF token before any POST
- `GET /api/auth/signout` — handles sign-out redirects

These URLs are called by Auth.js's own client library (`next-auth/react`) and can't be replaced with Server Actions because they follow the OAuth/session protocol. The catch-all route `[...nextauth]` captures all of them and hands them to `handlers`:

```ts
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

It's two lines because Auth.js does all the work — this file just mounts it on the right path.

### Summary

| Operation | How it's done | Has a URL? |
| --------- | ------------- | ---------- |
| Add to cart | Server Action | No (hidden) |
| Place order | Server Action | No (hidden) |
| Submit review | Server Action | No (hidden) |
| Admin product CRUD | Server Action | No (hidden) |
| Sign in / sign out / session | Auth.js route handler | Yes — `/api/auth/*` |

The only route that exists is the one that has to — because Auth.js requires stable, publicly addressable URLs. Everything else uses Server Actions, which have no URLs you ever need to know or maintain.

---

## Part 2 — The Data Layer

## Neon Postgres

Neon is a serverless Postgres service — it's just Postgres, but hosted so that the database can scale to zero when idle and spin back up on demand.

### Why "serverless" matters here

A traditional Postgres server keeps a fixed pool of connections alive. Serverless functions (like Next.js on Vercel) can spawn many short-lived instances simultaneously, each trying to open its own connection — and Postgres has a hard cap on connections.

Neon solves this with a **connection pooler (PgBouncer)** that sits in front of the real Postgres. Your app connects to the pooler, which manages a smaller set of actual Postgres connections. That's why the project uses the pooled URL at runtime.

### Why `prepare: false`

PgBouncer's transaction mode (which Neon uses) doesn't support **prepared statements** — a Postgres feature where a query is pre-parsed and cached on the server for repeated use. The driver (`postgres-js`) tries to use them by default, which fails against the pooler:

```ts
// db/index.ts
const client = postgres(connectionString, { max: 5, prepare: false });
```

`prepare: false` disables this for all queries. There's no performance difference in practice for this kind of app.

### `max: 5`

This caps the number of concurrent connections this app instance will open to the pooler. Since the pooler itself fans these out to Postgres, keeping this low prevents overwhelming the real connection limit.

### The two-URL setup in practice

```text
.env.local

DATABASE_URL=postgresql://...@ep-xxx-pooler.neon.tech/neondb   ← app uses this
DATABASE_URL_UNPOOLED=postgresql://...@ep-xxx.neon.tech/neondb  ← migrations use this
```

The key difference is `-pooler` in the hostname. If you accidentally use the pooled URL for migrations, Drizzle will fail with a prepared-statement error. If you use the direct URL for the app, you may hit Postgres connection limits under load.

---

## Drizzle ORM

Drizzle is a TypeScript ORM that lets you write database queries using JavaScript objects and functions instead of raw SQL strings, while keeping the output very close to SQL.

### The schema is the source of truth

[db/schema.ts](db/schema.ts) defines every table as a TypeScript object:

```ts
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  // ...
});
```

This one definition does three things at once:

1. Tells `drizzle-kit` what SQL to generate when you run `npm run db:migrate`
2. Gives TypeScript the row type — `typeof products.$inferSelect` is the shape of a row returned from the DB
3. Gives Drizzle the column references used in queries

### Queries look like SQL, but typed

```ts
// lib/products.ts
const rows = await db
  .select({ name: categories.name, slug: categories.slug })
  .from(categories)
  .orderBy(categories.id);
```

Compare to the SQL it produces: `SELECT name, slug FROM categories ORDER BY id`. The difference is that `categories.id` is a typed reference — rename the column in the schema and every query that uses it becomes a type error.

For filtering, Drizzle exposes helper functions that map to SQL operators:

```ts
import { eq, ilike, and, or } from "drizzle-orm";

// WHERE categories.slug = $1
.where(eq(categories.slug, category))

// WHERE title ILIKE $1 OR description ILIKE $2
.where(or(ilike(products.title, `%${q}%`), ilike(products.description, `%${q}%`)))
```

### The `db` object is the entry point

[db/index.ts](db/index.ts) creates one `db` instance and exports it. Every `lib/*` file imports from there:

```ts
import { db } from "@/db";
import { products, categories } from "@/db/schema";
```

### Numeric columns come back as strings

Postgres `numeric` (the type used for `price`, `total`, `unit_price`) is returned by the driver as a string to avoid JavaScript floating-point precision loss. The convention in this project is to `Number()` on read:

```ts
const price = Number(r.unitPrice); // "12.99" → 12.99
```

And `.toFixed(2)` when writing back.

### Two database connections

The project uses two different Postgres URLs (see [db/index.ts](db/index.ts) and [drizzle.config.ts](drizzle.config.ts)):

| URL                              | Used for                          | Why                                           |
| -------------------------------- | --------------------------------- | --------------------------------------------- |
| `DATABASE_URL` (pooled)          | App queries at runtime            | Goes through Neon's PgBouncer connection pool |
| `DATABASE_URL_UNPOOLED` (direct) | Migrations (`npm run db:migrate`) | PgBouncer doesn't support DDL statements      |

---

## The data model — reading the ER diagram

The diagram in section 5 of [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md) is an **Entity-Relationship (ER) diagram**. Each box is a database table. The lines between them show how rows in one table relate to rows in another.

### How to read the crow's foot notation

The symbols at the ends of each line describe the cardinality — how many rows on each side can participate:

```text
||   exactly one (required)
o|   zero or one (optional)
||--o{   one-to-many: exactly one on the left, zero or many on the right
```

So `users ||--o{ carts : owns` reads as: **one user owns zero or many carts**. A user always exists, but may not have a cart yet.

The lines with a double tick (`||`) on one side mean "must have exactly one" — i.e. a foreign key that is `NOT NULL`. The circle (`o`) means "zero" — i.e. the foreign key is nullable or the child row might not exist.

### The tables and what they do

**`users`** — registered accounts. Has `email`, `password_hash`, `name`, `role` (`customer` or `admin`).

**`categories`** — product categories like "Paint" or "Hardware". Has `name`, `slug` (used in URLs like `/store/paint`). The self-referencing `parent` line means a category can optionally have a parent category (subcategories), though this isn't used in the UI yet.

**`products`** — the catalog. Belongs to one category. Has `price`, `stock`, `slug`, `image`, `on_sale`, and denormalized `rating_avg`/`rating_count`.

**`product_images`** — additional gallery images for a product. Each image belongs to one product (`product_id`). Currently unused by the UI — the table exists for future gallery support.

**`carts`** — one row per shopping session. Belongs to a user (signed-in) or has a `token` (guest). A user can have at most one cart; a guest is identified by a cookie.

**`cart_items`** — one row per product line in a cart. Belongs to one cart and one product. Stores `quantity` and `unit_price` — a **price snapshot** taken at the moment the item was added, so price changes don't affect existing carts.

**`orders`** — a placed order. Belongs to one user (`user_id NOT NULL` — guests can't order). Has `status` and `total`.

**`order_items`** — one row per product line in an order. Same idea as `cart_items` but permanent. Stores `unit_price` snapshot so order history always shows what you actually paid, even if the product price changes later.

**`reviews`** — one review per (product, user) pair. Rating 1–5 plus a text body. Writing a review triggers a recompute of `products.rating_avg` and `products.rating_count`.

### The key relationships explained

**`users` → `carts` → `cart_items` → `products`**
A user has a cart; the cart has lines; each line points to a product. Guest carts have the same structure but `carts.user_id` is null and `carts.token` holds the cookie value instead.

**`users` → `orders` → `order_items` → `products`**
When you check out, the cart becomes an order. `order_items` is a permanent copy of `cart_items` at checkout time — price snapshots and all. The cart is then cleared.

**`products` → `cart_items` and `products` → `order_items`**
A product can appear in many carts and many orders simultaneously. The `ON DELETE` behaviour differs: `cart_items` cascade-deletes (remove the product → remove it from carts), but `order_items` restricts (you can't delete a product that has ever been ordered — it would break order history).

**`categories` → `products`**
Every product belongs to exactly one category. Deleting a category is blocked if it has products (`ON DELETE restrict`).

**`users` → `reviews` and `products` → `reviews`**
A review links one user to one product. The one-review-per-user-per-product rule is enforced in application code (`upsertReview`), not by a database unique constraint.

### Upsert — insert or update in one operation

"Upsert" is a portmanteau of **update** + **insert**. It means: write this row — if it already exists update it, if it doesn't exist insert it. One operation instead of two.

In this project it comes up in two places:

**Adding an item to the cart** — when you click "Add to cart" for a product already in your cart, it shouldn't create a second row; it should increase the quantity on the existing one. `addItem` in [lib/cart.ts](lib/cart.ts) handles this manually: look up the existing `cart_items` row, update quantity if found, insert a new row if not.

**Submitting a review** — you can only have one review per product. `upsertReview` in [lib/reviews.ts](lib/reviews.ts) does the same pattern: look up an existing `reviews` row for this `(product_id, user_id)` pair, update it if found, insert if not.

Both are implemented as a lookup + conditional write rather than a single SQL `INSERT ... ON CONFLICT DO UPDATE` — same concept, just written in application code.

### Why `cart_items` and `order_items` both store `unit_price`

Both tables duplicate the product's price at the time of the action rather than reading `products.price` at display time. This means:

- If an admin raises the price of a drill, your cart still shows what you added it at.
- Your order history always shows what you actually paid, not the current price.

This is called a **price snapshot** — a deliberate denormalization to preserve historical accuracy.

---

## Part 3 — React & Next.js Patterns

## RSC payloads and minimal client JS

### The problem React originally had

In a classic React app, the server sends an empty `<div id="root"></div>` and a large JavaScript bundle. The browser downloads and runs all of that JS, then React renders the page in the browser. Until the JS loads, the user sees nothing.

### What React Server Components (RSC) change

With RSC, components can run **on the server** and send their output — already-rendered HTML plus a compact description of the component tree — to the browser. That description is the **RSC payload**: a binary-encoded stream that tells React exactly what the tree looks like without re-running any component logic in the browser.

The result: the page appears with real content immediately, and the browser only needs to download JS for the parts that are actually interactive.

### How this project uses it

In Homebuzz almost every component is a **Server Component** by default — no `"use client"` at the top, no `useState`, no `useEffect`. The home page is a good example:

```tsx
// app/page.tsx — Server Component (no "use client")
export default async function Home() {
  const popular = (await getProducts()).slice(0, 8); // runs on the server
  return (
    <>
      <section>...</section>
      <ProductGrid products={popular} />  {/* also a Server Component */}
    </>
  );
}
```

`getProducts()` queries Neon Postgres directly. None of that code ships to the browser. The browser receives the rendered HTML and the RSC payload describing the tree — but not the DB query logic, not the Drizzle imports, nothing from `lib/`.

### Client Components — only where interactivity is needed

When a component needs `onClick`, `useState`, or any browser API, it opts in with `"use client"`:

```tsx
// components/cart/AddToCartButton.tsx
"use client";

import { useState, useTransition } from "react";

export function AddToCartButton({ product }) {
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  // ...
}
```

This component's code **does** ship to the browser because it handles clicks and manages local state.

### Server and Client Components can be mixed in the same tree

`ProductCard` is a Server Component that renders `AddToCartButton` (a Client Component) inside it:

```tsx
// components/store/ProductCard.tsx — Server Component, no "use client"
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export function ProductCard({ product }) {
  return (
    <article>
      <Image src={product.image} ... />   {/* server-rendered */}
      <h3>{product.title}</h3>           {/* server-rendered */}
      <AddToCartButton product={product} /> {/* client JS, but only this button */}
    </article>
  );
}
```

The static parts (image, title, price) are rendered on the server and sent as HTML. Only the button's event-handling logic is sent as JavaScript. The browser hydrates just the button — not the whole card.

### What "minimal client JS" means in practice

In a traditional React SPA, the entire component tree including all data-fetching logic ships as JS. In this project, only the genuinely interactive components do:

| Component | Runs where | Ships JS? |
| --------- | ---------- | --------- |
| `app/page.tsx` | Server | No |
| `ProductCard` | Server | No |
| `AddToCartButton` | Client | Yes |
| `CartControls` | Client | Yes |
| `AuthForm` | Client | Yes |

The "minimal" refers to only these interactive leaves sending code to the browser — not the pages, layouts, or data-fetching logic that wraps them.

---

## Server Components vs Client Components

The RSC section above explains *why* this split exists. This section explains *how to tell them apart* and *how to decide* which one a new component should be.

### The default: Server Component

Any component file with **no** `"use client"` at the top is a Server Component. It runs only on the server — during a request or at build time — and its output is HTML + RSC payload. It never runs in the browser.

What that unlocks:

```tsx
// app/cart/page.tsx — Server Component
import { getCart } from "@/lib/cart";   // reads cookies, queries the DB
import { TAX_RATE } from "@/lib/orders";

export default async function CartPage() {
  const { items, subtotal } = await getCart(); // ← runs on server, direct DB access
  const tax = subtotal * TAX_RATE;
  // returns JSX — rendered to HTML before the browser sees anything
}
```

`getCart()` reads the session cookie and queries Neon Postgres. None of that is possible in a browser — and none of it ships as JS to the browser either.

### Opting in: Client Component

Adding `"use client"` at the top of a file makes it a Client Component. Its code is bundled and sent to the browser. Use this when you need:

- `onClick`, `onChange`, or any event handler
- `useState`, `useEffect`, `useTransition`, or any React hook
- Browser APIs (`window`, `document`, `localStorage`)

```tsx
// components/cart/CartControls.tsx
"use client";

import { useTransition } from "react";
import { setQtyAction, removeItemAction } from "@/app/actions/cart";

export function CartItemControls({ productId, quantity }) {
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <button onClick={() => startTransition(() => setQtyAction(productId, quantity - 1))}>−</button>
      <span>{quantity}</span>
      <button onClick={() => startTransition(() => setQtyAction(productId, quantity + 1))}>+</button>
    </div>
  );
}
```

This ships to the browser because it needs to respond to button clicks.

### The cart page shows both in one feature

`app/cart/page.tsx` and `components/cart/CartControls.tsx` are two halves of the same cart UI. Comparing them directly shows exactly where the line is drawn:

| | `app/cart/page.tsx` | `CartControls.tsx` |
| --- | --- | --- |
| Directive | *(none — Server Component)* | `"use client"` |
| Runs | On the server | In the browser |
| Ships JS? | No | Yes |
| Can query DB? | Yes (`getCart()`) | No |
| Can use hooks? | No | Yes (`useTransition`) |
| Can handle clicks? | No | Yes |
| **Responsibility** | Fetch data, render the list and summary | Handle qty changes, remove, checkout |

The Server Component fetches everything and renders the full page layout. It passes `productId` and `quantity` down as props to `CartItemControls`, which then owns the interactive parts. The Server Component itself never needs to know about clicks.

### The rule of thumb

Start with a Server Component. Add `"use client"` only when you hit something the server can't do — an event handler, a hook, or a browser API. Push `"use client"` as far down the tree as possible so the interactive leaf is small and the server-rendered wrapper stays large.

**Common mistake:** putting `"use client"` on a page or layout because one small part of it needs interactivity. Instead, extract that small part into its own Client Component and keep the page as a Server Component.

### What you cannot do across the boundary

One important constraint: a Client Component **cannot import a Server Component**. The reverse is fine — a Server Component can render a Client Component (as seen in `ProductCard` → `AddToCartButton`). But once you're inside `"use client"`, you can't pull server-only code back in.

This is why `lib/cart.ts` has `import "server-only"` at the top — it's a hard build-time error if you accidentally import it from a Client Component.

---

## Server Actions

Server Actions are async functions that run on the server but can be called directly from client-side React components — no `fetch`, no API route, no `POST /api/...` needed.

### The `"use server"` directive

Any file that starts with `"use server"` exports Server Actions. In this project they all live in [app/actions/](app/actions/):

```ts
// app/actions/cart.ts
"use server";

export async function addToCartAction(productId: string, quantity = 1) {
  await cart.addItem(Number(productId), quantity);
  await revalidatePath("/", "layout");
}
```

### How they're called from the client

A Client Component imports and calls the action like a regular async function:

```tsx
// components/cart/AddToCartButton.tsx (client component)
import { addToCartAction } from "@/app/actions/cart";

<button onClick={() => addToCartAction(productId)}>Add to cart</button>
```

Under the hood, Next.js compiles the action into an HTTP POST to a hidden endpoint and handles serialization. From your perspective it behaves like a function call.

### What they can do that client code can't

Because they run on the server, Server Actions have direct access to:

- The database (via Drizzle)
- Cookies (`cookies()` from `next/headers`)
- The session (`auth()` from Auth.js)
- `revalidatePath` to tell Next.js to re-render stale pages

None of these are available in client-side JavaScript.

### `revalidatePath` — why every cart action calls it

After mutating the database, the page's server-rendered output is stale. `revalidatePath("/", "layout")` tells Next.js to throw away the cached render of the root layout (which contains the header cart count) so the next request gets fresh data:

```ts
async function revalidate() {
  revalidatePath("/", "layout");
}
```

The `"layout"` argument means "invalidate the whole layout tree from `/` down", not just that specific page.

### The two-layer pattern

Actions in `app/actions/*` are thin — they validate input, call a `lib/*` function, and revalidate. The actual logic lives in `lib/*`:

```text
app/actions/cart.ts          ← thin: calls lib, revalidates
lib/cart.ts                  ← the real logic: DB queries, cookie handling
```

This keeps the domain logic testable in isolation and makes actions easy to read.

---

## Part 4 — Authentication

## Auth.js (NextAuth v5) — credential-based sessions

Auth.js is a library that handles the entire authentication plumbing: validating credentials, creating and signing sessions, managing cookies, and exposing the session to the rest of the app. Without it you'd write all of that yourself.

This project uses **one provider** (email + password) and **JWT sessions** — no OAuth, no database-stored sessions.

### The single config file

Everything lives in [auth.ts](auth.ts). It exports four things used throughout the app:

```ts
export const { handlers, signIn, signOut, auth } = NextAuth({ ... });
```

| Export | Used where | Purpose |
| --- | --- | --- |
| `handlers` | `app/api/auth/[...nextauth]/route.ts` | HTTP endpoints Auth.js needs |
| `signIn` | `components/auth/AuthForm.tsx` | Client-side sign-in call |
| `signOut` | `app/account/page.tsx` | Sign-out server action |
| `auth` | Server Components and Server Actions | Read the current session |

### The catch-all route handler

```ts
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

That's the entire file. Auth.js needs a few HTTP endpoints to work (`/api/auth/signin`, `/api/auth/session`, `/api/auth/csrf`, etc.). The `[...nextauth]` catch-all route hands all of those to `handlers` automatically.

### The Credentials provider — how login actually works

When the user submits the sign-in form, Auth.js calls the `authorize` function:

```ts
// auth.ts
Credentials({
  authorize: async (credentials) => {
    // 1. Validate shape with Zod
    const parsed = signInSchema.safeParse(credentials);
    if (!parsed.success) return null;

    // 2. Look up the user by email
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) return null;

    // 3. Compare the submitted password against the bcrypt hash
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;

    // 4. Return just what should go into the token (not the password hash)
    return { id: String(user.id), email: user.email, name: user.name, role: user.role };
  },
})
```

Returning `null` at any step tells Auth.js the login failed. Returning the user object tells it to create a session.

### JWT session strategy — what gets stored where

`session: { strategy: "jwt" }` means the session is stored in a **signed cookie** in the browser, not in a database table. No extra table needed; the cookie itself is the session.

The content of that cookie is controlled by two callbacks:

```ts
callbacks: {
  // Called when a token is created or refreshed.
  // `user` is only present on the first sign-in — copy what you need onto the token.
  jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }
    return token;
  },

  // Called every time session data is read.
  // Copy from the token onto the session object that the app sees.
  session({ session, token }) {
    session.user.id = token.id;
    session.user.role = token.role;
    return session;
  },
}
```

Without these callbacks, `id` and `role` would be lost — the default JWT only stores `name`, `email`, and `image`. The callbacks are the bridge that copies your custom fields through.

### Why type augmentation is needed

TypeScript doesn't know about `id` or `role` on the session. [types/next-auth.d.ts](types/next-auth.d.ts) extends Auth.js's own types:

```ts
declare module "next-auth" {
  interface Session {
    user: { id: string; role: "customer" | "admin" } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT { id: string; role: "customer" | "admin"; }
}
```

After this, `session.user.id` and `session.user.role` are typed everywhere in the app.

### Reading the session in Server Components and actions

```ts
import { auth } from "@/auth";

// In any Server Component or Server Action:
const session = await auth();
// session is null if not signed in
// session.user.id, session.user.role if signed in
```

`auth()` reads the signed cookie, verifies it, and returns the session object. This is what `lib/cart.ts`, `lib/orders.ts`, and route guards all call.

### Signup is NOT Auth.js

Signup is a regular Server Action in [app/actions/auth.ts](app/actions/auth.ts) — `registerUser`. It validates with Zod, checks for duplicate emails, hashes the password with bcrypt, and inserts the user row. Auth.js is not involved.

After `registerUser` succeeds, `AuthForm` immediately calls `signIn("credentials", ...)` to log the new user in, so there's no separate "now log in" step from the user's perspective.

### Route guarding — no middleware

There is no `middleware.ts`. Guards are enforced per-surface on the server:

```ts
// app/admin/layout.tsx
if (!(await isAdmin())) redirect("/");

// lib/admin.ts
export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}
```

Every admin action and the admin layout both call `isAdmin()`. Account pages call `auth()` directly and redirect to `/signin` if the result is null. There's no single central gatekeeping point — each protected surface checks itself.
