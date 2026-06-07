import { Button } from "@/components/ui/Button";

export function ItemsStrip() {
  return (
    <section className="bg-brand">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row">
        <p className="text-lg font-black text-ink-900">
          More than 2 million items available in store
        </p>
        <Button href="/store" variant="warning" size="small">
          Browse all
        </Button>
      </div>
    </section>
  );
}
