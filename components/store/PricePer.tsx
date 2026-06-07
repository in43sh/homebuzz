import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

export function PricePer({
  price,
  unit,
  className,
}: {
  price: number;
  unit: string;
  className?: string;
}) {
  return (
    <p className={cn("flex items-baseline gap-1", className)}>
      <span className="text-xl font-black text-ink-900">
        {formatPrice(price)}
      </span>
      <span className="text-sm text-gray-500">/ {unit}</span>
    </p>
  );
}
