# Homebuzz — Walkthroughs

Narrative traces of features end-to-end. Use these to see how the layers connect in practice. Flows match the entries in `docs/system-graph/data.json`.

---

## Checkout — from "Checkout" button to order in the database

**Files touched:** `CartFooter` → `placeOrderAction` → `placeOrder` → DB transaction → `clearCart` → redirect

### 1. The button (browser)

`CartFooter` is a Client Component inside `app/cart/page.tsx`:

```tsx
// components/cart/CartControls.tsx
<Button onClick={() => startTransition(async () => placeOrderAction())}>
  Checkout
</Button>
```

### 2. The action (server)

```ts
// app/actions/orders.ts
export async function placeOrderAction() {
  const result = await placeOrder();
  if (!result.ok) {
    if (result.reason === "unauthenticated") redirect("/signin");
    if (result.reason === "out_of_stock") redirect("/cart?error=stock");
    return;
  }
  revalidatePath("/", "layout"); // clears header cart count
  redirect(`/account/orders/${result.id}`);
}
```

Three possible outcomes: not logged in → signin page, stock failure → cart page with an error banner, success → order detail page.

### 3. `placeOrder` — the transaction (server)

Everything that matters happens inside a single database transaction:

```ts
// lib/orders.ts
orderId = await db.transaction(async (tx) => {
  // Step 1: decrement stock for each line — atomically
  for (const i of cart.items) {
    const updated = await tx
      .update(products)
      .set({ stock: sql`${products.stock} - ${i.quantity}` })
      .where(and(
        eq(products.id, Number(i.productId)),
        gte(products.stock, i.quantity),   // ← only update if enough stock remains
      ))
      .returning({ id: products.id });

    if (updated.length === 0) short.push(i.title); // this line is short
  }
  if (short.length > 0) throw new OutOfStockError(short); // rolls back everything

  // Step 2: insert the order row
  const [order] = await tx.insert(orders)
    .values({ userId, total: total.toFixed(2), status: "paid" })
    .returning({ id: orders.id });

  // Step 3: snapshot the cart lines into order_items
  await tx.insert(orderItems).values(
    cart.items.map((i) => ({
      orderId: order.id,
      productId: Number(i.productId),
      quantity: i.quantity,
      unitPrice: i.price.toFixed(2), // price from cart_items, not current product price
    }))
  );

  return order.id;
});
```

The key is step 1: `WHERE stock >= quantity` means the `UPDATE` only succeeds if there's enough stock. If two users check out the last unit simultaneously, only one `UPDATE` will match — the other gets `updated.length === 0` and the whole transaction rolls back. No overselling is possible.

### 4. After the transaction

```ts
await clearCart(); // deletes cart_items rows (the carts row stays)
return { ok: true, id: orderId };
```

The cart is cleared only after the transaction commits. If the transaction rolled back, `clearCart` is never called and the cart remains intact.

### Checkout — end to end

```text
Browser
  └─ CartFooter.onClick
       └─ placeOrderAction()             [Server Action]
            └─ placeOrder()             [lib/orders.ts]
                 ├─ auth()              → verify session
                 ├─ getCart()           → read current cart items
                 └─ db.transaction()
                      ├─ UPDATE products SET stock = stock - qty WHERE stock >= qty  (× N lines)
                      ├─ INSERT orders (status = 'paid', total = subtotal × 1.08)
                      └─ INSERT order_items (price snapshots from cart)
            ├─ clearCart()             → DELETE cart_items
            └─ redirect /account/orders/:id
```

---

## Browse / search catalog

**Files touched:** `app/store/page.tsx` → `getProducts` → Drizzle → Neon → `ProductGrid`

### 1. The request (browser)

The shopper hits `/store` (all products) or `/store?q=drill` (search). Both land on the same RSC — there is no client-side fetch, no loading spinner:

```tsx
// app/store/page.tsx
export default async function StorePage({ searchParams }) {
  const { q } = await searchParams;
  const products = await getProducts({ q });
  // ...
  return <ProductGrid products={products} />;
}
```

Category pages at `/store/[category]` follow the same pattern, passing `{ category }` instead of `{ q }`.

