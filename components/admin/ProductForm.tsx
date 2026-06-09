"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchema,
  type ProductValues,
  type ProductInput,
} from "@/lib/validation";
import { saveProductAction } from "@/app/actions/admin";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type CategoryOption = { id: number; name: string };

export function ProductForm({
  id,
  categories,
  defaults,
}: {
  id: number | null;
  categories: CategoryOption[];
  defaults?: Partial<ProductValues>;
}) {
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: defaults?.title ?? "",
      description: defaults?.description ?? "",
      price: defaults?.price ?? 0,
      unit: defaults?.unit ?? "each",
      categoryId: defaults?.categoryId ?? categories[0]?.id,
      image: defaults?.image ?? "",
      stock: defaults?.stock ?? 0,
      onSale: defaults?.onSale ?? false,
    },
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    startTransition(async () => {
      const res = await saveProductAction(id, values);
      if (res && !res.ok) setFormError(res.error);
    });
  });

  const e = errors as Record<string, { message?: string } | undefined>;

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      {formError && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </p>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-900">Title</span>
        <Input {...register("title")} />
        {e.title?.message && (
          <span className="text-sm text-red-600">{e.title.message}</span>
        )}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-900">
          Description
        </span>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-900">
            Price (USD)
          </span>
          <Input type="number" step="0.01" {...register("price")} />
          {e.price?.message && (
            <span className="text-sm text-red-600">{e.price.message}</span>
          )}
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-900">Unit</span>
          <Input {...register("unit")} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-900">
            Category
          </span>
          <select
            {...register("categoryId")}
            className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-900">Stock</span>
          <Input type="number" {...register("stock")} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-900">
          Image path
        </span>
        <Input placeholder="/products/drill.png" {...register("image")} />
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("onSale")} className="h-4 w-4" />
        <span className="text-sm font-bold text-ink-900">On sale</span>
      </label>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : id ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}
