import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { updateInquiryStatusAction } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Flash } from "@/components/admin/Flash";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

const statuses = ["NEW", "READ", "RESPONDED", "CLOSED"];

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const status = statuses.includes(params.status ?? "") ? params.status : undefined;

  const inquiries = await prisma.inquiry.findMany({
    where: status ? { status: status as "NEW" | "READ" | "RESPONDED" | "CLOSED" } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { product: { select: { id: true, name: true, slug: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        eyebrow="Trade"
        title="Inquiries"
        description="Quote requests and product questions submitted from the storefront."
      />
      <Flash saved={params.saved} error={params.error} />

      <div className="mb-4 flex flex-wrap gap-1.5">
        <Link
          href="/admin/inquiries"
          className={!status ? "rounded-md bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white" : "rounded-md px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-steel-400 hover:text-white"}
        >
          All
        </Link>
        {statuses.map((value) => (
          <Link
            key={value}
            href={`/admin/inquiries?status=${value}`}
            className={status === value ? "rounded-md bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white" : "rounded-md px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-steel-400 hover:text-white"}
          >
            {value}
          </Link>
        ))}
      </div>

      {inquiries.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-ink-900 p-10 text-center text-sm text-steel-500">
          No inquiries in this view.
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <article key={inquiry.id} className="rounded-xl border border-white/10 bg-ink-900 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {inquiry.name}
                    {inquiry.company ? <span className="ml-2 text-xs font-normal text-steel-400">· {inquiry.company}</span> : null}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                    <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1.5 text-steel-400 hover:text-white">
                      <Mail className="size-3" /> {inquiry.email}
                    </a>
                    <a href={`tel:${inquiry.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-1.5 text-steel-400 hover:text-white">
                      <Phone className="size-3" /> {inquiry.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={
                    inquiry.status === "NEW"
                      ? "rounded-full border border-safety-500/30 bg-safety-500/10 px-2 py-0.5 text-[9px] font-semibold text-safety-400"
                      : "rounded-full border border-white/15 px-2 py-0.5 text-[9px] font-semibold text-steel-500"
                  }>
                    {inquiry.status}
                  </span>
                  <span className="text-[9px] text-steel-600">{formatDateTime(inquiry.createdAt)}</span>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-line rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs leading-relaxed text-steel-300">
                {inquiry.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                {inquiry.product ? (
                  <Link href={`/product/${inquiry.product.slug}`} target="_blank" className="text-[10px] uppercase tracking-[0.1em] text-flame-400 hover:text-flame-300">
                    Product: {inquiry.product.name} ↗
                  </Link>
                ) : (
                  <span className="text-[10px] uppercase tracking-[0.1em] text-steel-600">General inquiry</span>
                )}

                <form action={updateInquiryStatusAction} className="flex items-center gap-2">
                  <input type="hidden" name="inquiryId" value={inquiry.id} />
                  <input type="hidden" name="returnTo" value="/admin/inquiries" />
                  <select name="status" defaultValue={inquiry.status} className="h-8 rounded-md border border-white/15 bg-ink-900 px-2 text-[10px] text-white">
                    {statuses.map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                  <button type="submit" className="h-8 rounded-md border border-white/15 px-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-steel-300 hover:border-white/35 hover:text-white">
                    Update
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
