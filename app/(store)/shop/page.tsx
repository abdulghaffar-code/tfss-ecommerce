import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ShopView, type ShopSearchParams } from "@/components/shop/ShopView";
import { getBrands, getCategories } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Industrial safety catalogue",
  description:
    "Shop fall protection, PPE, safety footwear, hand protection, respiratory protection and site safety equipment from Total Fire & Safety Solution, Karachi.",
  path: "/shop",
});

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const params = await searchParams;
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
      <Breadcrumbs items={[{ label: "Shop" }]} />
      <div className="mt-5 max-w-2xl">
        <p className="eyebrow">The catalogue</p>
        <h1 className="mt-3 text-4xl leading-[0.98] tracking-tightest sm:text-5xl">
          Industrial safety,
          <br />
          <span className="text-steel-400">catalogued.</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-steel-400">
          Sample product lines across fourteen categories. Stock is validated
          when you order; specialist items are sourced to your specification.
        </p>
      </div>

      <div className="mt-8 lg:mt-10">
        <ShopView
          searchParams={params}
          basePath="/shop"
          savedIds={new Set(wishlist.map((item) => item.productId))}
          categories={categories.map((category) => ({
            slug: category.slug,
            name: category.name,
            count: category._count.products,
          }))}
          brands={brands.map((brand) => ({ slug: brand.slug, name: brand.name }))}
        />
      </div>
    </div>
  );
}
