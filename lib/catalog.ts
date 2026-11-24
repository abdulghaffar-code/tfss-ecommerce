import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  price: number;
  salePrice: number | null;
  image: string | null;
  stock: number;
  isFeatured: boolean;
  brand: string | null;
  categoryName: string;
  categorySlug: string;
};

type ProductCardSource = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  price: number | string | Prisma.Decimal;
  salePrice: number | string | Prisma.Decimal | null;
  stock: number;
  isFeatured: boolean;
  images?: { url: string }[];
  brand?: { name: string } | null;
  category?: { name: string; slug: string } | null;
};

export function toProductCard(product: ProductCardSource): ProductCardData {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    shortDescription: product.shortDescription,
    price: Number(product.price),
    salePrice: product.salePrice === null ? null : Number(product.salePrice),
    image: product.images?.[0]?.url ?? null,
    stock: product.stock,
    isFeatured: product.isFeatured,
    brand: product.brand?.name ?? null,
    categoryName: product.category?.name ?? "",
    categorySlug: product.category?.slug ?? "",
  };
}

const cardInclude = {
  images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
  brand: { select: { name: true } },
  category: { select: { name: true, slug: true } },
} satisfies Prisma.ProductInclude;

export const getCategories = cache(async (activeOnly = true) => {
  return prisma.category.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
  });
});

export const getBrands = cache(async (activeOnly = true) => {
  return prisma.brand.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { name: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findUnique({ where: { slug } });
});

export const getBrandBySlug = cache(async (slug: string) => {
  return prisma.brand.findUnique({ where: { slug } });
});

export const getFeaturedProducts = cache(async (limit = 8) => {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: cardInclude,
  });
  return products.map(toProductCard);
});

export const getNewArrivals = cache(async (limit = 8) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: cardInclude,
  });
  return products.map(toProductCard);
});

/** Real best-seller ranking from order history; falls back to featured stock. */
export const getBestSellers = cache(async (limit = 8) => {
  const ranked = await prisma.orderItem
    .groupBy({
      by: ["productId"],
      where: {
        productId: { not: null },
        order: { status: { not: "CANCELLED" } },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: limit,
    })
    .catch(() => []);

  const ids = ranked.map((r) => r.productId).filter(Boolean) as string[];
  if (ids.length > 0) {
    const rows = await prisma.product.findMany({
      where: { id: { in: ids }, isActive: true },
      include: cardInclude,
    });
    const byId = new Map(rows.map((p) => [p.id, p]));
    const ordered = ids.flatMap((id) => {
      const row = byId.get(id);
      return row ? [toProductCard(row)] : [];
    });
    if (ordered.length > 0) return ordered;
  }
  return getFeaturedProducts(limit);
});

export const getProductBySlug = cache(async (slug: string) => {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      brand: true,
      category: true,
    },
  });
});

export const getRelatedProducts = cache(async (categoryId: string, excludeId: string, limit = 4) => {
  const rows = await prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: excludeId } },
    orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
    take: limit,
    include: cardInclude,
  });
  return rows.map(toProductCard);
});

export type ShopParams = {
  q?: string;
  category?: string;
  brand?: string;
  sort?: string;
  min?: string;
  max?: string;
  page?: string;
  inStock?: string;
};

export async function listProducts(params: ShopParams) {
  const q = params.q?.trim().slice(0, 100) ?? "";
  const page = Math.min(
    10000,
    Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1)
  );
  const min = Number.parseFloat(params.min ?? "");
  const max = Number.parseFloat(params.max ?? "");

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
      { brand: { name: { contains: q, mode: "insensitive" } } },
    ];
  }
  if (params.category) where.category = { slug: params.category };
  if (params.brand) where.brand = { slug: params.brand };
  if (params.inStock === "1") where.stock = { gt: 0 };
  if (!Number.isNaN(min) || !Number.isNaN(max)) {
    where.price = {
      ...(!Number.isNaN(min) ? { gte: min } : {}),
      ...(!Number.isNaN(max) ? { lte: max } : {}),
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    params.sort === "price-asc"
      ? [{ price: "asc" }]
      : params.sort === "price-desc"
        ? [{ price: "desc" }]
        : params.sort === "name"
          ? [{ name: "asc" }]
          : params.sort === "newest"
            ? [{ createdAt: "desc" }]
            : [{ isFeatured: "desc" }, { createdAt: "desc" }];

  const [items, total, category] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
      include: cardInclude,
    }),
    prisma.product.count({ where }),
    params.category
      ? prisma.category.findUnique({ where: { slug: params.category } })
      : Promise.resolve(null),
  ]);

  return {
    items: items.map(toProductCard),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE)),
    category,
  };
}
