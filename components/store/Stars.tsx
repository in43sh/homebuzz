import { cn } from "@/lib/utils";

function Star({ fill }: { fill: number }) {
  // fill: 0..1 fraction of the star that is filled
  const pct = Math.round(fill * 100);
  return (
    <span className="relative inline-block h-4 w-4" aria-hidden="true">
      <span className="absolute inset-0 text-gray-200">★</span>
      <span
        className="absolute inset-0 overflow-hidden text-brand"
        style={{ width: `${pct}%` }}
      >
        ★
      </span>
    </span>
  );
}

export function Stars({
  rating,
  count,
  className,
}: {
  rating: number;
  count?: number;
  className?: string;
}) {
  const stars = Array.from({ length: 5 }, (_, i) =>
    Math.max(0, Math.min(1, rating - i)),
  );
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="flex leading-none">
        {stars.map((fill, i) => (
          <Star key={i} fill={fill} />
        ))}
      </span>
      <span className="sr-only">{rating.toFixed(1)} out of 5</span>
      {count !== undefined && (
        <span className="text-xs text-gray-500">({count})</span>
      )}
    </div>
  );
}
