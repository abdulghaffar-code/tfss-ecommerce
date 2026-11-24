import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryMosaic } from "@/components/home/CategoryMosaic";
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollStatement } from "@/components/home/ScrollStatement";
import { Manufacturers } from "@/components/home/Manufacturers";
import { CompanyStory } from "@/components/home/CompanyStory";
import { WhyUs } from "@/components/home/WhyUs";
import { Industries } from "@/components/home/Industries";
import { ContactPanel } from "@/components/home/ContactPanel";
import { PromoVideo } from "@/components/home/PromoVideo";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import {
  getBestSellers,
  getBrands,
  getCategories,
  getFeaturedProducts,
} from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";

export const metadata = {
  ...buildMetadata({
    title: "Total Fire & Safety Solution — Industrial Safety & PPE, Karachi",
    description:
      "Industrial safety and PPE supplier in Karachi since 1992. Fall protection, safety helmets, gloves, respiratory protection, safety footwear, fire safety and site safety equipment.",
    path: "/",
  }),
  title: {
    absolute:
      "Total Fire & Safety Solution — Industrial Safety & PPE, Karachi",
  },
};

export default async function HomePage() {
  const user = await getCurrentUser();
  const [settings, categories, featured, bestSellers, brands, banners, wishlist] =
    await Promise.all([
      getSettings(),
      getCategories(true),
      getFeaturedProducts(8),
      getBestSellers(8),
      getBrands(true),
      prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      user
        ? prisma.wishlistItem.findMany({
            where: { wishlist: { userId: user.id } },
            select: { productId: true },
          })
        : Promise.resolve([]),
    ]);

  const saved = new Set(wishlist.map((item) => item.productId));
  const slides = banners.map((banner) => ({
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    imageUrl: banner.imageUrl,
    href: banner.href,
    ctaLabel: banner.ctaLabel,
  }));

  return (
    <>
      <Hero />

      <section className="shell py-16 sm:py-20">
        <SectionHeading
          eyebrow="In the field"
          title="The work we equip."
          description="A look at the equipment categories our customers rely on — from height safety to the last cone on the site boundary."
          href="/shop"
          linkLabel="Browse all products"
          className="mb-8"
        />
        <Reveal>
          <HeroSlider slides={slides} />
        </Reveal>
      </section>

      <section className="border-y border-white/[0.08] bg-ink-900/40">
        <div className="shell py-16 sm:py-20">
          <SectionHeading
            eyebrow="Categories"
            title="Start with the hazard."
            description="Fourteen industrial categories under one roof. Product availability is confirmed before any order is accepted."
            href="/shop"
            linkLabel="All 14 categories"
            className="mb-8"
          />
          <Reveal>
            <CategoryMosaic
              categories={categories.slice(0, 9).map((category) => ({
                slug: category.slug,
                name: category.name,
                description: category.description ?? "",
                imageUrl: category.imageUrl,
                count: category._count.products,
              }))}
            />
          </Reveal>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <SectionHeading
          eyebrow="Field essentials"
          title="Equipment worth reaching for."
          description="A selection of everyday lines from the catalogue. Every price below is a fictional sample for this demonstration storefront."
          href="/shop"
          linkLabel="Shop the catalogue"
          className="mb-8"
        />
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {featured.map((product, index) => (
            <Reveal key={product.id} delay={Math.min(index * 0.04, 0.2)}>
              <ProductCard
                product={product}
                saved={saved.has(product.id)}
                priority={index < 4}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <ScrollStatement />

      <section className="border-y border-white/[0.08] bg-ink-900/40">
        <div className="shell py-16 sm:py-20">
          <SectionHeading
            eyebrow="Popular lines"
            title="Best sellers & crew favourites."
            description="Ranked by order history where available, with featured stock filling the shelf for this new storefront."
            href="/shop"
            linkLabel="Shop all"
            className="mb-8"
          />
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {bestSellers.slice(0, 8).map((product, index) => (
              <Reveal key={product.id} delay={Math.min(index * 0.04, 0.2)}>
                <ProductCard product={product} saved={saved.has(product.id)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <SectionHeading
          eyebrow="Manufacturers"
          title="Brands in the catalogue."
          description="Manufacturer names represented across the sample catalogue. Ask us for the current line card and genuine product documentation."
          href="/brands"
          linkLabel="Manufacturer index"
          className="mb-8"
        />
        <Reveal>
          <Manufacturers
            brands={brands.map((brand) => ({
              id: brand.id,
              name: brand.name,
              slug: brand.slug,
              logoUrl: brand.logoUrl,
              count: brand._count.products,
            }))}
          />
        </Reveal>
      </section>

      <section className="border-y border-white/[0.08] bg-ink-900/40">
        <div className="shell grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-14">
          <Reveal>
            <PromoVideo />
          </Reveal>
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-flame-500" aria-hidden />
              Inside the safety house
            </p>
            <h2 className="mt-4 text-3xl leading-[1.04] tracking-tightest sm:text-4xl lg:text-[2.9rem]">
              Thirty years of
              <br />
              <span className="text-steel-400">knowing the kit.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-steel-300">
              A short look inside the catalogue and the work it serves. No
              stock-footage heroics — just the categories, the materials and
              the counter where customers have been buying safety equipment
              since 1992.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/catalogue"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 font-display text-sm font-semibold text-ink-950 transition hover:bg-steel-100"
              >
                View the catalogue <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/history"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/20 px-5 font-display text-sm font-semibold text-white transition hover:border-white/40"
              >
                Our history
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-16 sm:py-24">
        <Reveal>
          <CompanyStory ownerImageUrl={settings.ownerImageUrl} />
        </Reveal>
      </section>

      <section className="border-y border-white/[0.08] bg-ink-900/40">
        <div className="shell py-16 sm:py-20">
          <WhyUs />
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <SectionHeading
          eyebrow="Who we supply"
          title="Built around industrial work."
          description="Different sites, different hazards. Tell us the environment and we will work back to the equipment."
          className="mb-8"
        />
        <Reveal>
          <Industries />
        </Reveal>
      </section>

      <section className="relative overflow-hidden border-y border-white/[0.08] bg-ink-900">
        <div
          className="pointer-events-none absolute -left-32 top-0 h-[380px] w-[380px] rounded-full bg-flame-500/[0.12] blur-[100px]"
          aria-hidden
        />
        <div className="shell relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow">Request a quotation</p>
            <h2 className="mt-4 text-3xl leading-[1.04] tracking-tightest sm:text-4xl lg:text-[2.9rem]">
              Tell us the site.
              <br />
              <span className="text-steel-400">We&apos;ll match the kit.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-steel-400">
              Send the product, quantity and site requirements. For urgent
              requirements, call the counter directly — we will tell you what
              is genuinely available.
            </p>
            <div className="mt-8 space-y-2 text-sm">
              <a
                href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
                className="block font-display text-2xl font-semibold text-white transition hover:text-flame-400"
              >
                {settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="block text-steel-400 transition hover:text-white"
              >
                {settings.email}
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-950/60 p-6 backdrop-blur sm:p-8">
            <InquiryForm />
          </div>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <SectionHeading
          eyebrow="Find us"
          title="Nicol Road, Karachi."
          description="Two addresses, one counter. Come in with the job in mind."
          className="mb-8"
        />
        <Reveal>
          <ContactPanel settings={settings} />
        </Reveal>
      </section>
    </>
  );
}
