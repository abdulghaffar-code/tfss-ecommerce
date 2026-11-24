import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import {
  deleteCategoryAction,
  saveCategoryAction,
} from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { Flash } from "@/components/admin/Flash";
import { Field, Textarea } from "@/components/ui/Field";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  const editing = categories.find((category) => category.id === params.edit);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Categories"
        description="Control the category navigation, ordering and artwork. Categories with products cannot be deleted until the products are reassigned."
      />
      <Flash saved={params.saved} error={params.error} />

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead className="border-b border-white/10 text-[9px] uppercase tracking-[0.12em] text-steel-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Slug</th>
                  <th className="px-4 py-3 font-medium">Products</th>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {categories.map((category) => (
                  <tr key={category.id} className={params.edit === category.id ? "bg-flame-500/[0.04]" : ""}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-9 shrink-0 overflow-hidden rounded bg-steel-100">
                          {category.imageUrl ? (
                            <Image src={category.imageUrl} alt="" fill sizes="36px" className="object-cover" />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-medium text-white">{category.name}</p>
                          <p className="mt-0.5 text-[9px] text-steel-600">
                            {category.isActive ? "Visible" : "Hidden"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-steel-400">{category.slug}</td>
                    <td className="px-4 py-3 text-steel-300">{category._count.products}</td>
                    <td className="px-4 py-3 text-steel-400">{category.sortOrder}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/categories?edit=${category.id}`}
                          className="flex items-center gap-1 text-[9px] uppercase tracking-[0.1em] text-steel-400 hover:text-white"
                        >
                          <Pencil className="size-3" /> Edit
                        </Link>
                        <form action={deleteCategoryAction}>
                          <input type="hidden" name="categoryId" value={category.id} />
                          <ConfirmSubmit
                            message={`Delete ${category.name}? Only empty categories can be deleted.`}
                            className="text-[9px] uppercase tracking-[0.1em] text-steel-600 hover:text-danger"
                          >
                            Delete
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-ink-900 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-white">
              {editing ? "Edit category" : "Add category"}
            </h2>
            {editing ? (
              <Link href="/admin/categories" className="text-[9px] uppercase tracking-[0.12em] text-steel-500 hover:text-white">
                Cancel
              </Link>
            ) : null}
          </div>
          <form action={saveCategoryAction} className="mt-4 space-y-4">
            <input type="hidden" name="returnTo" value="/admin/categories" />
            {editing ? <input type="hidden" name="categoryId" value={editing.id} /> : null}
            <Field label="Name" name="name" defaultValue={editing?.name} required />
            <Field
              label="Slug"
              name="slug"
              defaultValue={editing?.slug}
              hint="Leave blank to generate from the name."
            />
            <Textarea label="Description" name="description" defaultValue={editing?.description ?? ""} rows={3} />
            <Field
              label="Sort order"
              name="sortOrder"
              type="number"
              min="0"
              defaultValue={editing?.sortOrder ?? categories.length + 1}
            />
            <Field
              label="Image URL"
              name="imageUrl"
              defaultValue={editing?.imageUrl ?? ""}
              placeholder="/products/slug/1.webp"
            />
            <div>
              <label className="field-label" htmlFor="categoryImage">Upload image (optional)</label>
              <input
                id="categoryImage"
                type="file"
                name="imageFile"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="block w-full text-[11px] text-steel-400 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-[11px] file:text-white"
              />
            </div>
            <label className="flex items-center gap-2.5 text-xs text-steel-300">
              <input type="checkbox" name="isActive" defaultChecked={editing ? editing.isActive : true} className="size-4 accent-flame-500" />
              Visible on the storefront
            </label>
            <button
              type="submit"
              className="h-10 w-full rounded-lg bg-flame-500 font-display text-xs font-semibold text-ink-950 transition hover:bg-flame-400"
            >
              {editing ? "Save category" : "Create category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
