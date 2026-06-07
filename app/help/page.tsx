import type { Metadata } from "next";

export const metadata: Metadata = { title: "Help center" };

const faqs = [
  {
    q: "How fast is delivery?",
    a: "Most in-stock items ship the same day and arrive within 2–5 business days. Delivery is fast, efficient and free.",
  },
  {
    q: "Can I return an item?",
    a: "Yes — unused items can be returned within 90 days with proof of purchase.",
  },
  {
    q: "Do you offer financing?",
    a: "Financing options are available at checkout on qualifying orders.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-heading font-black text-ink-900">Help center</h1>
      <dl className="space-y-6">
        {faqs.map((f) => (
          <div key={f.q}>
            <dt className="font-bold text-ink-900">{f.q}</dt>
            <dd className="mt-1 text-gray-500">{f.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
