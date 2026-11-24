import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  image = "/hero/slider-01.webp",
  imageAlt = "Industrial fall-protection equipment",
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  image?: string;
  imageAlt?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="shell py-8 lg:py-14">
      <div className="grid min-h-[70svh] overflow-hidden rounded-2xl border border-white/10 bg-ink-900 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[560px] lg:block">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/10" />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <span className="flex size-10 items-center justify-center rounded-lg border border-white/20 bg-ink-950/50 backdrop-blur">
              <ShieldCheck className="size-5 text-flame-500" />
            </span>
            <p className="mt-5 max-w-sm font-display text-2xl font-semibold leading-snug text-white">
              Safety equipment is a decision, not a commodity.
            </p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-steel-300">
              Total Fire &amp; Safety Solution · Karachi · Since 1992
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-steel-500 transition hover:text-white"
          >
            <ArrowLeft className="size-3" /> Back to store
          </Link>
          <p className="eyebrow mt-8">{eyebrow}</p>
          <h1 className="mt-3 text-3xl leading-[1.02] tracking-tightest sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-steel-400">{subtitle}</p>

          <div className="mt-7">{children}</div>
          <div className="mt-6 text-xs text-steel-500">{footer}</div>
        </div>
      </div>
    </div>
  );
}
