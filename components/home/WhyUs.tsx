const reasons = [
  {
    title: "One counter for the whole site",
    body: "Head-to-toe PPE, fall protection, fire safety and traffic control from a single Karachi supplier — fewer quotations, fewer deliveries to chase.",
  },
  {
    title: "Trade knowledge you can question",
    body: "A family business in protective equipment since 1969. We know the difference between a glove that fits the task and one that merely looks the part.",
  },
  {
    title: "Stock held in Karachi",
    body: "Everyday lines are kept at Nicol Road. For specialist requirements we source to order and tell you the real lead time before you commit.",
  },
  {
    title: "No invented credentials",
    body: "We publish what we can stand behind. Certification, test reports and compliance documents are shared for the specific product and batch on request.",
  },
];

export function WhyUs() {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="eyebrow flex items-center gap-3">
          <span className="h-px w-8 bg-flame-500" aria-hidden />
          Why buy from us
        </p>
        <h2 className="mt-4 text-3xl leading-[1.04] tracking-tightest sm:text-4xl lg:text-[2.9rem]">
          Practical supply,
          <br />
          <span className="text-steel-400">not sales theatre.</span>
        </h2>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-steel-400">
          Industrial buyers need availability, straight answers and equipment
          that suits the hazard. That is the standard we hold ourselves to.
        </p>
      </div>

      <ol className="divide-y divide-white/10 border-y border-white/10">
        {reasons.map((reason, index) => (
          <li key={reason.title} className="group py-7 first:pt-6">
            <div className="flex gap-5">
              <span className="mt-1 font-mono text-[10px] text-steel-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-white transition group-hover:text-flame-300">
                  {reason.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-steel-400">
                  {reason.body}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
