import Link from "next/link";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { AddressForm } from "@/components/account/AddressForm";
import { deleteAddressAction } from "@/actions/account";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AddressesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const user = await requireUser("/account/addresses");
  const { edit } = await searchParams;
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  const editing = addresses.find((address) => address.id === edit);

  return (
    <div>
      <p className="eyebrow">Saved addresses</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl leading-[1.02] tracking-tightest sm:text-4xl">
          Delivery addresses
        </h1>
        {editing ? (
          <Link
            href="/account/addresses"
            className="text-[10px] uppercase tracking-[0.12em] text-steel-400 hover:text-white"
          >
            Cancel edit
          </Link>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-steel-400">
        Addresses are offered at checkout. Your default is selected automatically.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {addresses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 p-6 text-sm text-steel-500 md:col-span-2">
            <MapPin className="size-5 text-steel-600" />
            <p className="mt-3 text-steel-300">No saved addresses yet.</p>
            <p className="mt-1">Add one below and it will appear at checkout.</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className={
                editing?.id === address.id
                  ? "rounded-xl border border-flame-500/40 bg-ink-900 p-5"
                  : "rounded-xl border border-white/10 bg-ink-900 p-5"
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                    {address.label}
                    {address.isDefault ? (
                      <span className="rounded-full bg-flame-500/15 px-2 py-0.5 text-[8px] text-flame-400">
                        Default
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-steel-300">
                    {address.fullName}
                    <br />
                    {address.line1}
                    {address.line2 ? (
                      <>
                        <br />
                        {address.line2}
                      </>
                    ) : null}
                    <br />
                    {address.city}
                    {address.postalCode ? `, ${address.postalCode}` : ""}
                    <br />
                    <span className="text-steel-500">{address.phone}</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <Link
                  href={`/account/addresses?edit=${address.id}`}
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-steel-400 transition hover:text-white"
                >
                  <Pencil className="size-3" /> Edit
                </Link>
                <form action={deleteAddressAction}>
                  <input type="hidden" name="addressId" value={address.id} />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-steel-600 transition hover:text-danger"
                  >
                    <Trash2 className="size-3" /> Delete
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>

      <section className="mt-8 rounded-xl border border-white/10 bg-ink-900 p-5 sm:p-6">
        <h2 className="font-display text-base font-semibold">
          {editing ? "Edit address" : "Add an address"}
        </h2>
        <p className="mt-1 text-xs text-steel-500">
          Only the fields marked required are needed for delivery.
        </p>
        <div className="mt-5">
          <AddressForm
            key={editing?.id ?? "new"}
            address={
              editing
                ? {
                    id: editing.id,
                    label: editing.label,
                    fullName: editing.fullName,
                    phone: editing.phone,
                    line1: editing.line1,
                    line2: editing.line2,
                    city: editing.city,
                    postalCode: editing.postalCode,
                    isDefault: editing.isDefault,
                  }
                : undefined
            }
          />
        </div>
      </section>
    </div>
  );
}
