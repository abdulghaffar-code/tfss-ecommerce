import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Mission & approach",
  description:
    "Our approach to industrial safety supply: practical selection, confirmed availability, honest documentation and service from a family-run Karachi counter.",
  path: "/mission",
});

export default function MissionPage() {
  return (
    <>
      <PageHero
        eyebrow="Mission"
        title="Supply the right protection, and be straight about it."
        description="Our mission is practical: help industrial buyers find equipment that suits the hazard, confirm availability before accepting an order, and avoid claims we cannot support."
        image="/hero/slider-03.webp"
        crumbs={[{ label: "Mission" }]}
      />

      <div className="shell py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">Principles</p>
            <h2 className="mt-4 text-3xl leading-[1.04] tracking-tightest sm:text-4xl">
              Four things we try
              <br />
              <span className="text-steel-400">to get right.</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-steel-400">
              These are operating principles, not marketing promises. They shape
              how we quote, stock and answer questions.
            </p>
          </div>

          <ul className="divide-y divide-white/10 border-y border-white/10">
            {[
              {
                title: "Fit the hazard, not the trend",
                body: "A glove, helmet or harness is only useful if it matches the actual task. We ask about the environment, duration and exposure before recommending.",
              },
              {
                title: "Confirm before you commit",
                body: "Stock displayed online is checked again at checkout. If an item must be sourced, we tell you the realistic lead time instead of quietly taking the order.",
              },
              {
                title: "Documentation over decoration",
                body: "Certification and test documentation is provided for the specific product and batch on request. We do not display invented badges or approvals.",
              },
              {
                title: "A counter you can return to",
                body: "The relationship is long-term. If something is wrong with the supply, we want to hear it and resolve it directly.",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-4 py-6">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-flame-500/40 bg-flame-500/10">
                  <Check className="size-3.5 text-flame-400" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel-400">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 rounded-2xl border border-flame-500/20 bg-flame-500/[0.05] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="eyebrow">Start with the job</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-white">
                Tell us what the site demands.
              </h2>
              <p className="mt-1 text-sm text-steel-400">
                We will work back to a practical equipment list.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-lg bg-white px-5 font-display text-sm font-semibold text-ink-950 transition hover:bg-steel-100"
            >
              Send a requirement
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