### 2. `getProducts` — the query (server)

```ts
// lib/products.ts
export async function getProducts({ category, q }: ProductQuery = {}) {
  const filters = [];
  if (category) filters.push(eq(categories.slug, category));
  if (q) {
    filters.push(
      or(ilike(products.title, `%${q}%`), ilike(products.description, `%${q}%`)),
    );
  }
  const rows = await baseQuery()
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(products.onSale), products.id);
  return rows.map(mapRow);
}
```

`ilike` is case-insensitive `LIKE`. Results are sorted so sale items always appear first. The base query is an `INNER JOIN` on categories so every product row carries its `categorySlug`.

### 3. The connection (server → Neon)

Drizzle uses the pooled Neon connection string with `prepare: false` (required for PgBouncer transaction mode). The query runs, Neon returns rows, Drizzle maps them to `Product[]`.

### 4. Render (server → browser)

The RSC renders `<ProductGrid products={...} />` on the server and streams the HTML to the browser. No JavaScript is needed to display the listing — the page is fully server-rendered.

### Browse — end to end

```text
Browser
  └─ GET /store?q=…                  [RSC — app/store/page.tsx]
       └─ getProducts({ category, q })   [lib/products.ts]
            └─ SELECT products JOIN categories WHERE ilike / category
                 └─ Neon (pooled conn, prepare:false)
            └─ Product[]
       └─ ProductGrid → rendered HTML → browser
```

---

## Add to cart (guest)

**Files touched:** `AddToCartButton` → `addToCartAction` → `addItem` → `resolveCartId` → Neon → `revalidatePath` → `Header`

### 1. The button click (browser)

The user clicks "Add to cart" on a product card. `AddToCartButton` is a Client Component (`"use client"`), so this handler runs in the browser:

```tsx
// components/cart/AddToCartButton.tsx
onClick={() =>
  startTransition(async () => {
    await addToCartAction(product.id, quantity);
    setAdded(true);
  })
}
```

`startTransition` marks the update as non-urgent and gives access to `isPending` for the "Adding…" button state. `addToCartAction` looks like a function call but crosses the network — Next.js sends a `POST` to a hidden URL.

### 2. The Server Action (server)

```ts
// app/actions/cart.ts
export async function addToCartAction(productId: string, quantity = 1) {
  await cart.addItem(Number(productId), quantity);
  await revalidatePath("/", "layout");
}
```

Thin on purpose: validates nothing, delegates everything to `lib/cart.ts`, then tells Next.js the layout is stale so the header cart count re-renders.

### 3. `addItem` — the real logic (server)

```ts
// lib/cart.ts
export async function addItem(productId: number, quantity = 1): Promise<void> {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) return;

  const cartId = await resolveCartId(true); // find or create the cart
  // ...
```

First it validates the quantity — not a trust issue with the UI, but Server Actions are callable directly with arbitrary arguments, so the guard is required here.

### 4. `resolveCartId` — who owns this cart?

This is the core of the cart system. It answers: "which cart row belongs to the current request?"

```ts
// lib/cart.ts
async function resolveCartId(create: boolean): Promise<number | null> {
  const session = await auth();

  if (session?.user?.id) {
    // Signed-in: cart is keyed by user_id
    const [existing] = await db.select({ id: carts.id })
      .from(carts).where(eq(carts.userId, userId)).limit(1);
    if (existing) return existing.id;
    if (!create) return null;
    const [created] = await db.insert(carts).values({ userId }).returning({ id: carts.id });
    return created.id;
  }

  // Guest: cart is keyed by the cart_token cookie
  const token = jar.get("cart_token")?.value;
  if (token) { /* look up existing guest cart */ }
  if (!create) return null;

  // No cookie yet — create a new guest cart and set the cookie
  const newToken = randomUUID();
  const [created] = await db.insert(carts).values({ token: newToken }).returning({ id: carts.id });
  jar.set("cart_token", newToken, { httpOnly: true, sameSite: "lax", maxAge: 30 * 24 * 60 * 60 });
  return created.id;
}
```

The `create: true` flag is what allows a new cart and cookie to be created here. It's only passed `true` inside Server Actions — never during a render, because setting cookies during rendering is forbidden.

