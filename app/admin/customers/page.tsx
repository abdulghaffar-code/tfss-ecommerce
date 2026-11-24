import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQuery } = await searchParams;
  const q = rawQuery?.trim() ?? "";

  const customers = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
              { phone: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { _count: { select: { orders: true } } },
  });

  const spend = await prisma.order.groupBy({
    by: ["userId"],
    where: { userId: { in: customers.map((c) => c.id) }, status: { not: "CANCELLED" } },
    _sum: { total: true },
  });
  const spendMap = new Map(
    spend.map((entry) => [entry.userId ?? "", Number(entry._sum.total ?? 0)])
  );

  return (
    <div>
      <AdminPageHeader
        eyebrow="Trade"
        title="Customers"
        description="Registered customer accounts and their order history. Admin accounts are not created from the public site."
      />

      <form action="/admin/customers" method="get" className="mb-4 flex gap-2 rounded-xl border border-white/10 bg-ink-900 p-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name, email or phone"
          className="field h-9 min-w-[220px] flex-1 text-xs"
        />
        <button type="submit" className="h-9 rounded-md border border-white/15 px-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-steel-300 hover:border-white/35 hover:text-white">
          Search
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead className="border-b border-white/10 text-[9px] uppercase tracking-[0.12em] text-steel-600">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 text-right font-medium">Order value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {customers.map((customer) => (
                <tr key={customer.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${customer.id}`} className="font-medium text-white hover:text-flame-400">
                      {customer.name}
                    </Link>
                    <p className="mt-0.5 text-[9px] text-steel-500">{customer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-steel-400">{customer.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-steel-400">{formatDate(customer.createdAt)}</td>
                  <td className="px-4 py-3 text-steel-300">{customer._count.orders}</td>
                  <td className="px-4 py-3 text-right font-semibold text-white">
                    {formatPrice(spendMap.get(customer.id) ?? 0)}
                  </td>
                </tr>
              ))}
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-steel-500">
                    No customer accounts found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
