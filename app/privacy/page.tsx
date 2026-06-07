import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 text-heading font-black text-ink-900">
        Privacy Policy
      </h1>
      <div className="space-y-4 text-gray-500">
        <p>
          Homebuzz respects your privacy. This placeholder page outlines how the
          store would collect, use and protect your information.
        </p>
        <p>
          We collect only what we need to fulfill orders and improve the store:
          account details, order history and basic usage analytics.
        </p>
        <p>
          We never sell your data. You can request deletion of your account and
          associated data at any time.
        </p>
      </div>
    </div>
  );
}
