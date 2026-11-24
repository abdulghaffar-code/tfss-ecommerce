import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { deleteBrandAction, saveBrandAction } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { Flash } from "@/components/admin/Flash";
import { Field, Textarea } from "@/components/ui/Field";
import { prisma } from "@/lib/prisma";

export default async function AdminBrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  const editing = brands.find((brand) => brand.id === params.edit);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Manufacturers"
        description="Manage manufacturer names and logos used across the catalogue and homepage strip."
      />
      <Flash saved={params.saved} error={params.error} />

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-[9px] uppercase tracking-[0.12em] text-steel-600">
              <tr>
                <th className="px-4 py-3 font-medium">Manufacturer</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {brands.map((brand) => (
                <tr key={brand.id} className={params.edit === brand.id ? "bg-flame-500/[0.04]" : ""}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded bg-white p-1">
                        {brand.logoUrl ? (
                          <Image src={brand.logoUrl} alt={brand.name} width={80} height={32} className="max-h-7 w-auto object-contain" />
                        ) : (
                          <span className="text-[8px] text-ink-700">{brand.name.slice(0, 2)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{brand.name}</p>
                        <p className="mt-0.5 text-[9px] text-steel-600">{brand.isActive ? "Visible" : "Hidden"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-steel-400">{brand.slug}</td>
                  <td className="px-4 py-3 text-steel-300">{brand._count.products}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/brands?edit=${brand.id}`} className="flex items-center gap-1 text-[9px] uppercase tracking-[0.1em] text-steel-400 hover:text-white">
                        <Pencil className="size-3" /> Edit
                      </Link>
                      <form action={deleteBrandAction}>
                        <input type="hidden" name="brandId" value={brand.id} />
                        <ConfirmSubmit
                          message={`Delete ${brand.name}? Products must be reassigned first.`}
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

        <div className="rounded-xl border border-white/10 bg-ink-900 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-white">
              {editing ? "Edit manufacturer" : "Add manufacturer"}
            </h2>
            {editing ? (
              <Link href="/admin/brands" className="text-[9px] uppercase tracking-[0.12em] text-steel-500 hover:text-white">
                Cancel
              </Link>
            ) : null}
          </div>
          <form action={saveBrandAction} className="mt-4 space-y-4">
            <input type="hidden" name="returnTo" value="/admin/brands" />
            {editing ? <input type="hidden" name="brandId" value={editing.id} /> : null}
            <Field label="Name" name="name" defaultValue={editing?.name} required />
            <Field label="Slug" name="slug" defaultValue={editing?.slug} hint="Leave blank to generate." />
            <Textarea label="Description" name="description" defaultValue={editing?.description ?? ""} rows={2} />
            <Field label="Logo URL" name="logoUrl" defaultValue={editing?.logoUrl ?? ""} />
            <div>
              <label className="field-label" htmlFor="logoFile">Upload logo (optional)</label>
              <input
                id="logoFile"
                type="file"
                name="logoFile"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="block w-full text-[11px] text-steel-400 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-[11px] file:text-white"
              />
            </div>
            <label className="flex items-center gap-2.5 text-xs text-steel-300">
              <input type="checkbox" name="isActive" defaultChecked={editing ? editing.isActive : true} className="size-4 accent-flame-500" />
              Visible on the storefront
            </label>
            <button type="submit" className="h-10 w-full rounded-lg bg-flame-500 font-display text-xs font-semibold text-ink-950 transition hover:bg-flame-400">
              {editing ? "Save manufacturer" : "Create manufacturer"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
