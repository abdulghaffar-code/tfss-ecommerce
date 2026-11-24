import Image from "next/image";
import { Save } from "lucide-react";
import { saveSettingsAction } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Flash } from "@/components/admin/Flash";
import { Field, Textarea } from "@/components/ui/Field";
import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const settings = await prisma.companySettings.findUnique({ where: { id: "main" } });

  return (
    <div>
      <AdminPageHeader
        eyebrow="Storefront"
        title="Company settings"
        description="Contact details, brand logo, founder image and the announcement strip. These details appear across the storefront and structured data."
      />
      <Flash saved={params.saved} error={params.error} />

      <form action={saveSettingsAction} className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <input type="hidden" name="returnTo" value="/admin/settings" />

        <div className="space-y-5">
          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Company</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Company name" name="companyName" defaultValue={settings?.companyName ?? "Total Fire & Safety Solution"} required className="sm:col-span-2" />
              <Field label="Tagline" name="tagline" defaultValue={settings?.tagline ?? "Protect • Prevent • Perform"} className="sm:col-span-2" />
              <Field label="Phone" name="phone" defaultValue={settings?.phone ?? "+92-21-32434289"} required />
              <Field label="Alternate phone" name="phoneAlt" defaultValue={settings?.phoneAlt ?? ""} />
              <Field label="Email" name="email" type="email" defaultValue={settings?.email ?? "info@totalfirensafety.com"} required className="sm:col-span-2" />
              <Textarea label="Showroom address" name="address" defaultValue={settings?.address ?? ""} required className="sm:col-span-2" rows={2} />
              <Textarea label="Sister concern address" name="safelinkAddress" defaultValue={settings?.safelinkAddress ?? ""} className="sm:col-span-2" rows={2} />
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Location &amp; announcement</h2>
            <div className="mt-4 space-y-4">
              <Textarea
                label="Google Maps embed URL"
                name="mapEmbedUrl"
                defaultValue={settings?.mapEmbedUrl ?? ""}
                rows={3}
                hint="Must start with https://www.google.com/maps/embed or https://maps.google.com"
              />
              <Field
                label="Top announcement"
                name="announcement"
                defaultValue={settings?.announcement ?? ""}
                placeholder="Leave blank for the default heritage line."
                hint="Shown in the slim bar above the header on every storefront page."
              />
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Logo</h2>
            <div className="mt-3 flex items-center justify-center rounded-lg bg-ink-950 p-4">
              {settings?.logoUrl ? (
                <Image src={settings.logoUrl} alt="Current logo" width={280} height={104} className="h-14 w-auto object-contain" />
              ) : (
                <span className="text-xs text-steel-500">No logo set</span>
              )}
            </div>
            <div className="mt-4 space-y-3">
              <Field label="Logo URL" name="logoUrl" defaultValue={settings?.logoUrl ?? ""} />
              <div>
                <label className="field-label" htmlFor="logoFile">Upload logo</label>
                <input
                  id="logoFile"
                  type="file"
                  name="logoFile"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="block w-full text-[11px] text-steel-400 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-[11px] file:text-white"
                />
              </div>
              <p className="text-[10px] leading-relaxed text-steel-600">
                Use a wide logo with a transparent or dark-friendly background. A
                white-on-transparent version works best in the dark header.
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Founder image</h2>
            {settings?.ownerImageUrl ? (
              <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-lg bg-ink-850">
                <Image src={settings.ownerImageUrl} alt="Founder" fill sizes="320px" className="object-cover object-top" />
              </div>
            ) : null}
            <div className="mt-4 space-y-3">
              <Field label="Image URL" name="ownerImageUrl" defaultValue={settings?.ownerImageUrl ?? ""} />
              <div>
                <label className="field-label" htmlFor="ownerFile">Upload image</label>
                <input
                  id="ownerFile"
                  type="file"
                  name="ownerFile"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="block w-full text-[11px] text-steel-400 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-[11px] file:text-white"
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-flame-500 font-display text-xs font-semibold text-ink-950 transition hover:bg-flame-400"
          >
            <Save className="size-4" /> Save settings
          </button>
        </aside>
      </form>
    </div>
  );
}
