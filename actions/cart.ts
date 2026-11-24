"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ensureCart, getCart } from "@/lib/cart";
import { cartAddSchema, cartUpdateSchema } from "@/lib/validation";

export type CartActionState = {
  ok?: boolean;
  error?: string;
  message?: string;
  requiresAuth?: boolean;
};

function refreshCartPaths(slug?: string | null) {
  revalidatePath("/cart");
  revalidatePath("/checkout");
  if (slug) revalidatePath(`/product/${slug}`);
}

export async function addToCartAction(
  _prev: CartActionState | undefined,
  formData: FormData
): Promise<CartActionState> {
  const parsed = cartAddSchema.safeParse({
    productId: formData.get("productId"),
    quantity: formData.get("quantity") || 1,
  });
  if (!parsed.success) {
    return { error: "Choose a valid quantity." };
  }

  const user = await getCurrentUser();
  const product = await prisma.product.findFirst({
    where: { id: parsed.data.productId, isActive: true },
    select: { id: true, name: true, stock: true, slug: true },
  });
  if (!product) return { error: "This product is not available." };
  if (product.stock <= 0) return { error: "This product is out of stock." };

  const cart = await ensureCart(user);
  const existing = cart.items.find((item) => item.productId === product.id);
  const nextQuantity = (existing?.quantity ?? 0) + parsed.data.quantity;

  if (nextQuantity > product.stock) {
    return {
      error:
        product.stock === 1
          ? "Only 1 unit is available."
          : `Only ${product.stock} units are available.`,
    };
  }

  await prisma.cartItem.upsert({
    where: {
      cartId_productId: { cartId: cart.id, productId: product.id },
    },
    update: { quantity: nextQuantity },
    create: {
      cartId: cart.id,
      productId: product.id,
      quantity: parsed.data.quantity,
    },
  });

  refreshCartPaths(product.slug);
  return {
    ok: true,
    message: `Added “${product.name}” to your cart.`,
  };
}

export async function updateCartItemAction(formData: FormData) {
  const parsed = cartUpdateSchema.safeParse({
    itemId: formData.get("itemId"),
    quantity: formData.get("quantity"),
  });
  if (!parsed.success) return;

  const user = await getCurrentUser();
  const cart = await getCart(user);
  if (!cart) return;

  const line = cart.items.find((item) => item.id === parsed.data.itemId);
  if (!line) return;

  const quantity = Math.min(parsed.data.quantity, line.stock);
  if (quantity < 1) return;

  await prisma.cartItem.updateMany({
    where: { id: parsed.data.itemId, cartId: cart.id },
    data: { quantity },
  });
  refreshCartPaths(line.slug);
}

export async function removeCartItemAction(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  if (!itemId) return;

  const user = await getCurrentUser();
  const cart = await getCart(user);
  if (!cart) return;

  await prisma.cartItem.deleteMany({
    where: { id: itemId, cartId: cart.id },
  });
  refreshCartPaths();
}

export async function clearCartAction() {
  const user = await getCurrentUser();
  const cart = await getCart(user);
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  refreshCartPaths();
}
