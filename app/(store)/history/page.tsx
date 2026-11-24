import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Our history",
  description:
    "From Pak Gloves in 1969 to Total Fire & Safety Solution in 1992 — a Karachi family history in protective equipment.",
  path: "/history",
});

const timeline = [
  {
    year: "1969",
    title: "Pak Gloves Manufacturing Company",
    body: "Haji Muhammad Siddique establishes a safety-wear manufacturing setup in Pakistan, building the family's grounding in protective materials and production.",
  },
  {
    year: "1992",
    title: "Total Fire & Safety Solution",
    body: "Mr. Muhammad Rizwan Siddique establishes the company in Karachi, taking charge of the family trade and opening the Nicol Road counter.",
  },
  {
    year: "Growth",
    title: "Beyond safety wear",
    body: "The range expands to fire fighting, welding, hardware, hydraulic, electrical and general industrial supplies for engineering and workshop customers.",
  },
  {
    year: "Today",
    title: "A general order supplier",
    body: "The next generation works in the business alongside the founder. PPE and fire safety remain central, supported by the wider supply capability customers rely on.",
  },
];

export default function HistoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Family history"
        title="A trade measured in generations."
        description="The story of the business is not a list of awards. It is a line of work passed down, and a counter that has kept answering the same question: what does this job actually need?"
        image="/hero/slider-06.webp"
        crumbs={[{ label: "History" }]}
      />

      <div className="shell py-12 lg:py-16">
        <ol className="relative border-l border-white/15 pl-8 sm:pl-12">
          {timeline.map((entry) => (
            <li key={entry.year} className="relative pb-12 last:pb-0">
              <span className="absolute -left-[41px] top-1 flex size-4 items-center justify-center rounded-full border border-flame-500/50 bg-ink-950 sm:-left-[57px]">
                <span className="size-1.5 rounded-full bg-flame-500" />
              </span>
              <p className="font-display text-3xl font-semibold tracking-tight text-flame-500">
                {entry.year}
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-white">
                {entry.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-steel-400">
                {entry.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-5 rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">
              The next chapter is still a counter conversation.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-steel-400">
              Come in with the job in mind. That is how the business has always
              worked, and how we would like it to continue.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-11 w-fit items-center rounded-lg bg-flame-500 px-5 font-display text-sm font-semibold text-ink-950 transition hover:bg-flame-400"
          >
            Find us in Karachi
          </Link>
        </div>
      </div>
    </>
  );
}
