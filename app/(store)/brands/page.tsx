import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { getBrands } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Manufacturer brands",
  description:
    "Manufacturer brands represented in the Total Fire & Safety Solution catalogue, including Honeywell, JSP, Blue Eagle, NAFFCO and more.",
  path: "/brands",
});

export default async function BrandsPage() {
  const brands = await getBrands(true);

  return (
    <>
      <PageHero
        eyebrow="Manufacturers"
        title="The lines behind the counter."
        description="Manufacturer brands represented in our catalogue. Ask us for the current line card, genuine product documentation and availability for the exact model you need."
        crumbs={[{ label: "Brands" }]}
      />

      <div className="shell py-12 lg:py-16">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group flex min-h-[190px] flex-col justify-between rounded-xl border border-white/10 bg-ink-900 p-5 transition hover:border-white/25"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-16 w-full max-w-[180px] items-center justify-center rounded-lg bg-white p-3">
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      width={160}
                      height={56}
                      className="max-h-10 w-auto object-contain"
                    />
                  ) : (
                    <span className="font-display text-sm font-semibold text-ink-800">
                      {brand.name}
                    </span>
                  )}
                </div>
                <ArrowUpRight className="size-4 text-steel-600 transition group-hover:text-white" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-white">{brand.name}</h2>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-steel-500">
                  {brand._count.products > 0
                    ? `${brand._count.products} sample line${brand._count.products === 1 ? "" : "s"}`
                    : "Sourced to order"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-[11px] leading-relaxed text-steel-600">
          Manufacturer logos are used to identify product lines represented in the
          catalogue. Presence of a logo does not imply an exclusive partnership or
          an endorsement of this storefront. Product data on this demonstration
          site is fictional unless confirmed by our team.
        </p>
      </div>
    </>
  );
}