### 5. Back in `addItem` — price snapshot and upsert

```ts
// Look up the current price
const [product] = await db.select({ price: products.price })
  .from(products).where(eq(products.id, productId)).limit(1);

// Check if this product is already in the cart
const [existing] = await db.select({ id: cartItems.id, quantity: cartItems.quantity })
  .from(cartItems)
  .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))
  .limit(1);

if (existing) {
  // Already in cart — increase quantity, cap at 999
  await db.update(cartItems).set({ quantity: Math.min(existing.quantity + quantity, 999) })
    .where(eq(cartItems.id, existing.id));
} else {
  // New line — insert with price snapshot
  await db.insert(cartItems).values({ cartId, productId, quantity, unitPrice: product.price });
}
```

`product.price` is copied into `unit_price` right now. If the admin changes the price later, this cart item is unaffected.

### 6. `revalidatePath` — header re-renders

Back in the action, `revalidatePath("/", "layout")` marks the root layout as stale. The next time the browser re-renders (which React does immediately after the transition), it fetches a fresh server render of the layout. The `Header` component calls `getCart()` on the server and shows the updated count.

### Add to cart — end to end

```text
Browser
  └─ AddToCartButton.onClick
       └─ addToCartAction()          [Server Action — POST over network]
            ├─ addItem()             [lib/cart.ts]
            │    ├─ resolveCartId()  → finds/creates carts row + sets cookie
            │    ├─ SELECT products  → price snapshot
            │    └─ INSERT/UPDATE cart_items
            └─ revalidatePath("/", "layout")
                 └─ Header re-renders → getCart() → updated count
```

---

## Sign up

**Files touched:** `AuthForm` → `registerUser` → Neon → `signIn` (hands off to signin-merge flow)

### 1. The form (browser)

`AuthForm` is a Client Component. On submit in signup mode, it calls `registerUser` first, then hands off to `signIn`:

```ts
// components/auth/AuthForm.tsx
if (isSignUp) {
  const result = await registerUser(values); // Server Action — creates the user row
  if (!result.ok) { setFormError(result.error); return; }
}

// continues into the sign-in flow...
const res = await signIn("credentials", { email, password, redirect: false });
```

### 2. `registerUser` (server)

```ts
// app/actions/auth.ts
const passwordHash = await bcrypt.hash(password, 10);
await db.insert(users).values({ name, email, passwordHash });
```

Hashes the password with bcrypt (cost 10), inserts the row. If two concurrent signups with the same email both pass the duplicate check, the unique index on `users.email` catches the second one (SQLSTATE `23505`).

### 3. Hand-off to sign-in

Once `{ ok: true }` comes back, the client calls `signIn("credentials", ...)` exactly like a normal sign-in. From here the signup and signin flows are identical — see the next walkthrough.

### Sign up — end to end

```text
Browser
  └─ AuthForm.onSubmit (mode=signup)
       └─ registerUser(values)       [Server Action — app/actions/auth.ts]
            ├─ bcrypt.hash(password, 10)
            └─ INSERT users          [Neon — unique index on email]
       └─ { ok: true }
       └─ signIn("credentials", …)  [hands off to sign-in + merge flow]
```

---

## Sign in + merge guest cart

**Files touched:** `AuthForm` → `signIn` → `authorize` → JWT callbacks → cookie → `mergeGuestCartAction`

### 1. The form (browser)

`AuthForm` calls `signIn` from `next-auth/react`. This is not a Server Action — it POSTs directly to the Auth.js route:

```ts
// components/auth/AuthForm.tsx
const res = await signIn("credentials", { email, password, redirect: false });
if (res?.error) { setFormError("Invalid email or password"); return; }

await mergeGuestCartAction(); // fold guest cart into the new session's cart
router.push("/account");
```

### 2. `signIn` → `authorize` (server, inside Auth.js)

`signIn("credentials", ...)` posts to `/api/auth/signin/credentials`, which Auth.js handles. It calls `authorize`:

```ts
// auth.ts
authorize: async (credentials) => {
  const parsed = signInSchema.safeParse(credentials); // validates + normalises email
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const valid = await bcrypt.compare(password, user.passwordHash);
  return { id: String(user.id), email, name: user.name, role: user.role };
}
```

