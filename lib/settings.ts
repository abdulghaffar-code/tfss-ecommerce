import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type Settings = {
  companyName: string;
  tagline: string;
  phone: string;
  phoneAlt: string | null;
  email: string;
  address: string;
  safelinkAddress: string | null;
  mapEmbedUrl: string | null;
  logoUrl: string | null;
  ownerImageUrl: string | null;
  announcement: string | null;
};

const fallback: Settings = {
  companyName: "Total Fire & Safety Solution",
  tagline: "Protect • Prevent • Perform",
  phone: "+92-21-32434289",
  phoneAlt: "+92-21-32419200",
  email: "info@totalfirensafety.com",
  address:
    "Shop # 1-B, Adnan Center, Ground Floor, Nicol Road, Karachi, Pakistan",
  safelinkAddress: "Shop # 5-A, 1st Floor, Adnan Center, Nicol Road, Karachi",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d7240.704507217973!2d67.00064!3d24.851816!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1795502756818!5m2!1sen!2sus",
  logoUrl: "/brand/logo-emblem-mono.png",
  ownerImageUrl: "/company/owner.jpg",
  announcement: null,
};

export const getSettings = cache(async (): Promise<Settings> => {
  try {
    const row = await prisma.companySettings.findUnique({ where: { id: "main" } });
    if (!row) return fallback;
    return {
      companyName: row.companyName,
      tagline: row.tagline,
      phone: row.phone,
      phoneAlt: row.phoneAlt,
      email: row.email,
      address: row.address,
      safelinkAddress: row.safelinkAddress,
      mapEmbedUrl: row.mapEmbedUrl,
      logoUrl: row.logoUrl,
      ownerImageUrl: row.ownerImageUrl,
      announcement: row.announcement,
    };
  } catch {
    return fallback;
  }
});
