import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { categories, brands, banners, company } from "../scripts/catalog.mjs";
import { products } from "../scripts/products.mjs";

const prisma = new PrismaClient();

type SeedCategory = {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  imageSlug?: string;
};

type SeedBrand = { slug: string; name: string; logo?: string };

type SeedBanner = {
  title: string;
  subtitle?: string;
  imageUrl: string;
  href?: string;
  ctaLabel?: string;
  sortOrder: number;
};

type SeedProduct = {
  slug: string;
  sku: string;
  name: string;
  category: string;
  brand?: string;
  short: string;
  description: string;
  specs: [string, string][];
  price: number;
  salePrice?: number | null;
  stock: number;
  featured?: boolean;
  images: string[];
};

const cats = categories as SeedCategory[];
const brandList = brands as SeedBrand[];
const bannerList = banners as SeedBanner[];
const productList = products as SeedProduct[];

async function main() {
  console.log("Seeding Total Fire & Safety Solution demo catalogue…");

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@totalfirensafety.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin!23456";
  const customerEmail =
    process.env.SEED_CUSTOMER_EMAIL || "customer@example.com";
  const customerPassword =
    process.env.SEED_CUSTOMER_PASSWORD || "Customer!23456";

  const [adminHash, customerHash] = await Promise.all([
    bcrypt.hash(adminPassword, 12),
    bcrypt.hash(customerPassword, 12),
  ]);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", passwordHash: adminHash, name: "Store Administrator" },
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      name: "Store Administrator",
      role: "ADMIN",
    },
  });
  await prisma.user.upsert({
    where: { email: customerEmail },
    update: { passwordHash: customerHash },
    create: {
      email: customerEmail,
      passwordHash: customerHash,
      name: "Demo Customer",
      phone: "+92-300-0000000",
      role: "CUSTOMER",
    },
  });

  const brandIds = new Map<string, string>();
  for (const brand of brandList) {
    const row = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {
        name: brand.name,
        logoUrl: brand.logo ? `/brand/manufacturers/${brand.slug}.png` : null,
      },
      create: {
        slug: brand.slug,
        name: brand.name,
        logoUrl: brand.logo ? `/brand/manufacturers/${brand.slug}.png` : null,
      },
    });
    brandIds.set(brand.slug, row.id);
  }

  const categoryIds = new Map<string, string>();
  for (const category of cats) {
    const imageUrl = category.imageSlug
      ? `/products/${category.imageSlug}/1.webp`
      : null;
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
        imageUrl,
        isActive: true,
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
        imageUrl,
        isActive: true,
      },
    });
    categoryIds.set(category.slug, row.id);
  }

  for (const product of productList) {
    const categoryId = categoryIds.get(product.category);
    const brandId = product.brand ? brandIds.get(product.brand) : undefined;
    if (!categoryId) throw new Error(`Unknown category ${product.category}`);
    if (!brandId) throw new Error(`Unknown brand ${product.brand}`);

    const data = {
      name: product.name,
      sku: product.sku,
      categoryId,
      brandId,
      shortDescription: product.short,
      description: product.description,
      specs: product.specs.map(([label, value]: [string, string]) => ({
        label,
        value,
      })),
      price: product.price,
      salePrice: product.salePrice ?? null,
      stock: product.stock,
      isFeatured: Boolean(product.featured),
      isActive: true,
      seoTitle: `${product.name} | Total Fire & Safety Solution`,
      seoDescription: product.short,
      modelUrl: null,
    };

    const row = await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: { ...data, slug: product.slug },
    });

    await prisma.productImage.deleteMany({ where: { productId: row.id } });
    await prisma.productImage.createMany({
      data: product.images.map((_: unknown, index: number) => ({
        productId: row.id,
        url: `/products/${product.slug}/${index + 1}.webp`,
        alt: product.name,
        sortOrder: index,
      })),
    });
  }

  await prisma.banner.deleteMany({});
  await prisma.banner.createMany({ data: bannerList });

  await prisma.companySettings.upsert({
    where: { id: "main" },
    update: {
      companyName: company.name,
      tagline: company.tagline,
      phone: company.phone,
      phoneAlt: company.phoneAlt,
      email: company.email,
      address: company.address,
      safelinkAddress: company.safelinkAddress,
      mapEmbedUrl: company.mapEmbedUrl,
      logoUrl: company.logoUrl,
      ownerImageUrl: company.ownerImageUrl,
    },
    create: {
      id: "main",
      companyName: company.name,
      tagline: company.tagline,
      phone: company.phone,
      phoneAlt: company.phoneAlt,
      email: company.email,
      address: company.address,
      safelinkAddress: company.safelinkAddress,
      mapEmbedUrl: company.mapEmbedUrl,
      logoUrl: company.logoUrl,
      ownerImageUrl: company.ownerImageUrl,
    },
  });

  console.log(`  categories: ${cats.length}`);
  console.log(`  brands: ${brandList.length}`);
  console.log(`  products: ${productList.length}`);
  console.log(`  banners: ${bannerList.length}`);
  console.log(`  admin: ${adminEmail}`);
  console.log(`  customer: ${customerEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
