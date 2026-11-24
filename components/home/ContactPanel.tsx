import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import type { Settings } from "@/lib/settings";

export function ContactPanel({ settings }: { settings: Settings }) {
  const tel = settings.phone.replace(/[^+\d]/g, "");
  const telAlt = settings.phoneAlt?.replace(/[^+\d]/g, "");

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-8">
        <div>
          <p className="eyebrow">Visit · call · write</p>
          <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-white">
            The Karachi safety counter
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-steel-400">
            Bring the hazard, the drawing or the old worn-out sample. We will
            help you find the closest practical match from stock or source it
            to order.
          </p>

          <div className="mt-7 space-y-5">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-flame-500" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-steel-500">
                  Showroom
                </p>
                <p className="mt-1 text-sm leading-relaxed text-steel-200">
                  {settings.address}
                </p>
                {settings.safelinkAddress ? (
                  <p className="mt-2 text-xs leading-relaxed text-steel-500">
                    Sister concern — Safelink Trading Co.
                    <br />
                    {settings.safelinkAddress}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-flame-500" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-steel-500">
                  Phone
                </p>
                <a
                  href={`tel:${tel}`}
                  className="mt-1 block text-sm text-steel-200 transition hover:text-white"
                >
                  {settings.phone}
                </a>
                {settings.phoneAlt && telAlt ? (
                  <a
                    href={`tel:${telAlt}`}
                    className="block text-sm text-steel-200 transition hover:text-white"
                  >
                    {settings.phoneAlt}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-flame-500" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-steel-500">
                  Email
                </p>
                <a
                  href={`mailto:${settings.email}`}
                  className="mt-1 block text-sm text-steel-200 transition hover:text-white"
                >
                  {settings.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <a
          href="https://maps.app.goo.gl/TLKJ3rrXSS5gqUpH6"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-1.5 border-b border-white/25 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:border-flame-500 hover:text-flame-300"
        >
          Open in Google Maps <ArrowUpRight className="size-3.5" />
        </a>
      </div>

      <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-ink-850">
        {settings.mapEmbedUrl ? (
          <iframe
            src={settings.mapEmbedUrl}
            title="Total Fire & Safety Solution location on Google Maps"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full grayscale-[0.35] contrast-[1.05]"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center text-sm text-steel-500">
            Map embed is configured in the admin settings.
          </div>
        )}
      </div>
    </div>
  );
}
