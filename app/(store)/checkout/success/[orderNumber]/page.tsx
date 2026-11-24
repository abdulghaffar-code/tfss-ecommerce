import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Truck,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Order confirmation",
  description: "Your order has been placed.",
  noIndex: true,
});

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ orderNumber }, { token }] = await Promise.all([params, searchParams]);
  const [order, user] = await Promise.all([
    prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, payment: true },
    }),
    getCurrentUser(),
  ]);

  if (!order) notFound();
  const authorized =
    Boolean(token && token === order.publicToken) ||
    (user && (user.role === "ADMIN" || user.id === order.userId));
  if (!authorized) notFound();

  return (
    <div className="shell py-10 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-full border border-success/30 bg-success/10">
            <Check className="size-6 text-success" />
          </span>
          <p className="eyebrow mt-5">Order received</p>
          <h1 className="mt-3 text-4xl leading-[0.98] tracking-tightest sm:text-5xl">
            Thank you, {order.customerName.split(" ")[0]}.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-steel-400">
            Your order has been recorded as <strong className="text-white">Pending</strong>.
            Our team will confirm stock and delivery with you. No payment has
            been marked as received.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-ink-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-steel-500">
                Order number
              </p>
              <p className="mt-1 font-mono text-lg font-semibold text-white">
                {order.orderNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.16em] text-steel-500">
                Placed
              </p>
              <p className="mt-1 text-sm text-steel-200">{formatDateTime(order.createdAt)}</p>
            </div>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-3">
            <div className="bg-ink-900 p-5">
              <p className="text-[10px] uppercase tracking-[0.14em] text-steel-500">
                Order status
              </p>
              <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-safety-400">
                <Clock3 className="size-4" /> {ORDER_STATUS_LABELS[order.status]}
              </p>
            </div>
            <div className="bg-ink-900 p-5">
              <p className="text-[10px] uppercase tracking-[0.14em] text-steel-500">
                Payment
              </p>
              <p className="mt-1.5 text-sm font-semibold text-white">
                {PAYMENT_METHOD_LABELS[order.paymentMethod]}
              </p>
              <p className="text-[11px] text-steel-500">
                {PAYMENT_STATUS_LABELS[order.paymentStatus]}
              </p>
            </div>
            <div className="bg-ink-900 p-5">
              <p className="text-[10px] uppercase tracking-[0.14em] text-steel-500">
                Total
              </p>
              <p className="mt-1.5 font-display text-lg font-semibold text-white">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
              Items
            </h2>
            <ul className="mt-3 divide-y divide-white/10">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm text-steel-200">{item.name}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-steel-500">
                      {item.sku} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm text-white">
                    {formatPrice(item.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
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
              <div className="flex justify-between border-t border-white/10 pt-2">
                <dt className="font-semibold text-white">Total</dt>
                <dd className="font-display text-lg font-semibold text-white">
                  {formatPrice(order.total)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-5 border-t border-white/10 p-5 sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-steel-500">
                <MapPin className="size-3.5" /> Deliver to
              </p>
              <p className="mt-2 text-sm leading-relaxed text-steel-300">
                {order.customerName}
                <br />
                {order.addressLine}
                <br />
                {order.city}
                {order.postalCode ? `, ${order.postalCode}` : ""}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-steel-500">
                <Phone className="size-3.5" /> Contact
              </p>
              <p className="mt-2 text-sm leading-relaxed text-steel-300">
                {order.customerPhone}
                <br />
                {order.customerEmail}
              </p>
            </div>
          </div>

          {order.paymentMethod === "BANK_TRANSFER" ? (
            <div className="border-t border-white/10 bg-safety-500/[0.04] p-5">
              <p className="text-xs font-semibold text-safety-400">Bank transfer</p>
              <p className="mt-1 text-xs leading-relaxed text-steel-400">
                Our team will issue the company bank details with your order
                confirmation. Your payment stays <strong>Pending</strong> until
                the transfer is verified. Do not send payment to unverified
                account details.
              </p>
            </div>
          ) : (
            <div className="border-t border-white/10 bg-white/[0.02] p-5">
              <p className="text-xs font-semibold text-white">Cash on delivery</p>
              <p className="mt-1 text-xs leading-relaxed text-steel-400">
                Pay the rider when your order is handed over. The order remains
                Pending until our team confirms the delivery arrangement.
              </p>
            </div>
          )}

          {order.notes ? (
            <div className="border-t border-white/10 p-5">
              <p className="text-[10px] uppercase tracking-[0.14em] text-steel-500">
                Your note
              </p>
              <p className="mt-1.5 text-sm text-steel-300">{order.notes}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-steel-500">
          <p className="flex items-center gap-2">
            <Mail className="size-3.5" /> Keep this page or your order number for
            reference.
          </p>
          <div className="flex gap-4">
            {user ? (
              <Link href="/account/orders" className="font-semibold text-white hover:text-flame-400">
                Your orders
              </Link>
            ) : null}
            <Link href="/shop" className="font-semibold text-white hover:text-flame-400">
              Continue shopping
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.16em] text-steel-600">
          <Truck className="size-3.5" /> Karachi delivery · confirmation before dispatch
        </div>
      </div>
    </div>
  );
}
