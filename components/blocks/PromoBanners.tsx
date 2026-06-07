import Image from "next/image";

export function PromoBanners() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Discount promo */}
        <div className="flex items-center justify-between overflow-hidden rounded-lg bg-slate-700 p-6 text-white">
          <div>
            <p className="text-2xl font-black">
              15% off <span className="text-brand">select</span>
            </p>
            <p className="text-2xl font-black">Dyson Vacuums</p>
            <p className="mt-2 text-sm text-gray-200">Free delivery. Today only.</p>
          </div>
          <Image
            src="/banners/vacuum.png"
            alt="Dyson vacuum"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Financing promo */}
        <div className="flex flex-col justify-center rounded-lg bg-brand p-6 text-ink-900">
          <p className="text-2xl font-black">Financing Available</p>
          <p className="mt-2 max-w-sm text-sm font-medium">
            Pay over time on qualifying orders. Apply at checkout in minutes.
          </p>
        </div>
      </div>
    </section>
  );
}
