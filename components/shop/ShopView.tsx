import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { listProducts, type ShopParams } from "@/lib/catalog";
import { cn, formatNumber } from "@/lib/utils";

export type ShopSearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function ShopView({
  searchParams,
  basePath,
  lockedCategory,
  savedIds,
  categories,
  brands,
}: {
  searchParams: ShopSearchParams;
  basePath: string;
  lockedCategory?: string;
  savedIds: Set<string>;
  categories: { slug: string; name: string; count: number }[];
  brands: { slug: string; name: string }[];
}) {
  const params: ShopParams = {
    q: single(searchParams.q),
    category: lockedCategory ?? single(searchParams.category),
    brand: single(searchParams.brand),
    sort: single(searchParams.sort),
    min: single(searchParams.min),
    max: single(searchParams.max),
    page: single(searchParams.page),
    inStock: single(searchParams.inStock),
  };

  const { items, total, page, pageCount } = await listProducts(params);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const query = new URLSearchParams();
    const current = {
      q: params.q,
      brand: params.brand,
      sort: params.sort,
      min: params.min,
      max: params.max,
      inStock: params.inStock,
      page: params.page,
      ...overrides,
    };
    for (const [key, value] of Object.entries(current)) {
      if (value) query.set(key, value);
    }
    const qs = query.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const hasFilters = Boolean(
    params.q || params.brand || params.min || params.max || params.inStock
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[248px_1fr] lg:gap-10">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <form
          action={basePath}
          method="get"
          className="rounded-xl border border-white/10 bg-ink-900 p-5"
        >
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
              <SlidersHorizontal className="size-3.5 text-flame-500" />
              Filters
            </p>
            {hasFilters ? (
              <Link
                href={basePath}
                className="flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-steel-500 transition hover:text-white"
              >
                <X className="size-3" /> Reset
              </Link>
            ) : null}
          </div>

          <div className="mt-5">
            <label className="field-label" htmlFor="filter-q">
              Search
            </label>
            <input
              id="filter-q"
              name="q"
              defaultValue={params.q}
              placeholder="Name, SKU, keyword"
              className="field h-10 text-xs"
            />
          </div>

          {!lockedCategory ? (
            <div className="mt-4">
              <label className="field-label" htmlFor="filter-category">
                Category
              </label>
              <select
                id="filter-category"
                name="category"
                defaultValue={params.category ?? ""}
                className="field h-10 text-xs"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="mt-4">
            <label className="field-label" htmlFor="filter-brand">
              Manufacturer
            </label>
            <select
              id="filter-brand"
              name="brand"
              defaultValue={params.brand ?? ""}
              className="field h-10 text-xs"
            >
              <option value="">All manufacturers</option>
              {brands.map((brand) => (
                <option key={brand.slug} value={brand.slug}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div>
              <label className="field-label" htmlFor="filter-min">
                Min PKR
              </label>
              <input
                id="filter-min"
                name="min"
                inputMode="numeric"
                defaultValue={params.min}
                placeholder="0"
                className="field h-10 text-xs"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="filter-max">
                Max PKR
              </label>
              <input
                id="filter-max"
                name="max"
                inputMode="numeric"
                defaultValue={params.max}
                placeholder="Any"
                className="field h-10 text-xs"
              />
            </div>
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-xs text-steel-300">
            <input
              type="checkbox"
              name="inStock"
              value="1"
              defaultChecked={params.inStock === "1"}
              className="size-4 accent-flame-500"
            />
            In stock only
          </label>

          {params.sort ? (
            <input type="hidden" name="sort" value={params.sort} />
          ) : null}

          <button
            type="submit"
            className="mt-5 h-10 w-full rounded-lg bg-white font-display text-xs font-semibold text-ink-950 transition hover:bg-steel-100"
          >
            Apply filters
          </button>
        </form>

        <div className="mt-4 rounded-xl border border-white/10 bg-ink-900 p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-steel-500">
            Need a quotation?
          </p>
          <p className="mt-2 text-xs leading-relaxed text-steel-400">
            Send us the line items and quantities. We will confirm stock and
            lead time before you order.
          </p>
          <Link
            href="/contact"
            className="mt-3 inline-block text-xs font-semibold text-flame-400 transition hover:text-flame-300"
          >
            Talk to a specialist →
          </Link>
        </div>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <p className="text-xs text-steel-500">
            <span className="font-semibold text-white">{formatNumber(total)}</span>{" "}
            {total === 1 ? "product" : "products"}
            {params.q ? (
              <>
                {" "}
                for <span className="text-white">“{params.q}”</span>
              </>
            ) : null}
          </p>
          <form action={basePath} method="get" className="flex items-center gap-2">
            {params.q ? <input type="hidden" name="q" value={params.q} /> : null}
            {params.category && !lockedCategory ? (
              <input type="hidden" name="category" value={params.category} />
            ) : null}
            {params.brand ? <input type="hidden" name="brand" value={params.brand} /> : null}
            {params.min ? <input type="hidden" name="min" value={params.min} /> : null}
            {params.max ? <input type="hidden" name="max" value={params.max} /> : null}
            {params.inStock ? <input type="hidden" name="inStock" value="1" /> : null}
            <label htmlFor="sort" className="text-[10px] uppercase tracking-[0.12em] text-steel-500">
              Sort
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={params.sort ?? "featured"}
              className="h-9 rounded-md border border-white/15 bg-ink-900 px-2 text-xs text-white"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name A–Z</option>
            </select>
            <button
              type="submit"
              className="h-9 rounded-md border border-white/15 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-steel-300 transition hover:border-white/35 hover:text-white"
            >
              Go
            </button>
          </form>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-ink-900 px-6 py-20 text-center">
            <p className="font-display text-xl text-white">No products matched.</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-steel-400">
              Try a different keyword or clear the filters. Some categories are
              supplied to order and are not listed online yet.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href={basePath}
                className="inline-flex h-10 items-center rounded-lg border border-white/20 px-4 text-xs font-semibold text-white transition hover:border-white/40"
              >
                Clear filters
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center rounded-lg bg-flame-500 px-4 text-xs font-semibold text-ink-950 transition hover:bg-flame-400"
              >
                Request a product
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-3">
            {items.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                saved={savedIds.has(product.id)}
                priority={index < 3}
              />
            ))}
          </div>
        )}

        {pageCount > 1 ? (
          <nav
            aria-label="Pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            {page > 1 ? (
              <Link
                href={buildHref({ page: String(page - 1) })}
                className="flex h-9 items-center rounded-md border border-white/15 px-3 text-xs text-steel-300 transition hover:border-white/35 hover:text-white"
              >
                Previous
              </Link>
            ) : null}
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
              <Link
                key={number}
                href={buildHref({ page: number === 1 ? undefined : String(number) })}
                aria-current={number === page ? "page" : undefined}
                className={cn(
                  "flex size-9 items-center justify-center rounded-md border text-xs transition",
                  number === page
                    ? "border-flame-500 bg-flame-500 font-semibold text-ink-950"
                    : "border-white/15 text-steel-300 hover:border-white/35 hover:text-white"
                )}
              >
                {number}
              </Link>
            ))}
            {page < pageCount ? (
              <Link
                href={buildHref({ page: String(page + 1) })}
                className="flex h-9 items-center rounded-md border border-white/15 px-3 text-xs text-steel-300 transition hover:border-white/35 hover:text-white"
              >
                Next
              </Link>
            ) : null}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