Returns the user object (without the password hash) or `null` on any failure.

### 3. JWT callbacks → signed cookie

Auth.js runs the `jwt` callback, embedding `id` and `role` into the token. It then signs the token and sets it as an `httpOnly` cookie. Every subsequent request includes that cookie; `auth()` reads and verifies it to return the session.

### 4. `mergeGuestCartAction` — guest cart folded in

After sign-in, any items added as a guest are merged into the now-authenticated user's cart. This is called **explicitly from the client** after `signIn` resolves — it is not an Auth.js callback. If you ever add a second login path (e.g. OAuth), you must call `mergeGuestCartAction` there too or guest carts will silently strand.

### Sign in + merge — end to end

```text
Browser
  └─ AuthForm.onSubmit
       └─ POST signIn("credentials")  [next-auth/react → /api/auth/signin/credentials]
            └─ authorize()            [auth.ts]
                 ├─ SELECT users WHERE email  [Neon — users_email_idx]
                 └─ bcrypt.compare
            └─ JWT signed → httpOnly session cookie
       └─ mergeGuestCartAction()      [Server Action — app/actions/cart.ts]
            └─ mergeGuestCartIntoUser()   [lib/cart.ts]
                 └─ fold guest cart_items → user cart, drop guest cart + cookie
       └─ router.push("/account")
```

---

## Submit a review

**Files touched:** `ReviewForm` → `submitReviewAction` → `upsertReview` → purchase gate → Neon → `revalidatePath`

### 1. The form (browser)

`ReviewForm` is a Client Component on the product page. It only renders if `canReview` returns `true` (purchase gate is checked server-side during render):

```tsx
// components/reviews/ReviewForm.tsx
startTransition(async () => {
  const res = await submitReviewAction(productId, slug, values);
  if (!res.ok) setError(res.error);
  else setSubmitted(true);
});
```

### 2. The action (server)

```ts
// app/actions/reviews.ts
export async function submitReviewAction(productId, slug, values) {
  const parsed = reviewSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please pick a rating from 1 to 5" };

  const result = await upsertReview(productId, parsed.data.rating, parsed.data.body ?? "");
  if (!result.ok) {
    return {
      ok: false,
      error: result.reason === "not_purchased"
        ? "You can only review products you've ordered"
        : "You must be signed in to review",
    };
  }

  revalidatePath(`/product/${slug}`);
  return { ok: true };
}
```

### 3. `upsertReview` — gate, upsert, recompute (server)

```ts
// lib/reviews.ts
export async function upsertReview(productId, rating, body) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, reason: "unauthenticated" };
  const userId = Number(session.user.id);

  if (!(await hasPurchased(userId, productId))) {
    return { ok: false, reason: "not_purchased" };
  }

  // INSERT or UPDATE — one review per (user, product)
  if (existing) {
    await db.update(reviews).set({ rating, body }).where(eq(reviews.id, existing.id));
  } else {
    await db.insert(reviews).values({ productId, userId, rating, body });
  }

  await recomputeProductRating(productId);
  return { ok: true };
}
```

`hasPurchased` joins `order_items → orders` to confirm the user has a completed order containing this product. `recomputeProductRating` does an aggregate `AVG` + `COUNT` on the reviews table and writes `ratingAvg` / `ratingCount` back to the product row.

### 4. Page refreshes

`revalidatePath("/product/[slug]")` marks the product page stale. The next render shows the new review and updated star rating.

### Review — end to end

```text
Browser
  └─ ReviewForm.onSubmit
       └─ submitReviewAction(productId, slug, values)   [Server Action]
            └─ upsertReview()                           [lib/reviews.ts]
                 ├─ auth()                → require session
                 ├─ hasPurchased()        → JOIN order_items + orders
                 ├─ INSERT/UPDATE reviews
                 └─ recomputeProductRating() → UPDATE products.ratingAvg / ratingCount
            └─ revalidatePath("/product/[slug]")
                 └─ product page re-renders with new review + rating
```

---

## Admin saves a product

