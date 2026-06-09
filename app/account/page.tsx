import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Your account" };

// Placeholder profile. Real data arrives with Auth.js + the database (Phase 2),
// where this becomes a server component reading the signed-in user and orders.
const profile = {
  name: "Guest user",
  email: "guest@example.com",
};

const orders: {
  id: string;
  date: string;
  total: string;
  status: string;
}[] = [];

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-heading font-black text-ink-900">Your account</h1>
        <Button href="/signin" variant="outline" size="small">
          Sign in
        </Button>
      </div>

      <div className="mb-8 rounded-md border border-gray-200 bg-gray-200/40 p-4 text-sm text-ink-900">
        You&apos;re browsing as a guest. Authentication is wired up in Phase 2 —
        this page will then show your real profile and orders.
      </div>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        {/* Profile */}
        <section className="h-fit rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-lg font-black text-ink-900">Profile</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-ink-900">{profile.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-ink-900">{profile.email}</dd>
            </div>
          </dl>
          <Button
            href="/signin"
            variant="outline"
            size="small"
            className="mt-6 w-full"
          >
            Edit profile
          </Button>
        </section>

        {/* Order history */}
        <section>
          <h2 className="mb-4 text-lg font-black text-ink-900">Order history</h2>
          {orders.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-10 text-center">
              <p className="mb-4 text-gray-500">No orders yet.</p>
              <Button href="/store" size="small">
                Start shopping
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
              {orders.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <div>
                    <Link
                      href={`/account/orders/${o.id}`}
                      className="font-bold text-ink-900 hover:text-slate-700"
                    >
                      Order #{o.id}
                    </Link>
                    <p className="text-gray-500">{o.date}</p>
                  </div>
                  <span className="text-gray-500">{o.status}</span>
                  <span className="font-black text-ink-900">{o.total}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
