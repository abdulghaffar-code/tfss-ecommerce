import Link from "next/link";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Flash } from "@/components/admin/Flash";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

const PAGE_SIZE = 25;
const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    q?: string;
    page?: string;
    saved?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const q = params.q?.trim() ?? "";
  const status = (statuses as readonly string[]).includes(params.status ?? "")
    ? (params.status as (typeof statuses)[number])
    : undefined;

  const where = {
    ...(status ? { status: status as (typeof statuses)[number] } : {}),
    ...(q
      ? {
          OR: [
            { orderNumber: { contains: q, mode: "insensitive" as const } },
            { customerName: { contains: q, mode: "insensitive" as const } },
            { customerPhone: { contains: q } },
            { customerEmail: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [orders, total, counts] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { items: { select: { quantity: true } }, payment: true },
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const countMap = new Map<string, number>(
    counts.map((entry) => [entry.status, entry._count._all])
  );
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const qs = (overrides: Record<string, string | undefined>) => {
    const query = new URLSearchParams();
    const current = { status, q: params.q, page: params.page, ...overrides };
    for (const [key, value] of Object.entries(current)) if (value) query.set(key, value);
    const string = query.toString();
    return string ? `/admin/orders?${string}` : "/admin/orders";
  };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Trade"
        title="Orders"
        description="Review incoming orders, move them through fulfilment and verify payments manually."
      />
      <Flash saved={params.saved} error={params.error} />

      <div className="no-scrollbar mb-4 flex gap-1.5 overflow-x-auto">
        <Link
          href="/admin/orders"
          className={
            !status
              ? "shrink-0 rounded-md bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white"
              : "shrink-0 rounded-md px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-steel-400 hover:text-white"
          }
        >
          All
        </Link>
        {statuses.map((value) => (
          <Link
            key={value}
            href={`/admin/orders?status=${value}`}
            className={
              status === value
                ? "shrink-0 rounded-md bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white"
                : "shrink-0 rounded-md px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-steel-400 hover:text-white"
            }
          >
            {ORDER_STATUS_LABELS[value]} ({countMap.get(value) ?? 0})
          </Link>
        ))}
      </div>

      <form action="/admin/orders" method="get" className="mb-4 flex flex-wrap gap-2 rounded-xl border border-white/10 bg-ink-900 p-3">
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <input
          name="q"
          defaultValue={q}
          placeholder="Order number, customer, phone or email"
          className="field h-9 min-w-[220px] flex-1 text-xs"
        />
        <button type="submit" className="h-9 rounded-md border border-white/15 px-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-steel-300 hover:border-white/35 hover:text-white">
          Search
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead className="border-b border-white/10 text-[9px] uppercase tracking-[0.12em] text-steel-600">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Placed</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {orders.map((order) => (
                <tr key={order.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.orderNumber}`} className="font-mono text-[11px] text-white hover:text-flame-400">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-steel-200">{order.customerName}</p>
                    <p className="mt-0.5 text-[9px] text-steel-600">{order.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3 text-steel-400">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3 text-steel-400">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[10px] text-steel-300">{order.paymentMethod === "COD" ? "COD" : "Bank"}</p>
                    <p className={order.paymentStatus === "PAID" ? "text-[9px] text-success" : "text-[9px] text-safety-400"}>
                      {order.paymentStatus}
                    </p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-right font-semibold text-white">{formatPrice(order.total)}</td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-steel-500">
                    No orders match the current filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] text-steel-500">
        <span>{total} orders</span>
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
