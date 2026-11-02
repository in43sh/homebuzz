import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCart } from "@/lib/cart";
import { authHref } from "@/lib/redirect";
import { cartLineProblem } from "@/lib/stock";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect(authHref("/signin", "/checkout", "checkout"));

  const { items, subtotal } = await getCart();
  if (items.length === 0) redirect("/cart");
  // The cart page explains exactly which lines are short, so send them there.
  if (items.some((i) => cartLineProblem(i.quantity, i.stock))) redirect("/cart");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-heading font-black text-ink-900">Checkout</h1>
      <CheckoutForm
        defaultName={session.user.name ?? ""}
        subtotal={subtotal}
        items={items.map((i) => ({
          productId: i.productId,
          title: i.title,
          image: i.image,
          quantity: i.quantity,
          lineTotal: i.lineTotal,
        }))}
      />
    </div>
  );
}
