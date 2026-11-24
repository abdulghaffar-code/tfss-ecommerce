import Link from "next/link";
import { AlertTriangle, ArrowDown, ArrowUp } from "lucide-react";
import { adjustInventoryAction } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Flash } from "@/components/admin/Flash";
import { Field, Select } from "@/components/ui/Field";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";

  const [products, movements, lowStockCount] = await Promise.all([
    prisma.product.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { sku: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { stock: "asc" },
      take: 60,
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        lowStockThreshold: true,
        isActive: true,
      },
    }),
    prisma.inventoryMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        product: { select: { name: true, sku: true } },
        createdBy: { select: { name: true } },
      },
    }),
    prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
  ]);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Inventory"
        description="Adjust stock with an auditable movement trail. Checkout also decrements stock atomically, so stock can never go negative through a sale."
      />
      <Flash saved={params.saved} error={params.error} />

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <div className="space-y-5">
          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold text-white">Record adjustment</h2>
              {lowStockCount > 0 ? (
                <span className="flex items-center gap-1 text-[9px] uppercase tracking-[0.1em] text-safety-400">
                  <AlertTriangle className="size-3" /> {lowStockCount} low
                </span>
              ) : null}
            </div>
            <form action={adjustInventoryAction} className="mt-4 space-y-4">
              <input type="hidden" name="returnTo" value="/admin/inventory" />
              <Select label="Product" name="productId" required defaultValue="">
                <option value="">Choose a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.sku} — {product.name} ({product.stock})
                  </option>
                ))}
              </Select>
              <Field
                label="Quantity change"
                name="delta"
                type="number"
                step="1"
                required
                placeholder="e.g. 10 or -3"
                hint="Positive adds stock, negative removes it."
              />
              <Field
                label="Reason"
                name="reason"
                required
                placeholder="Goods received, damage, stock count…"
              />
              <Field label="Note (optional)" name="note" placeholder="Supplier, invoice or reference" />
              <button
                type="submit"
                className="h-10 w-full rounded-lg bg-flame-500 font-display text-xs font-semibold text-ink-950 transition hover:bg-flame-400"
              >
                Apply adjustment
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Recent movements</h2>
            <ul className="mt-3 divide-y divide-white/10">
              {movements.map((movement) => (
                <li key={movement.id} className="py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] text-steel-300">{movement.product.name}</p>
                      <p className="mt-0.5 truncate text-[9px] text-steel-600">
                        {movement.reason} · {formatDateTime(movement.createdAt)}
                      </p>
                    </div>
                    <span
                      className={
                        movement.delta >= 0
                          ? "flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-success"
                          : "flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-danger"
                      }
                    >
                      {movement.delta >= 0 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                      {Math.abs(movement.delta)}
                    </span>
                  </div>
                </li>
              ))}
              {movements.length === 0 ? (
                <li className="py-4 text-[11px] text-steel-600">No inventory movements yet.</li>
              ) : null}
            </ul>
          </section>
        </div>

        <section className="overflow-hidden rounded-xl border border-white/10 bg-ink-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
            <h2 className="font-display text-sm font-semibold text-white">Stock on hand</h2>
            <form action="/admin/inventory" method="get" className="flex gap-2">
              <input
                name="q"
                defaultValue={q}
                placeholder="Search product or SKU"
                className="field h-9 w-[200px] text-xs"
              />
              <button type="submit" className="h-9 rounded-md border border-white/15 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-steel-300 hover:border-white/35 hover:text-white">
                Search
              </button>
            </form>
          </div>
          <div className="max-h-[720px] overflow-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead className="sticky top-0 bg-ink-900 text-[9px] uppercase tracking-[0.12em] text-steel-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Threshold</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {products.map((product) => {
                  const low = product.stock <= product.lowStockThreshold;
                  return (
                    <tr key={product.id} className="transition hover:bg-white/[0.02]">
                      <td className="max-w-[260px] truncate px-4 py-3">
                        <Link href={`/admin/products/${product.id}`} className="text-white hover:text-flame-400">
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-steel-400">{product.sku}</td>
                      <td className={low ? "px-4 py-3 font-semibold text-danger" : "px-4 py-3 font-semibold text-white"}>
                        {product.stock}
                      </td>
                      <td className="px-4 py-3 text-steel-500">{product.lowStockThreshold}</td>
                      <td className="px-4 py-3">
                        <span className={product.isActive ? "text-[9px] uppercase tracking-[0.1em] text-success" : "text-[9px] uppercase tracking-[0.1em] text-steel-600"}>
                          {product.isActive ? "Live" : "Archived"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
