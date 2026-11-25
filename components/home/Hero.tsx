import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { HeroVisual } from "@/components/three/HeroVisual";
import showcaseImages from "@/lib/showcase.json";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:64px_64px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 top-10 h-[560px] w-[560px] rounded-full bg-flame-500/[0.12] blur-[110px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-radial-flame lg:block"
        aria-hidden
      />

      <div className="shell relative grid min-h-[calc(100svh-106px)] items-center gap-4 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:py-0">
        <div className="relative z-10 max-w-[640px]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-flame-500" aria-hidden />
              Karachi · Industrial safety since 1992
            </p>
            <span className="hidden items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-steel-500 sm:flex">
              <Sparkles className="size-3 text-safety-500" />
              Family heritage since 1969
            </span>
          </div>

          <h1 className="mt-6 text-[clamp(2.7rem,6.4vw,5.1rem)] font-semibold leading-[0.94] tracking-tightest text-white">
            Safety for work
            <br />
            that <span className="text-flame-500">cannot fail.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-steel-300 sm:text-base">
            Fall protection, head-to-toe PPE and site safety equipment,
            selected for industrial crews and supplied from our Nicol Road
            storefront for more than three decades.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="group inline-flex h-[52px] items-center justify-center gap-3 rounded-lg bg-flame-500 px-6 font-display text-sm font-semibold text-ink-950 transition hover:bg-flame-400"
            >
              Explore the catalogue
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/[0.03] px-6 font-display text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/[0.06]"
            >
              Talk to a specialist
              <ArrowUpRight className="size-4 text-steel-400" />
            </Link>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-white/10 border-y border-white/10">
            {[
              ["1992", "Established in Karachi"],
              ["14", "Industrial categories"],
              ["One roof", "PPE, fire & site safety"],
            ].map(([value, label]) => (
              <div key={label} className="px-4 py-4 first:pl-0">
                <dt className="font-display text-lg font-semibold text-white">
                  {value}
                </dt>
                <dd className="mt-1 text-[10px] leading-snug text-steel-500">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative h-[380px] sm:h-[460px] lg:h-[min(72svh,680px)]">
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[26vw] font-bold leading-none text-outline opacity-[0.35] lg:text-[15vw]"
          >
            TFSS
          </span>
          <HeroVisual images={showcaseImages} />

          <div className="absolute left-0 top-4 hidden items-center gap-2 rounded-lg border border-white/10 bg-ink-950/70 px-3 py-2.5 backdrop-blur-md sm:flex">
            <ShieldCheck className="size-4 text-flame-500" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                Genuine industrial supply
              </p>
              <p className="text-[9px] text-steel-500">
                Nicol Road, Karachi
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[9px] uppercase tracking-[0.24em] text-steel-600 lg:flex">
        <span className="h-8 w-px bg-gradient-to-b from-transparent via-steel-600 to-transparent" />
        Scroll
      </div>
    </section>
  );
}
