import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { getSiteUrl } from "@/lib/utils";

export function buildMetadata(options: {
  title?: string;
  description?: string;
  path?: string;
  image?: string | null;
  noIndex?: boolean;
}): Metadata {
  const url = getSiteUrl() + (options.path ?? "/");
  const title = options.title ?? `${SITE_NAME} — Industrial Safety & PPE, Karachi`;
  const description = options.description ?? SITE_DESCRIPTION;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_PK",
      images: options.image
        ? [{ url: options.image.startsWith("http") ? options.image : getSiteUrl() + options.image }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: options.noIndex ? { index: false, follow: false } : undefined,
  };
}

export function serializeJsonLd(value: unknown) {
  // Escape `<` so admin-authored product copy cannot close the script tag.
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url: getSiteUrl(),
    telephone: "+92-21-32434289",
    email: "info@totalfirensafety.com",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Shop # 1-B, Adnan Center, Ground Floor, Nicol Road",
      addressLocality: "Karachi",
      addressCountry: "PK",
    },
    foundingDate: "1992",
  };
}

export function productJsonLd(product: {
  name: string;
  slug: string;
  description: string;
  sku: string;
  image: string | null;
  price: number;
  stock: number;
  brand: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    image: product.image ? getSiteUrl() + product.image : undefined,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    offers: {
      "@type": "Offer",
      url: `${getSiteUrl()}/product/${product.slug}`,
      priceCurrency: "PKR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
}
