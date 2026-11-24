import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import {
  deleteProductAction,
  toggleProductAction,
} from "@/actions/admin";
import { AdminPageHeader, AdminActionLink } from "@/components/admin/AdminPageHeader";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { Flash } from "@/components/admin/Flash";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    page?: string;
    saved?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const where = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { sku: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(params.category ? { category: { slug: params.category } } : {}),
    ...(params.status === "active"
      ? { isActive: true }
      : params.status === "archived"
        ? { isActive: false }
        : params.status === "low"
          ? { stock: { lte: 5 }, isActive: true }
          : {}),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: { select: { name: true } },
        brand: { select: { name: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { slug: true, name: true } }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (overrides: Record<string, string | undefined>) => {
    const query = new URLSearchParams();
    const current = {
      q: params.q,
      category: params.category,
      status: params.status,
      page: params.page,
      ...overrides,
    };
    for (const [key, value] of Object.entries(current)) if (value) query.set(key, value);
    const value = query.toString();
    return value ? `/admin/products?${value}` : "/admin/products";
  };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Products"
        description="Create lines, control stock, upload imagery and publish or archive products."
        action={<AdminActionLink href="/admin/products/new"><Plus className="mr-1.5 size-3.5" /> New product</AdminActionLink>}
      />
      <Flash saved={params.saved} error={params.error} />

      <form action="/admin/products" method="get" className="mb-4 flex flex-wrap gap-2 rounded-xl border border-white/10 bg-ink-900 p-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name or SKU"
          className="field h-9 min-w-[180px] flex-1 text-xs"
        />
        <select name="category" defaultValue={params.category ?? ""} className="field h-9 w-auto min-w-[160px] text-xs">
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>{category.name}</option>
          ))}
        </select>
        <select name="status" defaultValue={params.status ?? ""} className="field h-9 w-auto text-xs">
          <option value="">Any status</option>
          <option value="active">Published</option>
          <option value="archived">Archived</option>
          <option value="low">Low stock</option>
        </select>
        <button type="submit" className="h-9 rounded-md border border-white/15 px-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-steel-300 hover:border-white/35 hover:text-white">
          Filter
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="border-b border-white/10 text-[9px] uppercase tracking-[0.12em] text-steel-600">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {products.map((product) => (
                <tr key={product.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-9 shrink-0 overflow-hidden rounded bg-steel-100">
                        {product.images[0] ? (
                          <Image src={product.images[0].url} alt="" fill sizes="36px" className="object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/products/${product.id}`} className="block max-w-[260px] truncate font-medium text-white hover:text-flame-400">
                          {product.name}
                        </Link>
                        <p className="mt-0.5 text-[9px] text-steel-600">
                          {product.category.name}{product.brand ? ` · ${product.brand.name}` : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-steel-400">{product.sku}</td>
                  <td className="px-4 py-3 text-steel-300">
                    {formatPrice(product.salePrice ?? product.price)}
                    {product.salePrice ? (
                      <span className="ml-1 text-[9px] text-steel-600 line-through">{formatPrice(product.price)}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.stock <= product.lowStockThreshold ? "font-semibold text-danger" : "text-steel-300"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.isActive ? "rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[9px] text-success" : "rounded-full border border-white/15 bg-white/[0.03] px-2 py-0.5 text-[9px] text-steel-500"}>
                      {product.isActive ? "Published" : "Archived"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}`} aria-label={`Edit ${product.name}`} className="text-steel-400 hover:text-white">
                        <Pencil className="size-3.5" />
                      </Link>
                      <form action={toggleProductAction}>
                        <input type="hidden" name="productId" value={product.id} />
                        <button type="submit" className="text-[9px] uppercase tracking-[0.1em] text-steel-500 hover:text-white">
                          {product.isActive ? "Archive" : "Publish"}
                        </button>
                      </form>
                      <form action={deleteProductAction}>
                        <input type="hidden" name="productId" value={product.id} />
                        <ConfirmSubmit
                          message={`Delete ${product.name}? Products with order history cannot be deleted.`}
                          className="text-[9px] uppercase tracking-[0.1em] text-steel-600 hover:text-danger"
                        >
                          Delete
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-steel-500">
                    No products match the current filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] text-steel-500">
        <span>{total} products</span>
        {pageCount > 1 ? (
          <div className="flex gap-2">
            {page > 1 ? <Link href={qs({ page: String(page - 1) })} className="hover:text-white">← Previous</Link> : null}
            <span>Page {page} / {pageCount}</span>
            {page < pageCount ? <Link href={qs({ page: String(page + 1) })} className="hover:text-white">Next →</Link> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
