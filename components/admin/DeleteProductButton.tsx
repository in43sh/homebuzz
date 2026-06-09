"use client";

import { useTransition } from "react";
import { deleteProductAction } from "@/app/actions/admin";

export function DeleteProductButton({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={pending}
      className="text-sm text-red-600 underline hover:text-red-800 disabled:opacity-50"
      onClick={() => {
        if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
        startTransition(async () => {
          const res = await deleteProductAction(id);
          if (res && !res.ok) alert(res.error);
        });
      }}
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
