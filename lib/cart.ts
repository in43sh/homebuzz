import "server-only";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { carts, cartItems, products } from "@/db/schema";
import { auth } from "@/auth";

const COOKIE = "cart_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type CartLine = {
  productId: string;
  slug: string;
  title: string;
  unit: string;
  image: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type CartView = {
  items: CartLine[];
  count: number;
  subtotal: number;
};

const EMPTY: CartView = { items: [], count: 0, subtotal: 0 };

/**
 * Find the active cart id. With `create`, lazily creates a cart — for a signed-in
 * user keyed by userId, otherwise a guest cart keyed by an httpOnly cookie token.
 * `create` must only be true inside a Server Action / Route Handler (it may set a
 * cookie), never during a render.
 */
async function resolveCartId(create: boolean): Promise<number | null> {
  const session = await auth();

  if (session?.user?.id) {
    const userId = Number(session.user.id);
    const [existing] = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);
    if (existing) return existing.id;
    if (!create) return null;
    const [created] = await db
      .insert(carts)
      .values({ userId })
      .returning({ id: carts.id });
    return created.id;
  }

  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    const [existing] = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.token, token))
      .limit(1);
    if (existing) return existing.id;
  }
  if (!create) return null;

  const newToken = randomUUID();
  const [created] = await db
    .insert(carts)
    .values({ token: newToken })
    .returning({ id: carts.id });
  jar.set(COOKIE, newToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return created.id;
}

async function viewForCart(cartId: number): Promise<CartView> {
  const rows = await db
    .select({
      productId: products.id,
      slug: products.slug,
      title: products.title,
      unit: products.unit,
      image: products.image,
      unitPrice: cartItems.unitPrice,
      quantity: cartItems.quantity,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cartId))
    .orderBy(cartItems.id);

  const items: CartLine[] = rows.map((r) => {
    const price = Number(r.unitPrice);
    return {
      productId: String(r.productId),
      slug: r.slug,
      title: r.title,
      unit: r.unit,
      image: r.image,
      price,
      quantity: r.quantity,
      lineTotal: price * r.quantity,
    };
  });

  return {
    items,
    count: items.reduce((n, i) => n + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + i.lineTotal, 0),
  };
}

export async function getCart(): Promise<CartView> {
  const cartId = await resolveCartId(false);
  return cartId ? viewForCart(cartId) : EMPTY;
}

export async function addItem(productId: number, quantity = 1): Promise<void> {
  if (!Number.isInteger(quantity) || quantity < 1) return;

  const cartId = await resolveCartId(true);
  if (!cartId) return;

  const [product] = await db
    .select({ price: products.price })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (!product) return;

  const [existing] = await db
    .select({ id: cartItems.id, quantity: cartItems.quantity })
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))
    .limit(1);

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({
      cartId,
      productId,
      quantity,
      unitPrice: product.price,
    });
  }
}

export async function setItemQuantity(
  productId: number,
  quantity: number,
): Promise<void> {
  const cartId = await resolveCartId(false);
  if (!cartId) return;

  if (!Number.isInteger(quantity) || quantity <= 0) {
    await removeItem(productId);
    return;
  }
  await db
    .update(cartItems)
    .set({ quantity })
    .where(
      and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)),
    );
}

export async function removeItem(productId: number): Promise<void> {
  const cartId = await resolveCartId(false);
  if (!cartId) return;
  await db
    .delete(cartItems)
    .where(
      and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)),
    );
}

export async function clearCart(): Promise<void> {
  const cartId = await resolveCartId(false);
  if (!cartId) return;
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}

/**
 * On login, fold a guest cart (by cookie token) into the user's cart, summing
 * quantities for shared products, then drop the guest cart + cookie.
 */
export async function mergeGuestCartIntoUser(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return;

  const [guestCart] = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(carts.token, token))
    .limit(1);
  jar.delete(COOKIE);
  if (!guestCart) return;

  const userId = Number(session.user.id);
  let [userCart] = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(carts.userId, userId))
    .limit(1);
  if (!userCart) {
    [userCart] = await db
      .insert(carts)
      .values({ userId })
      .returning({ id: carts.id });
  }

  if (userCart.id === guestCart.id) return;

  const guestItems = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.cartId, guestCart.id));

  for (const item of guestItems) {
    const [existing] = await db
      .select({ id: cartItems.id, quantity: cartItems.quantity })
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, userCart.id),
          eq(cartItems.productId, item.productId),
        ),
      )
      .limit(1);
    if (existing) {
      await db
        .update(cartItems)
        .set({ quantity: existing.quantity + item.quantity })
        .where(eq(cartItems.id, existing.id));
    } else {
      await db.insert(cartItems).values({
        cartId: userCart.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      });
    }
  }

  await db.delete(carts).where(eq(carts.id, guestCart.id));
}
