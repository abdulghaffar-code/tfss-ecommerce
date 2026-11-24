import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import type { Settings } from "@/lib/settings";

const shopLinks = [
  ["Shop all products", "/shop"],
  ["Manufacturers", "/brands"],
  ["Product catalogue", "/catalogue"],
  ["Request a quotation", "/contact"],
];

const companyLinks = [
  ["About us", "/about"],
  ["Our history", "/history"],
  ["Mission & approach", "/mission"],
  ["Contact", "/contact"],
];

const policyLinks = [
  ["Shipping policy", "/shipping"],
  ["Returns & exchanges", "/returns"],
  ["Privacy policy", "/privacy"],
  ["Terms of service", "/terms"],
];

export function Footer({
  settings,
  categories,
}: {
  settings: Settings;
  categories: { slug: string; name: string }[];
}) {
  return (
    <footer className="border-t border-white/10 bg-ink-900">
      <div className="shell py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <Image
              src={settings.logoUrl || "/brand/logo-emblem-mono.png"}
              alt={settings.companyName}
              width={320}
              height={119}
              className="h-14 w-auto object-contain object-left"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-steel-400">
              Industrial safety and personal protective equipment for Karachi&apos;s
              plants, contractors and crews. Serving industry from the same
              family business since 1992.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <a
                href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-start gap-3 text-steel-300 transition hover:text-white"
              >
                <Phone className="mt-0.5 size-4 shrink-0 text-flame-500" />
                <span>
                  {settings.phone}
                  {settings.phoneAlt ? (
                    <span className="block text-steel-500">{settings.phoneAlt}</span>
                  ) : null}
                </span>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-start gap-3 text-steel-300 transition hover:text-white"
              >
                <Mail className="mt-0.5 size-4 shrink-0 text-flame-500" />
                {settings.email}
              </a>
              <p className="flex items-start gap-3 text-steel-400">
                <MapPin className="mt-0.5 size-4 shrink-0 text-flame-500" />
                {settings.address}
              </p>
            </div>
          </div>

          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Policies" links={policyLinks} />
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="eyebrow">Categories</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="text-[12px] text-steel-500 transition hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-[11px] text-steel-500 md:flex-row md:items-start md:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.companyName}. All rights
            reserved. Established 1992 by Mr. Muhammad Rizwan Siddique.
          </p>
          <p className="max-w-md md:text-right">
            This is a demonstration storefront. Product names, model numbers,
            prices and stock are fictional sample data. Certifications,
            partnerships and reviews are not published unless verified in
            writing.
          </p>
        </div>

        <div className="mt-5">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-steel-400 transition hover:text-flame-400"
          >
            Talk to our team <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[][];
}) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 space-y-3">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="text-[13px] text-steel-300 transition hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
