import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { toProductCard } from "@/lib/catalog";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function WishlistPage() {
  const user = await requireUser("/account/wishlist");
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: "asc" }, take: 1 },
              brand: { select: { name: true } },
              category: { select: { name: true, slug: true } },
            },
          },
        },
      },
    },
  });

  const items = (wishlist?.items ?? [])
    .filter((item) => item.product.isActive)
    .map((item) => toProductCard(item.product));

  return (
    <div>
      <p className="eyebrow">Saved for later</p>
      <h1 className="mt-3 text-3xl leading-[1.02] tracking-tightest sm:text-4xl">
        Wishlist
      </h1>
      <p className="mt-2 text-sm text-steel-400">
        {items.length > 0
          ? "Lines you have saved. Availability is still checked at checkout."
          : "Save equipment while you compare specifications."}
      </p>

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/10 bg-ink-900 p-10 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <Heart className="size-5 text-steel-500" />
          </span>
          <p className="mt-4 font-display text-lg text-white">Nothing saved yet.</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-steel-500">
            Use the heart on any product to keep it here while you build a
            comparison list.
          </p>
          <Link
            href="/shop"
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-flame-500 px-4 text-xs font-semibold text-ink-950 transition hover:bg-flame-400"
          >
            Browse the catalogue
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} saved />
          ))}
        </div>
      )}
    </div>
  );
}
