import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { deleteBannerAction, saveBannerAction } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { Flash } from "@/components/admin/Flash";
import { Field, Textarea } from "@/components/ui/Field";
import { prisma } from "@/lib/prisma";

export default async function AdminBannersPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
  const editing = banners.find((banner) => banner.id === params.edit);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Storefront"
        title="Homepage slider"
        description="The six-image field slider on the homepage. Images are 16:9; uploads are optimised automatically."
      />
      <Flash saved={params.saved} error={params.error} />

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={
                editing?.id === banner.id
                  ? "flex flex-col gap-4 rounded-xl border border-flame-500/40 bg-ink-900 p-4 sm:flex-row"
                  : "flex flex-col gap-4 rounded-xl border border-white/10 bg-ink-900 p-4 sm:flex-row"
              }
            >
              <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-lg bg-ink-850 sm:w-48">
                <Image src={banner.imageUrl} alt="" fill sizes="200px" className="object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{banner.title}</p>
                    <p className="mt-1 line-clamp-2 text-[11px] text-steel-500">{banner.subtitle}</p>
                  </div>
                  <span className={banner.isActive ? "shrink-0 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[8px] font-semibold text-success" : "shrink-0 rounded-full border border-white/15 px-2 py-0.5 text-[8px] font-semibold text-steel-500"}>
                    {banner.isActive ? "LIVE" : "HIDDEN"}
                  </span>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 text-[9px] text-steel-600">
                  <span>Order {banner.sortOrder} · {banner.href ?? "No link"}</span>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/banners?edit=${banner.id}`} className="flex items-center gap-1 uppercase tracking-[0.1em] text-steel-400 hover:text-white">
                      <Pencil className="size-3" /> Edit
                    </Link>
                    <form action={deleteBannerAction}>
                      <input type="hidden" name="bannerId" value={banner.id} />
                      <ConfirmSubmit
                        message={`Delete slide “${banner.title}”?`}
                        className="uppercase tracking-[0.1em] text-steel-600 hover:text-danger"
                      >
                        Delete
                      </ConfirmSubmit>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 bg-ink-900 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-white">
              {editing ? "Edit slide" : "Add slide"}
            </h2>
            {editing ? (
              <Link href="/admin/banners" className="text-[9px] uppercase tracking-[0.12em] text-steel-500 hover:text-white">
                Cancel
              </Link>
            ) : null}
          </div>
          <form action={saveBannerAction} className="mt-4 space-y-4">
            <input type="hidden" name="returnTo" value="/admin/banners" />
            {editing ? <input type="hidden" name="bannerId" value={editing.id} /> : null}
            <Field label="Title" name="title" defaultValue={editing?.title} required />
            <Textarea label="Subtitle" name="subtitle" defaultValue={editing?.subtitle ?? ""} rows={3} />
            <Field label="Image URL" name="imageUrl" defaultValue={editing?.imageUrl ?? ""} placeholder="/hero/slider-01.webp" />
            <div>
              <label className="field-label" htmlFor="bannerImage">Upload image (optional)</label>
              <input
                id="bannerImage"
                type="file"
                name="imageFile"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="block w-full text-[11px] text-steel-400 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-[11px] file:text-white"
              />
            </div>
            <Field label="Link path" name="href" defaultValue={editing?.href ?? ""} placeholder="/category/fall-protection" hint="Internal path only." />
            <Field label="Button label" name="ctaLabel" defaultValue={editing?.ctaLabel ?? ""} />
            <Field label="Sort order" name="sortOrder" type="number" min="0" defaultValue={editing?.sortOrder ?? banners.length + 1} />
            <label className="flex items-center gap-2.5 text-xs text-steel-300">
              <input type="checkbox" name="isActive" defaultChecked={editing ? editing.isActive : true} className="size-4 accent-flame-500" />
              Show on the homepage
            </label>
            <button type="submit" className="h-10 w-full rounded-lg bg-flame-500 font-display text-xs font-semibold text-ink-950 transition hover:bg-flame-400">
              {editing ? "Save slide" : "Create slide"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
