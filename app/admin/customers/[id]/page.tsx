import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime, formatPrice } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants";

export default async function AdminCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      addresses: { orderBy: { createdAt: "desc" } },
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: { select: { quantity: true } } },
      },
    },
  });
  if (!customer || customer.role !== "CUSTOMER") notFound();

  const totalSpend = customer.orders
    .filter((order) => order.status !== "CANCELLED")
    .reduce((sum, order) => sum + Number(order.total), 0);

  return (
    <div>
      <Link href="/admin/customers" className="text-[10px] uppercase tracking-[0.14em] text-steel-500 hover:text-white">
        ← All customers
      </Link>
      <div className="mt-3">
        <AdminPageHeader
          eyebrow={`Customer since ${formatDate(customer.createdAt)}`}
          title={customer.name}
          description={customer.email}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
        <div className="space-y-5">
          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Contact</h2>
            <div className="mt-4 space-y-3 text-xs">
              <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-steel-300 hover:text-white">
                <Mail className="size-3.5 text-flame-500" /> {customer.email}
              </a>
              <a href={`tel:${(customer.phone ?? "").replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 text-steel-300 hover:text-white">
                <Phone className="size-3.5 text-flame-500" /> {customer.phone ?? "No phone on file"}
              </a>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <div>
                <p className="font-display text-lg font-semibold text-white">{customer.orders.length}</p>
                <p className="text-[9px] uppercase tracking-[0.1em] text-steel-600">Orders</p>
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-white">{formatPrice(totalSpend)}</p>
                <p className="text-[9px] uppercase tracking-[0.1em] text-steel-600">Order value</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Addresses</h2>
            {customer.addresses.length === 0 ? (
              <p className="mt-3 text-[11px] text-steel-600">No saved addresses.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {customer.addresses.map((address) => (
                  <li key={address.id} className="border-b border-white/10 pb-3 text-[11px] leading-relaxed text-steel-400 last:border-0 last:pb-0">
                    <p className="font-semibold text-steel-200">
                      {address.label} {address.isDefault ? "· Default" : ""}
                    </p>
                    <p className="mt-1 flex items-start gap-1.5">
                      <MapPin className="mt-0.5 size-3 shrink-0 text-flame-500" />
                      <span>
                        {address.line1}
                        {address.line2 ? `, ${address.line2}` : ""}
                        <br />
                        {address.city} {address.postalCode ?? ""}
                        <br />
                        {address.phone}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="overflow-hidden rounded-xl border border-white/10 bg-ink-900">
          <h2 className="border-b border-white/10 p-4 font-display text-sm font-semibold text-white">Orders</h2>
          {customer.orders.length === 0 ? (
            <p className="p-5 text-xs text-steel-500">No orders placed with this account.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {customer.orders.map((order) => (
                <li key={order.id}>
                  <Link href={`/admin/orders/${order.orderNumber}`} className="flex flex-wrap items-center justify-between gap-3 p-4 transition hover:bg-white/[0.02]">
                    <div>
                      <p className="font-mono text-[11px] text-white">{order.orderNumber}</p>
                      <p className="mt-1 text-[9px] text-steel-500">
                        {formatDateTime(order.createdAt)} · {PAYMENT_METHOD_LABELS[order.paymentMethod]} ·{" "}
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} units
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <span className="text-xs font-semibold text-white">{formatPrice(order.total)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
