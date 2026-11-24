import type { ReactNode } from "react";

export function PolicyBody({
  updated,
  intro,
  sections,
  aside,
}: {
  updated: string;
  intro: string;
  sections: { title: string; content: ReactNode }[];
  aside?: ReactNode;
}) {
  return (
    <div className="grid gap-10 py-12 lg:grid-cols-[1fr_300px] lg:gap-16 lg:py-16">
      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-steel-500">
          Last updated · {updated}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-steel-300">{intro}</p>

        <div className="mt-10 space-y-9">
          {sections.map((section, index) => (
            <section key={section.title} className="border-t border-white/10 pt-6">
              <h2 className="flex gap-3 font-display text-lg font-semibold text-white">
                <span className="font-mono text-[10px] text-steel-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 pl-7 text-sm leading-relaxed text-steel-400">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        {aside ?? (
          <div className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <p className="eyebrow">Questions</p>
            <p className="mt-3 text-sm leading-relaxed text-steel-400">
              Contact the counter with your order number for anything not covered
              here.
            </p>
            <a
              href="mailto:info@totalfirensafety.com"
              className="mt-4 inline-block text-xs font-semibold text-flame-400 hover:text-flame-300"
            >
              info@totalfirensafety.com →
            </a>
          </div>
        )}
      </aside>
    </div>
  );
}
