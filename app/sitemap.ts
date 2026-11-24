import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: `${base}/shop`, changeFrequency: "daily", priority: 0.9, lastModified: now },
    { url: `${base}/catalogue`, changeFrequency: "weekly", priority: 0.7, lastModified: now },
    { url: `${base}/brands`, changeFrequency: "weekly", priority: 0.7, lastModified: now },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${base}/history`, changeFrequency: "yearly", priority: 0.5, lastModified: now },
    { url: `${base}/mission`, changeFrequency: "yearly", priority: 0.5, lastModified: now },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${base}/shipping`, changeFrequency: "yearly", priority: 0.3, lastModified: now },
    { url: `${base}/returns`, changeFrequency: "yearly", priority: 0.3, lastModified: now },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2, lastModified: now },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2, lastModified: now },
  ];

  try {
    const [products, categories, brands] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.brand.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticRoutes,
      ...categories.map((category) => ({
        url: `${base}/category/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...products.map((product) => ({
        url: `${base}/product/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...brands.map((brand) => ({
        url: `${base}/brands/${brand.slug}`,
        lastModified: brand.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
