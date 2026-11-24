import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { ProductCard } from "@/components/product/ProductCard";
import { getBrandBySlug, listProducts } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand || !brand.isActive) notFound();
  return buildMetadata({
    title: `${brand.name} products`,
    description:
      brand.description ||
      `Shop ${brand.name} safety equipment from Total Fire & Safety Solution, Karachi.`,
    path: `/brands/${brand.slug}`,
  });
}

export default async function BrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ slug }, { page }] = await Promise.all([params, searchParams]);
  const brand = await getBrandBySlug(slug);
  if (!brand || !brand.isActive) notFound();

  const [{ items, total, page: current, pageCount }, user] = await Promise.all([
    listProducts({ brand: slug, page }),
    getCurrentUser(),
  ]);
  const wishlist = user
    ? await prisma.wishlistItem.findMany({
        where: { wishlist: { userId: user.id } },
        select: { productId: true },
      })
    : [];
  const saved = new Set(wishlist.map((item) => item.productId));

  return (
    <>
      <PageHero
        eyebrow="Manufacturer"
        title={brand.name}
        description={
          brand.description ||
          `Product lines from ${brand.name} represented in our catalogue. Availability and exact specification are confirmed before order acceptance.`
        }
        crumbs={[{ label: "Manufacturers", href: "/brands" }, { label: brand.name }]}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-[180px] items-center justify-center rounded-lg bg-white p-3">
            {brand.logoUrl ? (
              <Image src={brand.logoUrl} alt={brand.name} width={160} height={56} className="max-h-10 w-auto object-contain" />
            ) : (
              <span className="font-display text-sm font-semibold text-ink-800">{brand.name}</span>
            )}
          </div>
          <p className="text-xs text-steel-400">{total} sample lines</p>
        </div>
      </PageHero>

      <div className="shell py-10 lg:py-14">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <p className="text-xs text-steel-500">
            <span className="font-semibold text-white">{total}</span>{" "}
            {total === 1 ? "product" : "products"}
          </p>
          <Link href="/shop" className="text-[10px] uppercase tracking-[0.12em] text-steel-400 hover:text-white">
            All products
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-ink-900 p-10 text-center">
            <p className="font-display text-lg text-white">No online lines yet.</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-steel-500">
              {brand.name} products can be sourced to order. Send us the model or
              specification and we will confirm availability.
            </p>
            <Link href="/contact" className="mt-5 inline-flex h-10 items-center rounded-lg bg-flame-500 px-4 text-xs font-semibold text-ink-950">
              Ask about {brand.name}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {items.map((product, index) => (
              <ProductCard key={product.id} product={product} saved={saved.has(product.id)} priority={index < 4} />
            ))}
          </div>
        )}

        {pageCount > 1 ? (
          <nav className="mt-8 flex justify-center gap-2" aria-label="Pagination">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
              <Link
                key={number}
                href={number === 1 ? `/brands/${brand.slug}` : `/brands/${brand.slug}?page=${number}`}
                className={cn(
                  "flex size-9 items-center justify-center rounded-md border text-xs",
                  number === current
                    ? "border-flame-500 bg-flame-500 text-ink-950"
                    : "border-white/15 text-steel-300 hover:border-white/35 hover:text-white"
                )}
              >
                {number}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </>
  );
}
