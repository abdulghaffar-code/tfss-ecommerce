"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { CartActionState } from "@/actions/cart";

export async function toggleWishlistAction(
  _prev: CartActionState | undefined,
  formData: FormData
): Promise<CartActionState> {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return { error: "Product not found." };

  const user = await getCurrentUser();
  if (!user) {
    return {
      requiresAuth: true,
      error: "Sign in to save products to your wishlist.",
    };
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
    select: { id: true, name: true, slug: true },
  });
  if (!product) return { error: "Product not found." };

  const wishlist = await prisma.wishlist.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  const existing = await prisma.wishlistItem.findUnique({
    where: {
      wishlistId_productId: { wishlistId: wishlist.id, productId },
    },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/account/wishlist");
    revalidatePath(`/product/${product.slug}`);
    return { ok: true, message: "Removed from your wishlist." };
  }

  await prisma.wishlistItem.create({
    data: { wishlistId: wishlist.id, productId },
  });
  revalidatePath("/account/wishlist");
  revalidatePath(`/product/${product.slug}`);
  return { ok: true, message: "Saved to your wishlist." };
}

export async function removeWishlistItemAction(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const user = await getCurrentUser();
  if (!user || !itemId) return;

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!wishlist) return;

  await prisma.wishlistItem.deleteMany({
    where: { id: itemId, wishlistId: wishlist.id },
  });
  revalidatePath("/account/wishlist");
}

export async function getWishlistIds(userId: string | undefined) {
  if (!userId) return new Set<string>();
  const items = await prisma.wishlistItem.findMany({
    where: { wishlist: { userId } },
    select: { productId: true },
  });
  return new Set(items.map((i) => i.productId));
}
