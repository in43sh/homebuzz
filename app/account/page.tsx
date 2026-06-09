import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Your account" };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const { name, email, role } = session.user;
  // Orders land in Slice 3 (checkout). Empty for now.
  const orders: { id: string; date: string; total: string; status: string }[] =
    [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-heading font-black text-ink-900">Your account</h1>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button type="submit" variant="outline" size="small">
            Sign out
          </Button>
        </form>
      </div>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        {/* Profile */}
        <section className="h-fit rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-lg font-black text-ink-900">Profile</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-ink-900">{name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-ink-900">{email}</dd>
            </div>
            {role === "admin" && (
              <div>
                <dt className="text-gray-500">Role</dt>
                <dd className="font-medium text-ink-900">Admin</dd>
              </div>
            )}
          </dl>
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
                  <Link
                    href={`/account/orders/${o.id}`}
                    className="font-bold text-ink-900 hover:text-slate-700"
                  >
                    Order #{o.id}
                  </Link>
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
