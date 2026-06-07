import Image from "next/image";

const tutorials = [
  { title: "Gardening tips & tricks", image: "/tutorials/grow.jpg" },
  { title: "DIY Furniture Renovation", image: "/tutorials/build.jpg" },
  { title: "Picking perfect paint", image: "/tutorials/paint.jpg" },
  { title: "Painting 101", image: "/tutorials/decorate.jpeg" },
];

export function Tutorials() {
  return (
    <section className="bg-gray-200/50">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-center text-heading font-black text-ink-900">
          Inspire Yourself with Tutorials
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {tutorials.map((t) => (
            <a
              key={t.title}
              href="#"
              className="group relative block h-48 overflow-hidden rounded-lg"
            >
              <Image
                src={t.image}
                alt={t.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
              <span className="absolute bottom-4 left-4 max-w-[60%] text-xl font-black leading-tight text-white">
                {t.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