**Files touched:** `ProductForm` → `saveProductAction` → `isAdmin` → `createProduct` / `updateProduct` → Neon → revalidate → redirect

### 1. The form (browser)

`ProductForm` is a Client Component used for both create and edit. It uses `react-hook-form` + Zod for client-side validation before the action is even called:

```tsx
// components/admin/ProductForm.tsx
const onSubmit = handleSubmit((values) => {
  startTransition(async () => {
    const res = await saveProductAction(id, values); // id=null for new products
    if (res && !res.ok) setFormError(res.error);
  });
});
```

`id` is `null` for a new product and the numeric DB id for an edit.

### 2. The action (server)

```ts
// app/actions/admin.ts
export async function saveProductAction(id: number | null, values: unknown) {
  if (!(await isAdmin())) redirect("/");  // hard stop for non-admins

  const parsed = productSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  if (id) {
    await updateProduct(id, parsed.data);
  } else {
    await createProduct(parsed.data);
  }

  revalidateCatalog(); // /admin/products + /store + /
  redirect("/admin/products");
}
```

### 3. `isAdmin` — role check (server)

```ts
// lib/admin.ts
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "admin";
}
```

`auth()` reads and verifies the JWT cookie. Non-admins get an immediate redirect to `/` before any DB write is attempted.

### 4. `createProduct` / `updateProduct` (server)

Both helpers generate a URL-safe slug from the title via `slugify`. On update, the existing id is passed to `uniqueSlug` so the product can keep its slug if the title is unchanged. The insert/update writes to `products` using Drizzle.

### Admin save — end to end

```text
Browser
  └─ ProductForm.onSubmit
       └─ saveProductAction(id, values)   [Server Action — app/actions/admin.ts]
            ├─ isAdmin()                  → auth() → role check → redirect / if not admin
            ├─ productSchema.safeParse()  → validate
            └─ createProduct() or updateProduct()   [lib/admin.ts]
                 ├─ uniqueSlug()          → slugify + collision check
                 └─ INSERT / UPDATE products   [Neon]
            ├─ revalidatePath × 3        → /admin/products, /store, /
            └─ redirect /admin/products
```

---

## Seed the database

**Files touched:** `db/seed.ts` → Drizzle → Neon

### 1. Run the script

```sh
npm run db:seed
# or: npx tsx db/seed.ts
```

This is a one-off developer script, not part of the request path.

### 2. Clear in FK-safe order

```ts
// db/seed.ts
await db.delete(orderItemsTable);
await db.delete(ordersTable);
await db.delete(cartItemsTable);
await db.delete(cartsTable);
await db.delete(reviewsTable);
await db.delete(productsTable);
await db.delete(categoriesTable);
await db.delete(usersTable);
```

The deletes must go from child to parent. `order_items` references `orders`, `products`, and `users` with `ON DELETE RESTRICT`, so it must be deleted first. Deleting in any other order causes a foreign-key violation.

### 3. Insert seed data

```ts
// Two demo users (password: "password1234")
const passwordHash = await bcrypt.hash("password1234", 10);
await db.insert(usersTable).values([
  { name: "Demo Customer", email: "demo@homebuzz.test", passwordHash },
  { name: "Admin", email: "admin@homebuzz.test", passwordHash, role: "admin" },
]);

// Categories from lib/categories.ts
const inserted = await db.insert(categoriesTable).values(...).returning({ id, slug });

// Products from lib/mock-products.ts — look up category id by slug
const rows = productSeed.map((p) => ({ ...p, categoryId: idBySlug.get(p.categorySlug) }));
await db.insert(productsTable).values(rows);
```

Categories are inserted first so that each product row can reference the correct `categoryId` via the `idBySlug` map. Products come last because reviews and cart items depend on them, and those tables were already cleared.

### Seed — end to end

```text
Developer
  └─ npm run db:seed                  [db/seed.ts]
       └─ DELETE order_items, orders, cart_items, carts, reviews, products, categories, users
       └─ INSERT users (2 — demo + admin, bcrypt hashed)
       └─ INSERT categories (from lib/categories.ts)
       └─ INSERT products (from lib/mock-products.ts, categoryId resolved by slug)
       └─ process.exit(0)
```
