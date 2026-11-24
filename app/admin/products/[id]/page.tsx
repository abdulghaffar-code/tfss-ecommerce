import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { Flash } from "@/components/admin/Flash";
import { prisma } from "@/lib/prisma";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [{ id }, flash] = await Promise.all([params, searchParams]);
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalogue"
        title={product.name}
        description={`SKU ${product.sku} · updated ${product.updatedAt.toLocaleDateString("en-GB")}`}
        action={
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-white/15 px-4 text-xs font-semibold text-steel-300 transition hover:border-white/35 hover:text-white"
          >
            View live <ExternalLink className="size-3.5" />
          </Link>
        }
      />
      <Flash saved={flash.saved} error={flash.error} />
      <ProductForm
        product={product}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
