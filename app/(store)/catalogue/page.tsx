import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PrintButton } from "@/components/orders/PrintButton";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Product catalogue",
  description:
    "An on-page catalogue of industrial safety, PPE and site safety lines from Total Fire & Safety Solution, Karachi.",
  path: "/catalogue",
});

export default async function CataloguePage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        brand: { select: { name: true } },
      },
    }),
  ]);

  const grouped = new Map<string, typeof products>();
  for (const product of products) {
    const list = grouped.get(product.categoryId) ?? [];
    list.push(product);
    grouped.set(product.categoryId, list);
  }

  return (
    <>
      <PageHero
        eyebrow="Catalogue"
        title="The working catalogue."
        description="A printable overview of the lines currently represented online. Prices are fictional sample data for this demonstration storefront; confirm specifications and availability before ordering."
        crumbs={[{ label: "Catalogue" }]}
      >
        <div className="flex flex-wrap gap-3 print:hidden">
          <Link
            href="/shop"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-flame-500 px-5 font-display text-sm font-semibold text-ink-950 transition hover:bg-flame-400"
          >
            Shop online <ArrowUpRight className="size-4" />
          </Link>
          <PrintButton />
        </div>
      </PageHero>

      <div className="shell py-12 lg:py-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <p className="text-xs text-steel-500">
            {products.length} sample lines · {categories.length} categories
          </p>
          <p className="text-[10px] uppercase tracking-[0.14em] text-steel-600">
            Prices in PKR
          </p>
        </div>

        <div className="space-y-12">
          {categories
            .filter((category) => (grouped.get(category.id)?.length ?? 0) > 0)
            .map((category) => {
              const items = grouped.get(category.id) ?? [];
              return (
                <section key={category.id} className="break-inside-avoid">
                  <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <p className="font-mono text-[10px] text-steel-600">
                        {String(category.sortOrder).padStart(2, "0")}
                      </p>
                      <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                        {category.name}
                      </h2>
                    </div>
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-[10px] font-semibold uppercase tracking-[0.14em] text-steel-400 transition hover:text-flame-400 print:hidden"
                    >
                      View category →
                    </Link>
                  </div>

                  <ul className="mt-4 divide-y divide-white/[0.07]">
                    {items.map((product) => (
                      <li key={product.id} className="flex items-center gap-4 py-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded bg-steel-100 print:hidden">
                          {product.images[0] ? (
                            <Image src={product.images[0].url} alt="" fill sizes="48px" className="object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link href={`/product/${product.slug}`} className="text-sm font-medium text-steel-200 transition hover:text-white">
                            {product.name}
                          </Link>
                          <p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-steel-600">
                            {product.sku}
                            {product.brand ? ` · ${product.brand.name}` : ""}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm text-steel-300">
                          {formatPrice(product.salePrice ?? product.price)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-ink-900 p-6 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-white">
                Need a line card for a tender?
              </h2>
              <p className="mt-1 max-w-lg text-sm text-steel-400">
                Send us the required items and specifications. We will quote
                against what is genuinely available and flag any sourcing lead
                time.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-lg bg-white px-5 font-display text-sm font-semibold text-ink-950 transition hover:bg-steel-100"
            >
              Request a quotation
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
