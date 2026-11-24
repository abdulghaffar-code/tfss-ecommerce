import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Mail,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import { formatDate, formatNumber, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const since = new Date();
  since.setDate(since.getDate() - 13);
  since.setHours(0, 0, 0, 0);

  const [
    revenue,
    orderCount,
    pendingCount,
    customerCount,
    productCount,
    lowStock,
    newInquiries,
    recentOrders,
    movements,
    topItems,
    dailyOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.product.findMany({
      where: { isActive: true, stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      take: 5,
      select: { id: true, name: true, stock: true, sku: true, slug: true },
    }),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { items: { select: { id: true } } },
    }),
    prisma.inventoryMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { product: { select: { name: true } } },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: { order: { status: { not: "CANCELLED" } } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: since }, status: { not: "CANCELLED" } },
      select: { createdAt: true, total: true },
    }),
  ]);

  const topIds = topItems.map((item) => item.productId).filter(Boolean) as string[];
  const topProducts = topIds.length
    ? await prisma.product.findMany({
        where: { id: { in: topIds } },
        select: { id: true, name: true, slug: true },
      })
    : [];
  const topMap = new Map(topProducts.map((product) => [product.id, product]));

  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(since);
    date.setDate(since.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    const rows = dailyOrders.filter(
      (order) => order.createdAt.toISOString().slice(0, 10) === key
    );
    return {
      label: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      count: rows.length,
      value: rows.reduce((sum, order) => sum + Number(order.total), 0),
    };
  });
  const maxCount = Math.max(1, ...days.map((day) => day.count));

  const cards = [
    {
      label: "Order value",
      value: formatPrice(revenue._sum.total ?? 0),
      note: "Excludes cancelled orders",
      icon: TrendingUp,
      href: "/admin/orders",
    },
    {
      label: "Orders",
      value: formatNumber(orderCount),
      note: `${pendingCount} pending review`,
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      label: "Customers",
      value: formatNumber(customerCount),
      note: "Registered accounts",
      icon: Users,
      href: "/admin/customers",
    },
    {
      label: "Catalogue",
      value: formatNumber(productCount),
      note: `${lowStock.length ? lowStock.length : "0"} low-stock lines`,
      icon: Package,
      href: "/admin/products",
    },
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Store overview"
        title="Good day. Here is the shop."
        description="Live counts from the store database. Revenue includes orders that have not been cancelled and is not a statement of cash collected."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-xl border border-white/10 bg-ink-900 p-4 transition hover:border-white/25"
          >
            <div className="flex items-center justify-between">
              <card.icon className="size-4 text-flame-500" />
              <ArrowUpRight className="size-3.5 text-steel-600 transition group-hover:text-white" />
            </div>
            <p className="mt-5 font-display text-2xl font-semibold tracking-tight text-white">
              {card.value}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-steel-400">
              {card.label}
            </p>
            <p className="mt-2 text-[10px] text-steel-600">{card.note}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold">Orders · last 14 days</h2>
              <p className="mt-0.5 text-[10px] text-steel-500">
                Order count per day, cancelled orders excluded
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.12em] text-steel-500">
              {formatNumber(days.reduce((sum, d) => sum + d.count, 0))} orders
            </span>
          </div>
          <div className="mt-6 flex h-40 items-end gap-1.5">
            {days.map((day) => (
              <div key={day.label} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-sm bg-flame-500/70 transition group-hover:bg-flame-400"
                    style={{ height: `${Math.max(3, (day.count / maxCount) * 100)}%` }}
                    title={`${day.count} orders · ${formatPrice(day.value)}`}
                  />
                </div>
                <span className="text-[7px] text-steel-600">{day.label.split(" ")[0]}</span>
              </div>
            ))}
          </div>
          {dailyOrders.length === 0 ? (
            <p className="mt-4 text-center text-[11px] text-steel-600">
              No orders in this period yet. The chart updates as orders arrive.
            </p>
          ) : null}
        </section>

        <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Needs attention</h2>
            <span className="rounded-full border border-safety-500/30 bg-safety-500/10 px-2 py-0.5 text-[9px] font-bold text-safety-400">
              {pendingCount + newInquiries + lowStock.length}
            </span>
          </div>
          <ul className="mt-4 divide-y divide-white/10">
            <li className="flex items-center justify-between py-3">
              <span className="flex items-center gap-2 text-xs text-steel-300">
                <ShoppingCart className="size-3.5 text-safety-400" /> Pending orders
              </span>
              <Link href="/admin/orders?status=PENDING" className="text-xs font-semibold text-white hover:text-flame-400">
                {pendingCount}
              </Link>
            </li>
            <li className="flex items-center justify-between py-3">
              <span className="flex items-center gap-2 text-xs text-steel-300">
                <Mail className="size-3.5 text-safety-400" /> New inquiries
              </span>
              <Link href="/admin/inquiries" className="text-xs font-semibold text-white hover:text-flame-400">
                {newInquiries}
              </Link>
            </li>
            <li className="flex items-center justify-between py-3">
              <span className="flex items-center gap-2 text-xs text-steel-300">
                <AlertTriangle className="size-3.5 text-safety-400" /> Low stock lines
              </span>
              <Link href="/admin/inventory" className="text-xs font-semibold text-white hover:text-flame-400">
                {lowStock.length}
              </Link>
            </li>
          </ul>

          <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
            {lowStock.slice(0, 3).map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="flex items-center justify-between gap-2 text-[11px] text-steel-400 hover:text-white"
              >
                <span className="truncate">{product.name}</span>
                <span className="shrink-0 text-danger">{product.stock} left</span>
              </Link>
            ))}
            {lowStock.length === 0 ? (
              <p className="text-[11px] text-steel-600">No low-stock alerts.</p>
            ) : null}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-white/10 bg-ink-900">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <h2 className="font-display text-base font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-[10px] uppercase tracking-[0.12em] text-steel-400 hover:text-white">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="p-6 text-xs text-steel-500">
              No orders yet. Place a test order from the storefront to see the
              workflow end to end.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[9px] uppercase tracking-[0.12em] text-steel-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/orders/${order.orderNumber}`}
                          className="font-mono text-[11px] text-white hover:text-flame-400"
                        >
                          {order.orderNumber}
                        </Link>
                        <p className="mt-0.5 text-[9px] text-steel-600">
                          {formatDate(order.createdAt)}
                        </p>
                      </td>
                      <td className="max-w-[160px] truncate px-4 py-3 text-steel-300">
                        {order.customerName}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-white">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="space-y-5">
          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-base font-semibold">Top lines by quantity</h2>
            {topItems.length === 0 ? (
              <p className="mt-3 text-[11px] text-steel-600">
                Sales ranking appears after the first non-cancelled order.
              </p>
            ) : (
              <ol className="mt-3 space-y-2.5">
                {topItems.map((item, index) => {
                  const product = item.productId ? topMap.get(item.productId) : null;
                  if (!product) return null;
                  return (
                    <li key={product.id} className="flex items-center gap-3 text-[11px]">
                      <span className="font-mono text-steel-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Link href={`/product/${product.slug}`} className="flex-1 truncate text-steel-300 hover:text-white">
                        {product.name}
                      </Link>
                      <span className="text-steel-500">{item._sum.quantity} units</span>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold">Inventory activity</h2>
              <Boxes className="size-4 text-steel-600" />
            </div>
            {movements.length === 0 ? (
              <p className="mt-3 text-[11px] text-steel-600">No movements recorded.</p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {movements.map((movement) => (
                  <li key={movement.id} className="flex items-start justify-between gap-3 text-[11px]">
                    <div className="min-w-0">
                      <p className="truncate text-steel-300">{movement.product.name}</p>
                      <p className="truncate text-[9px] text-steel-600">{movement.reason}</p>
                    </div>
                    <span
                      className={
                        movement.delta >= 0
                          ? "shrink-0 font-semibold text-success"
                          : "shrink-0 font-semibold text-danger"
                      }
                    >
                      {movement.delta > 0 ? "+" : ""}
                      {movement.delta}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
