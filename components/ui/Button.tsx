import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "light" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-display font-semibold tracking-tight transition-colors disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-flame-500 text-ink-950 hover:bg-flame-400 shadow-[0_10px_30px_-12px_rgba(255,90,31,0.7)]",
  secondary:
    "border border-white/20 bg-white/[0.03] text-white hover:border-white/40 hover:bg-white/[0.07]",
  light: "bg-white text-ink-950 hover:bg-steel-100",
  ghost: "text-steel-300 hover:bg-white/[0.06] hover:text-white",
  danger: "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-[3.25rem] px-7 text-[15px] sm:h-14",
};

export function buttonStyles(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string
) {
  return cn(base, variants[variant], sizes[size], className);
}

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: string;
  }) {
  if (href) {
    const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    if (external) {
      return (
        <a
          href={href}
          className={buttonStyles(variant, size, className)}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={buttonStyles(variant, size, className)}>
        {children}
      </Link>
    );
  }
  return (
    <button className={buttonStyles(variant, size, className)} {...props}>
      {children}
    </button>
  );
}
