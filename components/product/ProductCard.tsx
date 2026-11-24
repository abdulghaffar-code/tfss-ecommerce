import Image from "next/image";
import Link from "next/link";
import { QuickAddButton } from "@/components/product/QuickAddButton";
import { WishlistButton } from "@/components/product/WishlistButton";
import { formatPrice, stockLabel } from "@/lib/utils";
import type { ProductCardData } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  saved = false,
  priority = false,
  className,
}: {
  product: ProductCardData;
  saved?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const price = product.salePrice ?? product.price;
  const onSale = product.salePrice !== null && product.salePrice < product.price;
  const stock = stockLabel(product.stock);
  const href = `/product/${product.slug}`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-ink-900 transition-colors hover:border-white/20",
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-steel-100">
        <Link href={href} aria-label={product.name} className="absolute inset-0 z-10">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-ink-600">
              Image coming soon
            </span>
          )}
        </Link>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-between p-3">
          <div className="flex flex-col gap-1.5">
            {onSale ? (
              <span className="w-fit rounded bg-flame-500 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-ink-950">
                Sale
              </span>
            ) : null}
            {product.isFeatured && !onSale ? (
              <span className="w-fit rounded bg-ink-950/80 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
                Featured
              </span>
            ) : null}
          </div>
          <div className="pointer-events-auto">
            <WishlistButton productId={product.id} initialSaved={saved} />
          </div>
        </div>

        <div className="absolute bottom-3 right-3 z-20 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          <QuickAddButton productId={product.id} stock={product.stock} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-[9px] uppercase tracking-[0.14em] text-steel-500">
          <span className="truncate">{product.brand ?? "Industrial supply"}</span>
          <span className="shrink-0">{product.sku}</span>
        </div>

        <h3 className="mt-2 text-[15px] font-semibold leading-snug tracking-tight text-white">
          <Link href={href} className="transition hover:text-flame-400">
            {product.name}
          </Link>
        </h3>

        <p className="mt-1 line-clamp-1 text-[11px] text-steel-500">
          {product.categoryName}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="font-display text-[17px] font-semibold text-white">
              {formatPrice(price)}
            </p>
            {onSale ? (
              <p className="text-[11px] text-steel-500 line-through">
                {formatPrice(product.price)}
              </p>
            ) : null}
          </div>
          <span
            className={cn(
              "flex items-center gap-1.5 pb-1 text-[9px] uppercase tracking-[0.12em]",
              stock.tone === "ok" && "text-steel-400",
              stock.tone === "warn" && "text-safety-400",
              stock.tone === "danger" && "text-danger"
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                stock.tone === "ok" && "bg-success",
                stock.tone === "warn" && "bg-safety-500",
                stock.tone === "danger" && "bg-danger"
              )}
            />
            {stock.label}
          </span>
        </div>
      </div>
    </article>
  );
}
