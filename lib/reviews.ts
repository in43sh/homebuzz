import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { reviews, users, products, orders, orderItems } from "@/db/schema";
import { auth } from "@/auth";

/** True if the user has an order containing this product. */
async function hasPurchased(
  userId: number,
  productId: number,
): Promise<boolean> {
  const [row] = await db
    .select({ id: orderItems.id })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(and(eq(orders.userId, userId), eq(orderItems.productId, productId)))
    .limit(1);
  return Boolean(row);
}

/** Whether the current session user is allowed to review this product. */
export async function canReview(productId: number): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;
  return hasPurchased(Number(session.user.id), productId);
}

export type ReviewView = {
  id: number;
  author: string;
  rating: number;
  body: string;
  createdAt: Date;
};

export async function getReviews(productId: number): Promise<ReviewView[]> {
  const rows = await db
    .select({
      id: reviews.id,
      author: users.name,
      rating: reviews.rating,
      body: reviews.body,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));
  return rows;
}

async function recomputeProductRating(productId: number): Promise<void> {
  const [agg] = await db
    .select({
      avg: sql<string>`coalesce(avg(${reviews.rating}), 0)`,
      count: sql<number>`count(*)::int`,
    })
    .from(reviews)
    .where(eq(reviews.productId, productId));

  await db
    .update(products)
    .set({
      ratingAvg: Number(agg.avg).toFixed(1),
      ratingCount: agg.count,
    })
    .where(eq(products.id, productId));
}

/** Add or update the signed-in user's review (one per product), then refresh the
 * product's aggregate rating. Only verified purchasers may review. */
export async function upsertReview(
  productId: number,
  rating: number,
  body: string,
): Promise<{ ok: true } | { ok: false; reason: "unauthenticated" | "not_purchased" }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, reason: "unauthenticated" };
  const userId = Number(session.user.id);

  if (!(await hasPurchased(userId, productId))) {
    return { ok: false, reason: "not_purchased" };
  }

  const [existing] = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.userId, userId)))
    .limit(1);

  if (existing) {
    await db
      .update(reviews)
      .set({ rating, body })
      .where(eq(reviews.id, existing.id));
  } else {
    await db.insert(reviews).values({ productId, userId, rating, body });
  }

  await recomputeProductRating(productId);
  return { ok: true };
}
