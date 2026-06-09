import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getOrder, TAX_RATE } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Order" };

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) notFound();

  const order = await getOrder(orderId);
  if (!order) notFound();

  const subtotal = order.total / (1 + TAX_RATE);
  const tax = order.total - subtotal;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/account"
        className="text-sm text-gray-500 underline hover:text-ink-900"
      >
        ← Back to account
      </Link>

      <div className="mt-4 mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-heading font-black text-ink-900">
          Order #{order.id}
        </h1>
        <span className="rounded bg-gray-200 px-3 py-1 text-xs font-bold uppercase text-ink-900">
          {order.status}
        </span>
      </div>
      <p className="mb-8 text-sm text-gray-500">
        Placed {order.createdAt.toLocaleString()}
      </p>

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

      <dl className="ml-auto mt-6 max-w-xs space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Subtotal</dt>
          <dd className="font-medium">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Tax</dt>
          <dd className="font-medium">{formatPrice(tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
          <dt className="font-black text-ink-900">Total</dt>
          <dd className="font-black text-ink-900">{formatPrice(order.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
