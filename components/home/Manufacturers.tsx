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
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-5">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="group flex h-24 flex-col items-center justify-center gap-2 bg-ink-900 px-4 transition hover:bg-ink-850"
          >
            {brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                width={160}
                height={60}
                className="h-9 w-auto max-w-[130px] object-contain opacity-80 transition group-hover:opacity-100"
              />
            ) : (
              <span className="font-display text-sm font-semibold text-white">
                {brand.name}
              </span>
            )}
            <span className="text-[9px] uppercase tracking-[0.14em] text-steel-600 transition group-hover:text-steel-400">
              {brand.count > 0 ? `${brand.count} lines` : "Sourced to order"}
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
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
