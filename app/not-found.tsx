import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center">
      <h1 className="mb-4 text-heading font-black text-ink-900">
        We can&apos;t find that page
      </h1>
      <p className="mb-8 text-slate-700">
        The link may be broken, or the page may have moved. If you were looking
        for an order, check your account.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/store">Shop the store</Button>
        <Button href="/account" variant="outline">
          Your account
        </Button>
      </div>
    </div>
  );
}
