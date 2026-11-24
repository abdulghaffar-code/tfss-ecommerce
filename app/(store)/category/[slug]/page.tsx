import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ShopView, type ShopSearchParams } from "@/components/shop/ShopView";
import { getBrands, getCategories, getCategoryBySlug } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category || !category.isActive) notFound();
  return buildMetadata({
    title: category.name,
    description:
      category.description ||
      `Shop ${category.name.toLowerCase()} from Total Fire & Safety Solution, Karachi.`,
    path: `/category/${category.slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ShopSearchParams>;
}) {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);
  if (!category || !category.isActive) notFound();

  const user = await getCurrentUser();
  const [categories, brands, wishlist] = await Promise.all([
    getCategories(true),
    getBrands(true),
    user
      ? prisma.wishlistItem.findMany({
          where: { wishlist: { userId: user.id } },
          select: { productId: true },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="shell py-8 lg:py-12">
      <Breadcrumbs
        items={[{ label: "Shop", href: "/shop" }, { label: category.name }]}
      />
      <div className="mt-5 max-w-3xl">
        <p className="eyebrow">
          Category · {String(category.sortOrder).padStart(2, "0")}
        </p>
        <h1 className="mt-3 text-4xl leading-[0.98] tracking-tightest sm:text-5xl">
          {category.name}
        </h1>
        {category.description ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-steel-400">
            {category.description}
          </p>
        ) : null}
        <p className="mt-4 text-xs text-steel-500">
          Not seeing the exact specification?{" "}
          <Link
            href="/contact"
            className="font-semibold text-flame-400 underline-offset-4 hover:underline"
          >
            Send us the requirement
          </Link>
          .
        </p>
      </div>

      <div className="mt-8 lg:mt-10">
        <ShopView
          searchParams={search}
          basePath={`/category/${category.slug}`}
          lockedCategory={category.slug}
          savedIds={new Set(wishlist.map((item) => item.productId))}
          categories={categories.map((c) => ({
            slug: c.slug,
            name: c.name,
            count: c._count.products,
          }))}
          brands={brands.map((brand) => ({ slug: brand.slug, name: brand.name }))}
        />
      </div>
    </div>
  );
}
