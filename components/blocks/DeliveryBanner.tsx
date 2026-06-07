import Image from "next/image";

export function DeliveryBanner() {
  return (
    <section className="overflow-hidden bg-brand">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-12 text-center">
        <h2 className="text-4xl font-black tracking-tight text-white md:text-display">
          WE DELIVER
        </h2>
        <Image
          src="/banners/we-deliver-car.png"
          alt="Delivery van"
          width={420}
          height={180}
          className="my-4 h-auto w-full max-w-md object-contain"
        />
        <p className="text-xl font-black text-ink-900">Fast. Efficient. Free.</p>
      </div>
    </section>
  );
}
