import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { ContactPanel } from "@/components/home/ContactPanel";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { getSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact & location",
  description:
    "Contact Total Fire & Safety Solution at Shop # 1-B, Adnan Center, Nicol Road, Karachi. Phone +92-21-32434289 or email info@totalfirensafety.com.",
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Bring the requirement to the counter."
        description="Call, write or visit. For quotations, the more detail you share about the hazard, quantity and site, the more useful our answer will be."
        crumbs={[{ label: "Contact" }]}
      />

      <div className="shell py-12 lg:py-16">
        <div className="grid gap-6 border-b border-white/10 pb-12 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <Phone className="size-4 text-flame-500" />
            <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-steel-500">Call</p>
            <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="mt-1 block text-sm text-white hover:text-flame-400">
              {settings.phone}
            </a>
            {settings.phoneAlt ? (
              <a href={`tel:${settings.phoneAlt.replace(/[^+\d]/g, "")}`} className="block text-sm text-steel-300 hover:text-white">
                {settings.phoneAlt}
              </a>
            ) : null}
          </div>
          <div className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <Mail className="size-4 text-flame-500" />
            <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-steel-500">Email</p>
            <a href={`mailto:${settings.email}`} className="mt-1 block break-all text-sm text-white hover:text-flame-400">
              {settings.email}
            </a>
            <p className="mt-1 text-[11px] text-steel-500">For orders, include the order number.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <MapPin className="size-4 text-flame-500" />
            <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-steel-500">Visit</p>
            <p className="mt-1 text-sm leading-relaxed text-white">{settings.address}</p>
          </div>
        </div>

        <div className="grid gap-10 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow">Send an inquiry</p>
            <h2 className="mt-4 text-3xl leading-[1.04] tracking-tightest sm:text-4xl">
              Tell us what you need.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-steel-400">
              Inquiries are recorded in the store dashboard so the team can follow
              up. We will respond during business hours; this form does not create
              an order or reserve stock.
            </p>

            <div className="mt-8 space-y-5 text-sm">
              <div className="border-l border-flame-500/50 pl-4">
                <p className="text-[10px] uppercase tracking-[0.14em] text-steel-500">
                  Total Fire &amp; Safety Solution
                </p>
                <p className="mt-1 leading-relaxed text-steel-300">{settings.address}</p>
              </div>
              {settings.safelinkAddress ? (
                <div className="border-l border-white/15 pl-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-steel-500">
                    Safelink Trading Co.
                  </p>
                  <p className="mt-1 leading-relaxed text-steel-300">{settings.safelinkAddress}</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-8">
            <InquiryForm submitLabel="Send inquiry" />
          </div>
        </div>

        <ContactPanel settings={settings} />
      </div>
    </>
  );
}
