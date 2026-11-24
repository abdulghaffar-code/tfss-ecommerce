import Link from "next/link";
import type { ReactNode } from "react";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-flame-400">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-steel-400">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function AdminActionLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={
        variant === "primary"
          ? "inline-flex h-10 items-center rounded-lg bg-flame-500 px-4 font-display text-xs font-semibold text-ink-950 transition hover:bg-flame-400"
          : "inline-flex h-10 items-center rounded-lg border border-white/15 px-4 text-xs font-semibold text-steel-300 transition hover:border-white/35 hover:text-white"
      }
    >
      {children}
    </Link>
  );
}
