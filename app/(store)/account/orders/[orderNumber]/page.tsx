import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock3, MapPin, Phone } from "lucide-react";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { PrintButton } from "@/components/orders/PrintButton";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatPrice } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";

const flow = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default async function AccountOrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const user = await requireUser(`/account/orders/${orderNumber}`);
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, payment: true },
  });

  if (!order || order.userId !== user.id) notFound();

  const currentIndex = flow.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div>
      <Link
        href="/account/orders"
        className="text-[10px] uppercase tracking-[0.14em] text-steel-500 transition hover:text-white"
      >
        ← All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold tracking-tight text-white">
              {order.orderNumber}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-2 text-xs text-steel-500">
            Placed {formatDateTime(order.createdAt)}
          </p>
        </div>
        <PrintButton />
      </div>

      {isCancelled ? (
        <div className="mt-6 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-red-200">
          This order was cancelled. If this is unexpected, contact the counter
          with your order number.
        </div>
      ) : (
        <ol className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-ink-900 p-5 sm:grid-cols-5">
          {flow.map((step, index) => {
            const complete = index <= currentIndex;
            return (
              <li key={step} className="flex items-center gap-2">
                <span
                  className={
                    complete
                      ? "flex size-6 shrink-0 items-center justify-center rounded-full bg-flame-500 text-ink-950"
                      : "flex size-6 shrink-0 items-center justify-center rounded-full border border-white/15 text-steel-600"
                  }
                >
                  {complete ? <Check className="size-3.5" /> : <Clock3 className="size-3" />}
                </span>
                <span
                  className={
                    complete
                      ? "text-[10px] font-semibold uppercase tracking-[0.1em] text-white"
                      : "text-[10px] uppercase tracking-[0.1em] text-steel-600"
                  }
                >
                  {ORDER_STATUS_LABELS[step]}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="rounded-xl border border-white/10 bg-ink-900">
          <h2 className="border-b border-white/10 p-4 text-xs font-semibold uppercase tracking-[0.12em] text-white">
            Items
          </h2>
          <ul className="divide-y divide-white/10">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 p-4">
                <div>
                  <p className="text-sm text-steel-200">{item.name}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-steel-500">
                    {item.sku} · {formatPrice(item.unitPrice)} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-white">
                  {formatPrice(item.lineTotal)}
                </p>
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
              <dd className="text-steel-200">
                {Number(order.shipping) === 0 ? "Free" : formatPrice(order.shipping)}
              </dd>
            </div>
            {Number(order.discount) > 0 ? (
              <div className="flex justify-between">
                <dt className="text-steel-400">Discount</dt>
                <dd className="text-steel-200">−{formatPrice(order.discount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-white/10 pt-2">
              <dt className="font-semibold text-white">Total</dt>
              <dd className="font-display text-lg font-semibold text-white">
                {formatPrice(order.total)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-ink-900 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white">
              Delivery
            </h2>
            <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-steel-300">
              <MapPin className="mt-0.5 size-3.5 shrink-0 text-flame-500" />
              <span>
                {order.customerName}
                <br />
                {order.addressLine}
                <br />
                {order.city}
                {order.postalCode ? `, ${order.postalCode}` : ""}
              </span>
            </p>
            <p className="mt-2 flex items-center gap-2 text-xs text-steel-400">
              <Phone className="size-3.5 text-flame-500" /> {order.customerPhone}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-ink-900 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white">
              Payment
            </h2>
            <p className="mt-3 text-sm text-steel-200">
              {PAYMENT_METHOD_LABELS[order.paymentMethod]}
            </p>
            <p className="mt-1 text-[11px] text-safety-400">
              {PAYMENT_STATUS_LABELS[order.paymentStatus]}
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-steel-500">
              Status is updated only after the payment or delivery is verified.
            </p>
          </div>

          {order.notes ? (
            <div className="rounded-xl border border-white/10 bg-ink-900 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white">
                Notes
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-steel-400">{order.notes}</p>
            </div>
          ) : null}

          <div className="rounded-xl border border-white/10 bg-ink-900 p-4">
            <p className="text-[11px] text-steel-500">
              Need to change or cancel this order?
            </p>
            <Link
              href="/contact"
              className="mt-2 inline-flex text-xs font-semibold text-flame-400 hover:text-flame-300"
            >
              Contact the counter →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
