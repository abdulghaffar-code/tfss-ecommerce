import Link from "next/link";
import { ArrowUpRight, Heart, MapPin, Package } from "lucide-react";
import { ProfileForm, PasswordForm } from "@/components/account/ProfileForms";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AccountPage() {
  const user = await requireUser("/account");
  const [orders, orderCount, addressCount, wishlist] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { items: { select: { id: true } } },
    }),
    prisma.order.count({ where: { userId: user.id } }),
    prisma.address.count({ where: { userId: user.id } }),
    prisma.wishlist.findUnique({
      where: { userId: user.id },
      select: { _count: { select: { items: true } } },
    }),
  ]);

  return (
    <div>
      <p className="eyebrow">Account overview</p>
      <h1 className="mt-3 text-3xl leading-[1.02] tracking-tightest sm:text-4xl">
        Good to have you back,
        <br />
        <span className="text-steel-400">{user.name.split(" ")[0]}.</span>
      </h1>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "Orders", value: orderCount, icon: Package, href: "/account/orders" },
          { label: "Addresses", value: addressCount, icon: MapPin, href: "/account/addresses" },
          {
            label: "Saved",
            value: wishlist?._count.items ?? 0,
            icon: Heart,
            href: "/account/wishlist",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-white/10 bg-ink-900 p-4 transition hover:border-white/25"
          >
            <stat.icon className="size-4 text-flame-500" />
            <p className="mt-4 font-display text-2xl font-semibold text-white">{stat.value}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-steel-500">
              {stat.label}
              <ArrowUpRight className="size-3 opacity-0 transition group-hover:opacity-100" />
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-white/10 bg-ink-900">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="font-display text-base font-semibold">Recent orders</h2>
          <Link href="/account/orders" className="text-[10px] uppercase tracking-[0.12em] text-steel-400 hover:text-white">
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="p-6 text-sm text-steel-400">
            No orders yet.{" "}
            <Link href="/shop" className="font-semibold text-flame-400 hover:underline">
              Browse the catalogue
            </Link>{" "}
            to get started.
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.orderNumber}`}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 transition hover:bg-white/[0.02] sm:px-5"
                >
                  <div>
                    <p className="font-mono text-xs text-white">{order.orderNumber}</p>
                    <p className="mt-1 text-[10px] text-steel-500">
                      {formatDate(order.createdAt)} · {order.items.length}{" "}
                      {order.items.length === 1 ? "line" : "lines"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={order.status} />
                    <span className="text-sm font-semibold text-white">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
          <h2 className="font-display text-base font-semibold">Profile</h2>
          <p className="mt-1 text-xs text-steel-500">Contact details used for order updates.</p>
          <div className="mt-5">
            <ProfileForm name={user.name} email={user.email} phone={user.phone ?? ""} />
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
          <h2 className="font-display text-base font-semibold">Password</h2>
          <p className="mt-1 text-xs text-steel-500">
            Use a unique password you do not use elsewhere.
          </p>
          <div className="mt-5">
            <PasswordForm />
          </div>
        </section>
      </div>
    </div>
  );
}
