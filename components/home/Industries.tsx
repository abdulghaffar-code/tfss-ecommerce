import {
  Building2,
  Factory,
  Fuel,
  HardHat,
  Ship,
  Truck,
} from "lucide-react";

const industries = [
  {
    name: "Manufacturing",
    icon: Factory,
    note: "Plant-floor PPE, hearing and hand protection.",
  },
  {
    name: "Construction",
    icon: HardHat,
    note: "Height safety, helmets and high-visibility clothing.",
  },
  {
    name: "Oil, gas & energy",
    icon: Fuel,
    note: "Flame-resistant workwear and respiratory protection.",
  },
  {
    name: "Logistics & warehousing",
    icon: Truck,
    note: "Site visibility, footwear and traffic control.",
  },
  {
    name: "Ports & marine",
    icon: Ship,
    note: "Industrial supply for dock and vessel work.",
  },
  {
    name: "Facilities management",
    icon: Building2,
    note: "Everyday safety and workplace warning products.",
  },
];

export function Industries() {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
      {industries.map((industry) => (
        <div
          key={industry.name}
          className="group relative bg-ink-900 p-6 transition hover:bg-ink-850"
        >
          <industry.icon className="size-5 text-flame-500" />
          <h3 className="mt-8 font-display text-[15px] font-semibold text-white">
            {industry.name}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-steel-500">
            {industry.note}
          </p>
          <span className="absolute right-5 top-5 h-px w-0 bg-flame-500 transition-all duration-300 group-hover:w-8" />
        </div>
      ))}
    </div>
  );
}
