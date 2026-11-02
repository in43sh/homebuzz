import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-ink-900",
        "focus-visible:border-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
