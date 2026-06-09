import "server-only";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { auth } from "@/auth";
import { getCart, clearCart } from "@/lib/cart";

export const TAX_RATE = 0.08;

/** Thrown inside the checkout transaction to roll it back when stock is short. */
class OutOfStockError extends Error {
  constructor(readonly items: string[]) {
    super("out_of_stock");
  }
}

export type OrderSummary = {
  id: number;
  status: string;
  total: number;
  createdAt: Date;
  itemCount: number;
};

export type OrderLine = {
  productId: string;
  slug: string;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderDetail = OrderSummary & { items: OrderLine[] };

/**
 * Turn the current user's cart into an order, then empty the cart. Stock is
 * decremented atomically inside a transaction; if any line outruns its stock
 * the whole order rolls back and the cart is left intact.
 */
export async function placeOrder(): Promise<
  | { ok: true; id: number }
  | { ok: false; reason: "unauthenticated" | "empty" }
  | { ok: false; reason: "out_of_stock"; items: string[] }
> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, reason: "unauthenticated" };

  const cart = await getCart();
  if (cart.items.length === 0) return { ok: false, reason: "empty" };

  const userId = Number(session.user.id);
  const total = cart.subtotal * (1 + TAX_RATE);

  let orderId: number;
  try {
    orderId = await db.transaction(async (tx) => {
      // Decrement stock atomically: the row only updates while enough remains,
      // so concurrent checkouts can't oversell.
      const short: string[] = [];
      for (const i of cart.items) {
        const updated = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${i.quantity}` })
          .where(
            and(
              eq(products.id, Number(i.productId)),
              gte(products.stock, i.quantity),
            ),
          )
          .returning({ id: products.id });
        if (updated.length === 0) short.push(i.title);
      }
      if (short.length > 0) throw new OutOfStockError(short);

      const [order] = await tx
        .insert(orders)
        .values({ userId, total: total.toFixed(2), status: "paid" })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(
        cart.items.map((i) => ({
          orderId: order.id,
          productId: Number(i.productId),
          quantity: i.quantity,
          unitPrice: i.price.toFixed(2),
        })),
      );

      return order.id;
    });
  } catch (e) {
    if (e instanceof OutOfStockError) {
      return { ok: false, reason: "out_of_stock", items: e.items };
    }
    throw e;
  }

  await clearCart();
  return { ok: true, id: orderId };
}

export async function getOrders(): Promise<OrderSummary[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  const userId = Number(session.user.id);

  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  const summaries: OrderSummary[] = [];
  for (const o of rows) {
    const items = await db
      .select({ quantity: orderItems.quantity })
      .from(orderItems)
      .where(eq(orderItems.orderId, o.id));
    summaries.push({
      id: o.id,
      status: o.status,
      total: Number(o.total),
      createdAt: o.createdAt,
      itemCount: items.reduce((n, i) => n + i.quantity, 0),
    });
  }
  return summaries;
}

export async function getOrder(id: number): Promise<OrderDetail | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = Number(session.user.id);

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.userId, userId)))
    .limit(1);
  if (!order) return null;

  const rows = await db
    .select({
      productId: products.id,
      slug: products.slug,
      title: products.title,
      image: products.image,
      unitPrice: orderItems.unitPrice,
      quantity: orderItems.quantity,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id))
    .orderBy(orderItems.id);

  const items: OrderLine[] = rows.map((r) => {
    const unitPrice = Number(r.unitPrice);
    return {
      productId: String(r.productId),
      slug: r.slug,
      title: r.title,
      image: r.image,
      unitPrice,
      quantity: r.quantity,
      lineTotal: unitPrice * r.quantity,
    };
  });

  return {
    id: order.id,
    status: order.status,
    total: Number(order.total),
    createdAt: order.createdAt,
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    items,
  };
}
