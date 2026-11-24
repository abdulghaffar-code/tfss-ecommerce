import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Factory, ShieldCheck, Users } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { getSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About the company",
  description:
    "Total Fire & Safety Solution has supplied industrial safety equipment from Nicol Road, Karachi since 1992, with a family heritage in safety-wear manufacturing since Pak Gloves in 1969.",
  path: "/about",
});

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="Since 1992 · Karachi"
        title="A safety house built on a family trade."
        description="Total Fire & Safety Solution was established in 1992 by Mr. Muhammad Rizwan Siddique, carrying forward a family involvement in protective equipment that began with Pak Gloves in 1969."
        image="/hero/slider-02.webp"
        crumbs={[{ label: "About" }]}
      />

      <div className="shell">
        <div className="grid gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-16">
          <div>
            <p className="eyebrow">Our company</p>
            <h2 className="mt-4 text-3xl leading-[1.04] tracking-tightest sm:text-4xl">
              From a manufacturing heritage
              <br />
              <span className="text-steel-400">to a general safety counter.</span>
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-steel-300">
              <p>
                The family&apos;s involvement in safety wear began with Pak Gloves
                Manufacturing Company, established in 1969 by Haji Muhammad
                Siddique. That background in manufacturing and materials shaped
                the way the next generation understood protective equipment — not
                as a catalogue of SKUs, but as a set of decisions about fit,
                material and hazard.
              </p>
              <p>
                In 1992, Mr. Muhammad Rizwan Siddique established Total Fire &amp;
                Safety Solution in Karachi. Over the years the business broadened
                from safety wear into the wider equipment an engineering or
                workshop setup actually needs: fire fighting, welding, hardware,
                hydraulic, electrical, industrial and janitorial supplies.
              </p>
              <p>
                The result is a general order supplier with a specialist&apos;s eye
                on safety — still run from the same family counter at Adnan
                Center, Nicol Road.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/history"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 font-display text-sm font-semibold text-ink-950 transition hover:bg-steel-100"
              >
                Read the history <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center rounded-lg border border-white/20 px-5 font-display text-sm font-semibold text-white transition hover:border-white/40"
              >
                Visit the counter
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
              {settings.ownerImageUrl ? (
                <Image
                  src={settings.ownerImageUrl}
                  alt="Mr. Muhammad Rizwan Siddique, founder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-top"
                />
              ) : null}
              <span className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-flame-400">
                  Founder
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-white">
                  Mr. Muhammad Rizwan Siddique
                </p>
                <p className="mt-1 text-[11px] text-steel-400">
                  Established Total Fire &amp; Safety Solution, 1992
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="border-y border-white/[0.08] bg-ink-900/40">
        <div className="shell grid gap-px overflow-hidden py-12 sm:grid-cols-3 lg:py-16">
          {[
            {
              icon: Factory,
              title: "Manufacturing roots",
              body: "Pak Gloves, 1969 — a family background in safety-wear manufacturing and materials.",
            },
            {
              icon: ShieldCheck,
              title: "Safety at the centre",
              body: "PPE and fire safety remain the core of the business, supported by general industrial supply.",
            },
            {
              icon: Users,
              title: "Family-run counter",
              body: "The next generation works alongside the founder at Nicol Road, Karachi.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-ink-950 p-6 lg:p-8">
              <item.icon className="size-5 text-flame-500" />
              <h3 className="mt-6 font-display text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-400">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="shell py-12 lg:py-16">
        <div className="rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-10">
          <p className="eyebrow">What that means for buyers</p>
          <h2 className="mt-4 max-w-3xl text-2xl leading-snug tracking-tight text-white sm:text-3xl">
            We would rather help you choose correctly than sell you the fastest
            available box.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-steel-400">
            Tell us the site, the hazard and the quantity. We will confirm what is
            genuinely available, what needs to be sourced and what documentation
            can be provided for the exact product. Certifications and test reports
            are not published as general claims on this site.
          </p>
        </div>
      </div>
    </>
  );
}
