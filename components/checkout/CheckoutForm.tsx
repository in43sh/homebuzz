"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkoutSchema,
  type CheckoutInput,
  type CheckoutValues,
} from "@/lib/validation";
import { placeOrderAction } from "@/app/actions/orders";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DELIVERY_METHODS, computeTotals } from "@/lib/pricing";
import { US_STATES } from "@/lib/us-states";
import { formatPrice } from "@/lib/utils";

type Item = {
  productId: string;
  title: string;
  image: string;
  quantity: number;
  lineTotal: number;
};

// Taller than the shared Input (36px) so every checkout field is a 44px target.
const inputClass = "h-11";

export function CheckoutForm({
  defaultName,
  subtotal,
  items,
}: {
  defaultName: string;
  subtotal: number;
  items: Item[];
}) {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<CheckoutInput, unknown, CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: defaultName,
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      deliveryMethod: "standard",
    },
  });
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const method = useWatch({ control, name: "deliveryMethod" });
  const totals = computeTotals(subtotal, method);
  const errorCount = Object.keys(errors).length;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    // Redirects to the order page on success, so it only returns on a problem.
    const result = await placeOrderAction(values);
    const names = Object.keys(result.fieldErrors) as (keyof CheckoutInput)[];
    for (const name of names) {
      setError(name, { message: result.fieldErrors[name] });
    }
    setFormError("We could not place your order. Check the fields marked below.");
    if (names[0]) setFocus(names[0]);
  });

  const e = errors as Record<string, { message?: string } | undefined>;
  const describe = (name: string) => (e[name] ? `${name}-error` : undefined);

  return (
    <form onSubmit={onSubmit} noValidate>
      {(errorCount > 0 || formError) && (
        <p
          role="alert"
          className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError ??
            `${errorCount} ${errorCount === 1 ? "field needs" : "fields need"} your attention. They are marked below.`}
        </p>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          <section aria-labelledby="shipping-heading">
            <h2
              id="shipping-heading"
              className="mb-4 text-lg font-black text-ink-900"
            >
              Shipping address
            </h2>
            <div className="space-y-4">
              <Field id="name" label="Full name" error={e.name?.message}>
                <Input
                  className={inputClass}
                  autoComplete="shipping name"
                  aria-invalid={!!e.name}
                  aria-describedby={describe("name")}
                  {...register("name")}
                />
              </Field>
              <Field id="line1" label="Street address" error={e.line1?.message}>
                <Input
                  className={inputClass}
                  autoComplete="shipping address-line1"
                  aria-invalid={!!e.line1}
                  aria-describedby={describe("line1")}
                  {...register("line1")}
                />
              </Field>
              <Field
                id="line2"
                label="Apartment, suite, etc. (optional)"
                error={e.line2?.message}
              >
                <Input
                  className={inputClass}
                  autoComplete="shipping address-line2"
                  aria-invalid={!!e.line2}
                  aria-describedby={describe("line2")}
                  {...register("line2")}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-[1fr_8rem_9rem]">
                <Field id="city" label="City" error={e.city?.message}>
                  <Input
                    className={inputClass}
                    autoComplete="shipping address-level2"
                    aria-invalid={!!e.city}
                    aria-describedby={describe("city")}
                    {...register("city")}
                  />
                </Field>
                <Field id="state" label="State" error={e.state?.message}>
                  <Select
                    autoComplete="shipping address-level1"
                    aria-invalid={!!e.state}
                    aria-describedby={describe("state")}
                    {...register("state")}
                  >
                    <option value="">Select</option>
                    {US_STATES.map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field id="zip" label="ZIP code" error={e.zip?.message}>
                  <Input
                    className={inputClass}
                    inputMode="numeric"
                    autoComplete="shipping postal-code"
                    aria-invalid={!!e.zip}
                    aria-describedby={describe("zip")}
                    {...register("zip")}
                  />
                </Field>
              </div>
              <Field
                id="phone"
                label="Phone (optional)"
                hint="Only used by the carrier to reach you about delivery."
                error={e.phone?.message}
              >
                <Input
                  className={inputClass}
                  type="tel"
                  autoComplete="shipping tel"
                  aria-invalid={!!e.phone}
                  aria-describedby={describe("phone")}
                  {...register("phone")}
                />
              </Field>
              <p className="text-sm text-gray-500">
                We ship to addresses in the United States.
              </p>
            </div>
          </section>

          <fieldset>
            <legend className="mb-4 text-lg font-black text-ink-900">
              Delivery method
            </legend>
            <div className="space-y-3">
              {(Object.keys(DELIVERY_METHODS) as (keyof typeof DELIVERY_METHODS)[]).map(
                (key) => {
                  const m = DELIVERY_METHODS[key];
                  return (
                    <label
                      key={key}
                      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-4 has-[:checked]:border-ink-900 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink-900"
                    >
                      <input
                        type="radio"
                        value={key}
                        className="h-5 w-5 accent-ink-900"
                        {...register("deliveryMethod")}
                      />
                      <span className="flex-1">
                        <span className="block font-bold text-ink-900">
                          {m.label}
                        </span>
                        <span className="block text-sm text-gray-500">
                          {m.detail}
                        </span>
                      </span>
                      <span className="font-black text-ink-900">
                        {m.cents === 0 ? "Free" : formatPrice(m.cents / 100)}
                      </span>
                    </label>
                  );
                },
              )}
            </div>
          </fieldset>
        </div>

        <aside className="h-fit rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-lg font-black text-ink-900">Order summary</h2>
          <ul className="divide-y divide-gray-200 border-y border-gray-200">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3 py-3 text-sm">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-200">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-ink-900">{item.title}</p>
                  <p className="text-gray-500">Qty {item.quantity}</p>
                </div>
                <p className="font-black text-ink-900">
                  {formatPrice(item.lineTotal)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 text-sm" aria-live="polite">
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal</dt>
              <dd className="font-medium">{formatPrice(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Shipping</dt>
              <dd className="font-medium">
                {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Tax</dt>
              <dd className="font-medium">{formatPrice(totals.tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
              <dt className="font-black text-ink-900">Total</dt>
              <dd className="font-black text-ink-900">
                {formatPrice(totals.total)}
              </dd>
            </div>
          </dl>

          <Button
            type="submit"
            variant="warning"
            className="mt-6 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing order…" : "Place order"}
          </Button>
          <p className="mt-3 text-center text-xs text-gray-500">
            Demo store — no payment is taken.
          </p>
          <Link
            href="/cart"
            className="mt-3 flex min-h-11 items-center justify-center text-sm text-gray-500 underline hover:text-ink-900"
          >
            Back to cart
          </Link>
        </aside>
      </div>
    </form>
  );
}
