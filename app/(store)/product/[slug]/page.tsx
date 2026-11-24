import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Banknote,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { WishlistButton } from "@/components/product/WishlistButton";
import { ProductCard } from "@/components/product/ProductCard";
import { Product3DViewer } from "@/components/three/ModelViewer";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildMetadata, productJsonLd, serializeJsonLd } from "@/lib/seo";
import { formatPrice, stockLabel } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return buildMetadata({
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
    path: `/product/${product.slug}`,
    image: product.images[0]?.url ?? null,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const user = await getCurrentUser();
  const [related, saved, announcement] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id, 4),
    user
      ? prisma.wishlistItem.findUnique({
          where: {
            wishlistId_productId: {
              wishlistId: (
                await prisma.wishlist.findUnique({
                  where: { userId: user.id },
                  select: { id: true },
                })
              )?.id ?? "",
              productId: product.id,
            },
          },
          select: { id: true },
        })
      : Promise.resolve(null),
    prisma.companySettings.findUnique({
      where: { id: "main" },
      select: { announcement: true },
    }),
  ]);

  const price = Number(product.salePrice ?? product.price);
  const regular = Number(product.price);
  const onSale = product.salePrice !== null && price < regular;
  const stock = stockLabel(product.stock);
  const specs = Array.isArray(product.specs)
    ? (product.specs as { label?: string; value?: string }[])
    : [];
  const images = product.images.map((image) => ({
    id: image.id,
    url: image.url,
    alt: image.alt,
  }));

  return (
    <div className="shell py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: product.category.name, href: `/category/${product.category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={images} name={product.name} />
          {product.modelUrl ? (
            <Product3DViewer
              url={product.modelUrl}
              name={product.name}
              poster={images[0]?.url ?? null}
            />
          ) : null}
        </div>

        <div className="lg:py-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.14em]">
            <span className="text-flame-400">{product.brand?.name ?? "Industrial supply"}</span>
            <span className="text-steel-600">/</span>
            <span className="text-steel-500">{product.category.name}</span>
            <span className="text-steel-600">/</span>
            <span className="font-mono text-steel-500">SKU {product.sku}</span>
          </div>

          <h1 className="mt-4 text-[clamp(1.9rem,4vw,3.1rem)] font-semibold leading-[1.02] tracking-tightest">
            {product.name}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-steel-300">
            {product.shortDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2 border-y border-white/10 py-5">
            <p className="font-display text-3xl font-semibold text-white">
              {formatPrice(price)}
            </p>
            {onSale ? (
              <>
                <p className="pb-1 text-sm text-steel-500 line-through">
                  {formatPrice(regular)}
                </p>
                <span className="mb-1.5 rounded bg-flame-500 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-ink-950">
                  Save {Math.round(((regular - price) / regular) * 100)}%
                </span>
              </>
            ) : null}
            <span
              className={
                stock.tone === "ok"
                  ? "ml-auto pb-1 text-[10px] uppercase tracking-[0.14em] text-success"
                  : stock.tone === "warn"
                    ? "ml-auto pb-1 text-[10px] uppercase tracking-[0.14em] text-safety-400"
                    : "ml-auto pb-1 text-[10px] uppercase tracking-[0.14em] text-danger"
              }
            >
              {product.stock > 0
                ? `${stock.label} · ${product.stock} units`
                : stock.label}
            </span>
          </div>

          <div className="mt-6">
            <AddToCartForm productId={product.id} stock={product.stock} />
          </div>

          <div className="mt-3">
            <WishlistButton
              productId={product.id}
              initialSaved={Boolean(saved)}
              withLabel
              className="[&>button]:h-11 [&>button]:w-full [&>button]:rounded-lg [&>button]:bg-transparent"
            />
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-steel-500">
            {announcement?.announcement
              ? announcement.announcement
              : `Free delivery over ${formatPrice(FREE_SHIPPING_THRESHOLD)}. Flat ${formatPrice(FLAT_SHIPPING)} delivery below that. Stock and price are validated again at checkout.`}
          </p>

          <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {[
              {
                icon: Truck,
                title: "Karachi delivery",
                note: "Flat PKR 250 below PKR 15,000; free above.",
              },
              {
                icon: Banknote,
                title: "COD or bank transfer",
                note: "Payment marked paid only after verification.",
              },
              {
                icon: PackageCheck,
                title: "Counter collection",
                note: "Collect from Nicol Road by arrangement.",
              },
              {
                icon: ShieldCheck,
                title: "Specification support",
                note: "Ask for sizing, standards and documentation.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 bg-ink-900 p-4">
                <item.icon className="mt-0.5 size-4 shrink-0 text-flame-500" />
                <div>
                  <p className="text-xs font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-steel-500">
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 rounded-lg border border-safety-500/20 bg-safety-500/[0.06] px-3.5 py-2.5 text-[11px] leading-relaxed text-safety-400/80">
            Demonstration catalogue: this product name, model number, price and
            stock level are sample data. Ask us to confirm the genuine
            specification before purchase.
          </p>
        </div>
      </div>

      <div className="mt-14 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Product details
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-steel-300">
            {product.description.split(/\n\n+/).map((paragraph) => (
              <p key={paragraph.slice(0, 30)}>{paragraph}</p>
            ))}
          </div>

          {specs.length > 0 ? (
            <div className="mt-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Specifications
              </h2>
              <dl className="mt-4 divide-y divide-white/10 border-y border-white/10">
                {specs.map((spec, index) => (
                  <div
                    key={`${spec.label}-${index}`}
                    className="grid grid-cols-[0.8fr_1.2fr] gap-4 py-3 text-sm"
                  >
                    <dt className="text-steel-500">{spec.label}</dt>
                    <dd className="text-steel-200">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[10px] text-steel-600">
                Specifications are indicative sample data, not a compliance
                statement. Request current manufacturer documentation for the
                exact model.
              </p>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-ink-900 p-6">
          <p className="eyebrow">Ask about this line</p>
          <h2 className="mt-3 font-display text-xl font-semibold">
            Need sizing, bulk pricing or a data sheet?
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-steel-400">
            Send an inquiry and our team will respond during business hours with
            availability and the next practical step.
          </p>
          <div className="mt-5">
            <InquiryForm
              productId={product.id}
              compact
              submitLabel="Ask about this product"
            />
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-white/10 pt-10">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="eyebrow">Same category</p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                Related equipment
              </h2>
            </div>
            <Link
              href={`/category/${product.category.slug}`}
              className="text-xs font-semibold text-steel-400 transition hover:text-white"
            >
              View category →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                saved={false}
              />
            ))}
          </div>
        </section>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            productJsonLd({
              name: product.name,
              slug: product.slug,
              description: product.shortDescription,
              sku: product.sku,
              image: images[0]?.url ?? null,
              price,
              stock: product.stock,
              brand: product.brand?.name ?? null,
            })
          ),
        }}
      />
    </div>
  );
}
