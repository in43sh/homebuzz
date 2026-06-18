# Homebuzz — Questions

A running log of things that weren't clear, and what turned out to be the answer. Add a new entry whenever something clicks.

Format:

```
## Q: <the thing you didn't understand>
**Confused by:** <what made it confusing>
**Answer:** <what you figured out>
**Where to look:** <file or section that shows it>
```

---

## Q: Why does `resolveCartId` take a `create` flag?

**Confused by:** Why not always create a cart if one doesn't exist?

**Answer:** Creating a cart may set a cookie (for guest carts). Setting cookies during a server render is forbidden by Next.js — it throws. The `create` flag is only passed `true` inside Server Actions and Route Handlers, never during a render. Passing `false` during reads means "find the cart if it exists, return null if not — don't create anything."

**Where to look:** [lib/cart.ts](lib/cart.ts) `resolveCartId`

---

## Q: Why does the checkout `UPDATE` use `WHERE stock >= qty` instead of checking stock first?

**Confused by:** There's no `SELECT stock FROM products WHERE id = ?` before decrementing. How does it know there's enough stock?

**Answer:** The check and the decrement are the same operation. `UPDATE products SET stock = stock - qty WHERE id = ? AND stock >= qty` — if stock is insufficient, zero rows are updated. The `.returning()` result is empty, which signals the shortage. This is atomic: two concurrent checkouts for the last unit both run this `UPDATE`, but Postgres row-level locking ensures only one succeeds. A separate `SELECT` then `UPDATE` would have a race window between the two.

**Where to look:** [lib/orders.ts](lib/orders.ts) `placeOrder`

---
