import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  updateOrderStatusAction,
  updatePaymentAction,
} from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Flash } from "@/components/admin/Flash";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatPrice } from "@/lib/utils";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";

const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [{ orderNumber }, flash] = await Promise.all([params, searchParams]);
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      payment: true,
      user: { select: { id: true, name: true, email: true } },
      movements: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/orders" className="text-[10px] uppercase tracking-[0.14em] text-steel-500 hover:text-white">
        ← All orders
      </Link>
      <div className="mt-3">
        <AdminPageHeader
          eyebrow={`Order · ${formatDateTime(order.createdAt)}`}
          title={order.orderNumber}
          description={order.user ? `Account order · ${order.user.email}` : "Guest order"}
          action={<StatusBadge status={order.status} className="text-[10px]" />}
        />
      </div>
      <Flash saved={flash.saved} error={flash.error} />

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <section className="overflow-hidden rounded-xl border border-white/10 bg-ink-900">
            <h2 className="border-b border-white/10 p-4 font-display text-sm font-semibold text-white">
              Items &amp; totals
            </h2>
            <ul className="divide-y divide-white/10">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-4 p-4">
                  <div>
                    {item.productId ? (
                      <Link href={`/admin/products/${item.productId}`} className="text-sm text-steel-200 hover:text-flame-400">
                        {item.name}
                      </Link>
                    ) : (
                      <p className="text-sm text-steel-200">{item.name}</p>
                    )}
                    <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-steel-600">
                      {item.sku} · {formatPrice(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-white">{formatPrice(item.lineTotal)}</p>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-white/10 p-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-steel-400">Subtotal</dt>
                <dd className="text-steel-200">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-steel-400">Delivery</dt>
                <dd className="text-steel-200">{formatPrice(order.shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-steel-400">Discount</dt>
                <dd className="text-steel-200">{formatPrice(order.discount)}</dd>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2">
                <dt className="font-semibold text-white">Total</dt>
                <dd className="font-display text-lg font-semibold text-white">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Customer &amp; delivery</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-steel-600">Customer</p>
                <p className="mt-2 text-sm text-steel-200">{order.customerName}</p>
                <a href={`tel:${order.customerPhone.replace(/[^+\d]/g, "")}`} className="mt-1 flex items-center gap-1.5 text-xs text-steel-400 hover:text-white">
                  <Phone className="size-3" /> {order.customerPhone}
                </a>
                <a href={`mailto:${order.customerEmail}`} className="mt-1 flex items-center gap-1.5 text-xs text-steel-400 hover:text-white">
                  <Mail className="size-3" /> {order.customerEmail}
                </a>
                {order.user ? (
                  <Link href={`/admin/customers/${order.user.id}`} className="mt-2 inline-block text-[10px] uppercase tracking-[0.1em] text-flame-400 hover:text-flame-300">
                    View customer account →
                  </Link>
                ) : (
                  <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-steel-600">Guest checkout</p>
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-steel-600">Deliver to</p>
                <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-steel-200">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-flame-500" />
                  <span>
                    {order.addressLine}
                    <br />
                    {order.city}
                    {order.postalCode ? `, ${order.postalCode}` : ""}
                  </span>
                </p>
                {order.notes ? (
                  <p className="mt-3 rounded-md border border-white/10 bg-white/[0.02] p-2.5 text-[11px] leading-relaxed text-steel-400">
                    “{order.notes}”
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Inventory movements</h2>
            {order.movements.length === 0 ? (
              <p className="mt-2 text-[11px] text-steel-600">No stock movements recorded against this order.</p>
            ) : (
              <ul className="mt-3 divide-y divide-white/10">
                {order.movements.map((movement) => (
                  <li key={movement.id} className="flex justify-between py-2 text-[11px]">
                    <span className="text-steel-400">{movement.reason}</span>
                    <span className={movement.delta >= 0 ? "text-success" : "text-danger"}>
                      {movement.delta > 0 ? "+" : ""}{movement.delta}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Fulfilment status</h2>
            <p className="mt-1 text-[10px] leading-relaxed text-steel-500">
              Cancelling an order returns its items to stock. Reopening a cancelled
              order re-checks and deducts stock.
            </p>
            <form action={updateOrderStatusAction} className="mt-4 space-y-3">
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="returnTo" value={`/admin/orders/${order.orderNumber}`} />
              <label className="field-label" htmlFor="status">Order status</label>
              <select id="status" name="status" defaultValue={order.status} className="field h-10 text-xs">
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>{ORDER_STATUS_LABELS[status]}</option>
                ))}
              </select>
              <button type="submit" className="h-10 w-full rounded-lg bg-flame-500 font-display text-xs font-semibold text-ink-950 transition hover:bg-flame-400">
                Update status
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold text-white">Payment</h2>
              <span className={order.paymentStatus === "PAID" ? "text-[10px] font-semibold text-success" : "text-[10px] font-semibold text-safety-400"}>
                {PAYMENT_STATUS_LABELS[order.paymentStatus]}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-steel-400">
              {PAYMENT_METHOD_LABELS[order.paymentMethod]} · {formatPrice(order.total)}
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-steel-600">
              Only mark paid after verifying cash or the bank transfer. The system
              never assumes payment.
            </p>
            <form action={updatePaymentAction} className="mt-4 space-y-3">
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="returnTo" value={`/admin/orders/${order.orderNumber}`} />
              <label className="field-label" htmlFor="paymentStatus">Payment status</label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                defaultValue={order.payment?.status ?? "PENDING"}
                className="field h-10 text-xs"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {PAYMENT_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
              <div>
                <label className="field-label" htmlFor="reference">Reference (optional)</label>
                <input
                  id="reference"
                  name="reference"
                  defaultValue={order.payment?.reference ?? ""}
                  placeholder="Bank ref / receipt no."
                  className="field h-10 text-xs"
                />
              </div>
              <button type="submit" className="h-10 w-full rounded-lg border border-white/20 font-display text-xs font-semibold text-white transition hover:border-white/40">
                Save payment
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-white/10 bg-ink-900 p-5 text-[10px] leading-relaxed text-steel-500">
            <p className="uppercase tracking-[0.12em] text-steel-400">Order record</p>
            <p className="mt-2">Public token issued for guest access.</p>
            <p className="mt-1">Placed {formatDateTime(order.createdAt)}</p>
            <p className="mt-1">Last updated {formatDateTime(order.updatedAt)}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
