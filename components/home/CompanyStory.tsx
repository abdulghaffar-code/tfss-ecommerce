import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function CompanyStory({ ownerImageUrl }: { ownerImageUrl: string | null }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div className="relative">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-ink-850 sm:aspect-[5/4] lg:aspect-[4/5]">
          {ownerImageUrl ? (
            <Image
              src={ownerImageUrl}
              alt="Mr. Muhammad Rizwan Siddique, founder of Total Fire & Safety Solution"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-top"
            />
          ) : null}
          <span className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-flame-400">
              Founder
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-white">
              Mr. Muhammad Rizwan Siddique
            </p>
          </div>
        </div>
        <div className="absolute -right-3 -top-3 hidden rounded-lg border border-white/15 bg-ink-950/90 px-4 py-3 backdrop-blur sm:block">
          <p className="font-display text-2xl font-semibold text-flame-500">1992</p>
          <p className="text-[9px] uppercase tracking-[0.16em] text-steel-400">
            Established
          </p>
        </div>
      </div>

      <div>
        <p className="eyebrow flex items-center gap-3">
          <span className="h-px w-8 bg-flame-500" aria-hidden />
          Our story
        </p>
        <h2 className="mt-4 text-3xl leading-[1.04] tracking-tightest sm:text-4xl lg:text-[2.9rem]">
          A family trade in
          <br />
          <span className="text-steel-400">keeping people protected.</span>
        </h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-steel-300">
          <p>
            Total Fire &amp; Safety Solution was established in Karachi in 1992
            by Mr. Muhammad Rizwan Siddique. It grew out of a family trade in
            protective equipment that began with Pak Gloves in 1969 — a
            heritage of handling the products, knowing the materials and
            understanding what industrial work demands.
          </p>
          <p>
            From our Nicol Road storefront we supply personal protective
            equipment, fall protection, fire safety and site safety supplies to
            contractors, plants and maintenance teams across Karachi. The
            counter is still the heart of the business: you can inspect the
            product, ask the person behind it, and leave with what fits the job.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-5">
          {[
            ["1969", "Pak Gloves heritage"],
            ["1992", "Company established"],
            ["Nicol Rd", "Karachi showroom"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-lg font-semibold text-white">
                {value}
              </p>
              <p className="mt-1 text-[10px] leading-snug text-steel-500">
                {label}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/about"
          className="mt-7 inline-flex items-center gap-2 border-b border-white/25 pb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-flame-500 hover:text-flame-300"
        >
          Read the full history <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
