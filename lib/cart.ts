import "server-only";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { computeTotals } from "@/lib/order-math";
import { getSiteUrl } from "@/lib/utils";
import type { SessionUser } from "@/lib/auth";

export const CART_COOKIE = "tfss_cart";

const cartInclude = {
  items: {
    orderBy: { createdAt: "asc" as const },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
          brand: { select: { name: true } },
          category: { select: { name: true, slug: true } },
        },
      },
    },
  },
} as const;

type DbCart = Awaited<ReturnType<typeof findCart>>;

async function findCart(userId: string | null, sessionId: string | null) {
  if (userId) {
    return prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
  }
  if (sessionId) {
    return prisma.cart.findUnique({
      where: { sessionId },
      include: cartInclude,
    });
  }
  return null;
}

export type CartLine = {
  id: string;
  productId: string;
  quantity: number;
  name: string;
  slug: string;
  sku: string;
  image: string | null;
  brand: string | null;
  category: string;
  unitPrice: number;
  regularPrice: number;
  lineTotal: number;
  stock: number;
  isActive: boolean;
  available: boolean;
  issue: string | null;
};

export type CartSummary = {
  id: string;
  items: CartLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
  hasIssues: boolean;
};

export function mapCart(cart: NonNullable<DbCart>): CartSummary {
  const items: CartLine[] = cart.items.map((item) => {
    const p = item.product;
    const unitPrice = Number(p.salePrice ?? p.price);
    const issue = !p.isActive
      ? "This product is no longer available."
      : p.stock <= 0
        ? "Out of stock."
        : p.stock < item.quantity
          ? `Only ${p.stock} left in stock.`
          : null;
    return {
      id: item.id,
      productId: p.id,
      quantity: item.quantity,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      image: p.images[0]?.url ?? null,
      brand: p.brand?.name ?? null,
      category: p.category.name,
      unitPrice,
      regularPrice: Number(p.price),
      lineTotal: Math.round(unitPrice * item.quantity * 100) / 100,
      stock: p.stock,
      isActive: p.isActive,
      available: !issue,
      issue,
    };
  });

  const totals = computeTotals(
    items.filter((i) => i.available).map((i) => ({ unitPrice: i.unitPrice, quantity: i.quantity }))
  );

  return {
    id: cart.id,
    items,
    ...totals,
    hasIssues: items.some((i) => !i.available),
  };
}

export async function getCart(
  user: SessionUser | null
): Promise<CartSummary | null> {
  const store = await cookies();
  const sessionId = store.get(CART_COOKIE)?.value ?? null;
  const cart = await findCart(user?.id ?? null, user ? null : sessionId);
  return cart ? mapCart(cart) : null;
}

export async function getCartCount(user: SessionUser | null) {
  const cart = await getCart(user);
  return cart?.itemCount ?? 0;
}

/** Must be called from a Server Action or Route Handler (sets a cookie). */
export async function ensureCart(user: SessionUser | null) {
  const store = await cookies();
  if (user) {
    const existing = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: cartInclude,
    });
    if (existing) return existing;
    return prisma.cart.create({
      data: { userId: user.id },
      include: cartInclude,
    });
  }

  const existingSession = store.get(CART_COOKIE)?.value;
  if (existingSession) {
    const existing = await prisma.cart.findUnique({
      where: { sessionId: existingSession },
      include: cartInclude,
    });
    if (existing) return existing;
  }

  const sessionId = randomUUID();
  const cart = await prisma.cart.create({
    data: { sessionId },
    include: cartInclude,
  });
  store.set(CART_COOKIE, sessionId, {
    httpOnly: true,
    secure: getSiteUrl().startsWith("https://"),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return cart;
}

/** Merge a guest cart into the signed-in customer's cart after login. */
export async function mergeGuestCart(userId: string) {
  const store = await cookies();
  const guestSession = store.get(CART_COOKIE)?.value;
  if (!guestSession) return;

  const guestCart = await prisma.cart.findUnique({
    where: { sessionId: guestSession },
    include: { items: true },
  });

  let userCart = await prisma.cart.findUnique({ where: { userId } });

  if (guestCart && guestCart.items.length > 0) {
    if (!userCart) {
      userCart = await prisma.cart.create({ data: { userId } });
    }
    const targetCartId = userCart.id;
    await prisma.$transaction(
      guestCart.items.map((item) =>
        prisma.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId: targetCartId,
              productId: item.productId,
            },
          },
          update: { quantity: { increment: item.quantity } },
          create: {
            cartId: targetCartId,
            productId: item.productId,
            quantity: item.quantity,
          },
        })
      )
    );
  }

  if (guestCart) {
    await prisma.cart.delete({ where: { id: guestCart.id } }).catch(() => undefined);
  }
  store.delete(CART_COOKIE);
}
