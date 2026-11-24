import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { buildMetadata, organizationJsonLd, serializeJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/utils";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  ...buildMetadata({}),
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Total Fire & Safety Solution — Industrial Safety & PPE, Karachi",
    template: "%s | Total Fire & Safety Solution",
  },
  keywords: [
    "safety equipment Karachi",
    "PPE supplier Pakistan",
    "fall protection harness",
    "safety helmets",
    "industrial gloves",
    "fire safety equipment",
    "Total Fire & Safety Solution",
  ],
  icons: {
    icon: [{ url: "/icon.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/icon.png", sizes: "512x512" }],
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07080A",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd()) }}
        />
      </body>
    </html>
  );
}
