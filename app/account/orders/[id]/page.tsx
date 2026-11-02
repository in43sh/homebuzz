import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { authHref } from "@/lib/redirect";
import { auth } from "@/auth";
import { getOrder } from "@/lib/orders";
import { DELIVERY_METHODS } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Order" };

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const { id } = await params;
  const { placed } = await searchParams;
  const session = await auth();
  if (!session?.user) redirect(authHref("/signin", `/account/orders/${id}`));
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) notFound();

  const order = await getOrder(orderId);
  if (!order) notFound();

  const justPlaced = placed === "1";
  const delivery = DELIVERY_METHODS[order.deliveryMethod];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/account"
        className="text-sm text-gray-500 underline hover:text-ink-900"
      >
        ← Back to account
      </Link>

      {justPlaced && (
        <div
          role="status"
          className="mt-4 rounded-lg border border-green-700 bg-green-50 p-5"
        >
          <p className="text-lg font-black text-ink-900">
            Thank you. Your order is placed.
          </p>
          <p className="mt-1 text-sm text-ink-900">
            Order #{order.id} is saved to your account. Demo store — no payment
            has been taken, and nothing will ship.
          </p>
        </div>
      )}

      <div className="mt-4 mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-heading font-black text-ink-900">
          Order #{order.id}
        </h1>
        <span className="rounded bg-gray-200 px-3 py-1 text-xs font-bold uppercase text-ink-900">
          {order.status}
        </span>
      </div>
      <div className="mb-8 space-y-1 text-sm text-gray-500">
        <p>Placed {order.createdAt.toLocaleString()}</p>
        {order.status === "pending" && !justPlaced && (
          <p>Demo store — no payment has been taken for this order.</p>
        )}
      </div>

      <ul className="divide-y divide-gray-200 border-y border-gray-200">
        {order.items.map((item) => (
          <li key={item.productId} className="flex gap-4 py-4">
            <Link
              href={`/product/${item.slug}`}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-200"
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="80px"
                  className="object-contain p-2"
                />
              )}
            </Link>
            <div className="flex flex-1 flex-col">
              <Link
                href={`/product/${item.slug}`}
                className="font-bold text-ink-900 hover:text-slate-700"
              >
                {item.title}
              </Link>
              <span className="text-sm text-gray-500">
                {formatPrice(item.unitPrice)} × {item.quantity}
              </span>
            </div>
            <div className="text-right font-black text-ink-900">
              {formatPrice(item.lineTotal)}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        <section aria-labelledby="delivery-heading" className="text-sm">
          <h2
            id="delivery-heading"
            className="mb-2 text-base font-black text-ink-900"
          >
            Delivery
          </h2>
          {order.address ? (
            <address className="not-italic text-ink-900">
              <p className="font-bold">{order.address.name}</p>
              <p>{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>
                {order.address.city}, {order.address.state} {order.address.zip}
              </p>
              {order.address.phone && <p>{order.address.phone}</p>}
            </address>
          ) : (
            <p className="text-gray-500">
              No shipping address was saved for this order.
            </p>
          )}
          {order.address && (
            <p className="mt-2 text-gray-500">
              {delivery.label} delivery, {delivery.detail}
            </p>
          )}
        </section>

      <dl className="ml-auto w-full max-w-xs space-y-2 self-start text-sm sm:justify-self-end">
        <div className="flex justify-between">
          <dt className="text-gray-500">Subtotal</dt>
          <dd className="font-medium">{formatPrice(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Shipping</dt>
          <dd className="font-medium">
            {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Tax</dt>
          <dd className="font-medium">{formatPrice(order.tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
          <dt className="font-black text-ink-900">Total</dt>
          <dd className="font-black text-ink-900">{formatPrice(order.total)}</dd>
        </div>
      </dl>
      </div>
    </div>
  );
}
