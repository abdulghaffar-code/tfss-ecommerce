import Link from "next/link";
import { Package } from "lucide-react";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants";

export default async function OrdersPage() {
  const user = await requireUser("/account/orders");
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true, payment: true },
  });

  return (
    <div>
      <p className="eyebrow">Order history</p>
      <h1 className="mt-3 text-3xl leading-[1.02] tracking-tightest sm:text-4xl">
        Your orders
      </h1>
      <p className="mt-2 text-sm text-steel-400">
        Every order placed while signed in is recorded here with its current status.
      </p>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/10 bg-ink-900 p-10 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <Package className="size-5 text-steel-500" />
          </span>
          <p className="mt-4 font-display text-lg text-white">No orders yet.</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-steel-500">
            Orders placed with this account will appear here. Guest orders can be
            viewed from the confirmation link.
          </p>
          <Link
            href="/shop"
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-flame-500 px-4 text-xs font-semibold text-ink-950 transition hover:bg-flame-400"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.orderNumber}`}
              className="block rounded-xl border border-white/10 bg-ink-900 p-5 transition hover:border-white/25"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-mono text-sm font-semibold text-white">
                      {order.orderNumber}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-2 text-[11px] text-steel-500">
                    {formatDate(order.createdAt)} · {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                  </p>
                  <p className="mt-2 text-xs text-steel-400">
                    {order.items
                      .slice(0, 2)
                      .map((item) => item.name)
                      .join(", ")}
                    {order.items.length > 2 ? ` +${order.items.length - 2} more` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-semibold text-white">
                    {formatPrice(order.total)}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-steel-500">
                    {order.items.length} {order.items.length === 1 ? "line" : "lines"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
