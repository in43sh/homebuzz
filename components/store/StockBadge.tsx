import { stockStatus } from "@/lib/stock";
import { cn } from "@/lib/utils";

const TONE = {
  // All three pass 4.5:1 on white.
  in: "text-green-700",
  low: "text-amber-800",
  out: "text-red-700",
} as const;

export function StockBadge({
  stock,
  hideWhenInStock = false,
  className,
}: {
  stock: number;
  /** Product cards only call out low and out-of-stock, to stay uncluttered. */
  hideWhenInStock?: boolean;
  className?: string;
}) {
  const { kind, label } = stockStatus(stock);
  if (hideWhenInStock && kind === "in") return null;
  return (
    <p className={cn("text-sm font-bold", TONE[kind], className)}>{label}</p>
  );
}
