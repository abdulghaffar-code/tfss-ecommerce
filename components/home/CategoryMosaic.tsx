import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Droplets,
  Flame,
  Footprints,
  Glasses,
  Hand,
  HardHat,
  Hammer,
  Package,
  Shield,
  Shirt,
  TrafficCone,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  "fall-protection": Shield,
  "fire-fighting": Flame,
  "personal-protective-equipment": Shirt,
  "head-protection": HardHat,
  "eye-face-protection": Glasses,
  "hand-protection": Hand,
  "respiratory-protection": Wind,
  "safety-footwear": Footprints,
  "welding-equipment": Flame,
  "hardware-tools": Wrench,
  "hydraulic-equipment": Droplets,
  "electrical-equipment": Zap,
  "industrial-supplies": Package,
  "other-products": TrafficCone,
};

export type MosaicCategory = {
  slug: string;
  name: string;
  description: string;
  imageUrl: string | null;
  count: number;
};

export function CategoryMosaic({ categories }: { categories: MosaicCategory[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {categories.map((category, index) => {
        const Icon = icons[category.slug] ?? Hammer;
        const featured = index === 0;
        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className={cn(
              "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.08] bg-ink-900 transition-colors hover:border-white/25",
              featured
                ? "col-span-2 row-span-2 min-h-[320px] md:min-h-[420px]"
                : "min-h-[156px] md:min-h-[200px]"
            )}
          >
            {category.imageUrl ? (
              <>
                <Image
                  src={category.imageUrl}
                  alt=""
                  fill
                  sizes={
                    featured
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 768px) 50vw, 25vw"
                  }
                  className="object-cover opacity-80 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/10" />
              </>
            ) : (
              <>
                <span
                  className="absolute inset-0 bg-[radial-gradient(120%_100%_at_100%_0%,rgba(255,90,31,0.13),transparent_60%)]"
                  aria-hidden
                />
                <span
                  aria-hidden
                  className="absolute -right-2 -top-4 select-none font-display text-[86px] font-bold leading-none text-white/[0.04]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </>
            )}

            <div className="relative z-10 flex items-start justify-between p-4">
              <span className="flex size-9 items-center justify-center rounded-lg border border-white/15 bg-ink-950/60 text-flame-400 backdrop-blur">
                <Icon className="size-4" />
              </span>
              <ArrowUpRight className="size-4 -translate-x-1 translate-y-1 text-white/50 opacity-0 transition group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
            </div>

            <div className="relative z-10 p-4">
              <h3
                className={cn(
                  "font-display font-semibold leading-tight text-white",
                  featured ? "max-w-xs text-xl md:text-3xl" : "text-[13px] md:text-[15px]"
                )}
              >
                {category.name}
              </h3>
              {featured ? (
                <p className="mt-2 max-w-sm text-xs leading-relaxed text-steel-300">
                  {category.description}
                </p>
              ) : null}
              <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-steel-500">
                {category.count > 0
                  ? `${category.count} product${category.count === 1 ? "" : "s"}`
                  : "Available to order"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
