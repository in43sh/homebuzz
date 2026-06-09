import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { auth } from "@/auth";
import { getCart, clearCart } from "@/lib/cart";

export const TAX_RATE = 0.08;

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

/** Turn the current user's cart into an order, then empty the cart. */
export async function placeOrder(): Promise<
  { ok: true; id: number } | { ok: false; reason: "unauthenticated" | "empty" }
> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, reason: "unauthenticated" };

  const cart = await getCart();
  if (cart.items.length === 0) return { ok: false, reason: "empty" };

  const userId = Number(session.user.id);
  const total = cart.subtotal * (1 + TAX_RATE);

  const [order] = await db
    .insert(orders)
    .values({ userId, total: total.toFixed(2), status: "paid" })
    .returning({ id: orders.id });

  await db.insert(orderItems).values(
    cart.items.map((i) => ({
      orderId: order.id,
      productId: Number(i.productId),
      quantity: i.quantity,
      unitPrice: i.price.toFixed(2),
    })),
  );

  await clearCart();
  return { ok: true, id: order.id };
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
