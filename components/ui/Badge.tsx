import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded bg-brand px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-ink-900",
        className,
      )}
    >
      {children}
    </span>
  );
}
