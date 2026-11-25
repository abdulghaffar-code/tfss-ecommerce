import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type Manufacturer = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  count: number;
};

export function Manufacturers({ brands }: { brands: Manufacturer[] }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="group flex flex-col items-center"
          >
            <div className="flex h-24 w-full items-center justify-center rounded-2xl bg-gradient-to-b from-white to-steel-100 px-4 shadow-[0_14px_34px_-18px_rgba(0,0,0,0.85)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_22px_46px_-18px_rgba(0,0,0,0.9)] sm:h-28">
              {brand.logoUrl ? (
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  width={180}
                  height={70}
                  className="h-12 w-auto max-w-[150px] object-contain mix-blend-multiply transition duration-300 group-hover:scale-105 sm:h-14"
                />
              ) : (
                <span className="text-center font-display text-sm font-semibold leading-tight text-ink-950">
                  {brand.name}
                </span>
              )}
            </div>
            <span className="mt-3 text-[9px] uppercase tracking-[0.16em] text-steel-500 transition group-hover:text-flame-400">
              {brand.count > 0 ? `${brand.count} lines` : "Sourced to order"}
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <Link
          href="/brands"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-steel-400 transition hover:text-flame-400"
        >
          All manufacturers <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
