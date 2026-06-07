import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "warning";
type Size = "regular" | "small";

const base =
  "inline-flex items-center justify-center rounded-md font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  default: "bg-brand text-ink-900 hover:brightness-95",
  outline:
    "border border-ink-900 bg-transparent text-ink-900 hover:bg-ink-900 hover:text-white",
  warning: "bg-ink-900 text-white hover:bg-slate-700",
};

const sizes: Record<Size, string> = {
  regular: "h-12 px-6 text-base",
  small: "h-9 px-4 text-sm",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
};

const classesFor = (variant: Variant, size: Size, className?: string) =>
  cn(base, variants[variant], sizes[size], className);

export function Button(props: ButtonAsButton | ButtonAsLink) {
  if ("href" in props && props.href !== undefined) {
    const { variant = "default", size = "regular", className, children, href } =
      props;
    return (
      <Link href={href} className={classesFor(variant, size, className)}>
        {children}
      </Link>
    );
  }

  const { variant = "default", size = "regular", className, children, ...rest } =
    props;
  return (
    <button className={classesFor(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
