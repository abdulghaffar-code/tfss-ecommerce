import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <p className="eyebrow flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-flame-500/70" aria-hidden />
          {eyebrow}
        </p>
        <h2 className="mt-4 text-3xl leading-[1.02] tracking-tightest sm:text-4xl lg:text-[2.9rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-steel-400">
            {description}
          </p>
        ) : null}
      </div>
      {href && linkLabel ? (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-2 border-b border-white/20 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-flame-500"
        >
          {linkLabel}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
