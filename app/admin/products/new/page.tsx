import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="New product"
        description="All prices are in PKR. Stock is validated server-side at checkout."
      />
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
