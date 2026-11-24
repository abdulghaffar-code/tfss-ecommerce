"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  Building2,
  LockKeyhole,
  MapPin,
  Smartphone,
} from "lucide-react";
import { placeOrderAction } from "@/actions/checkout";
import { Alert } from "@/components/ui/Alert";
import { Field } from "@/components/ui/Field";
import { formatPrice } from "@/lib/utils";

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  postalCode: string | null;
  isDefault: boolean;
};

type Summary = {
  items: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    quantity: number;
    lineTotal: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
};

export function CheckoutForm({
  summary,
  defaults,
  addresses,
}: {
  summary: Summary;
  defaults: { name: string; email: string; phone: string };
  addresses: Address[];
}) {
  const [state, action, pending] = useActionState(placeOrderAction, undefined);
  const [selectedAddress, setSelectedAddress] = useState<string>(
    addresses.find((address) => address.isDefault)?.id ?? addresses[0]?.id ?? ""
  );
  const [payment, setPayment] = useState<"COD" | "BANK_TRANSFER">("COD");

  const address = addresses.find((item) => item.id === selectedAddress);
  const formKey = selectedAddress || "new";

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-12">
      <div className="space-y-8">
        <section className="rounded-2xl border border-white/10 bg-ink-900 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full border border-flame-500/30 bg-flame-500/10 text-[11px] font-bold text-flame-400">
              01
            </span>
            <h2 className="font-display text-lg font-semibold">Contact</h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              name="customerName"
              autoComplete="name"
              defaultValue={defaults.name}
              required
              error={state?.fieldErrors?.customerName}
            />
            <Field
              label="Phone"
              name="customerPhone"
              type="tel"
              autoComplete="tel"
              defaultValue={defaults.phone}
              placeholder="+92 300 0000000"
              required
              error={state?.fieldErrors?.customerPhone}
            />
            <Field
              label="Email"
              name="customerEmail"
              type="email"
              autoComplete="email"
              defaultValue={defaults.email}
              required
              className="sm:col-span-2"
              error={state?.fieldErrors?.customerEmail}
              hint="Order updates are sent to this address."
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-ink-900 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full border border-flame-500/30 bg-flame-500/10 text-[11px] font-bold text-flame-400">
              02
            </span>
            <h2 className="font-display text-lg font-semibold">Delivery address</h2>
          </div>

          {addresses.length > 0 ? (
            <div className="mt-5 grid gap-2">
              {addresses.map((item) => (
                <label
                  key={item.id}
                  className={
                    selectedAddress === item.id
                      ? "relative flex cursor-pointer gap-3 rounded-lg border border-flame-500/60 bg-flame-500/[0.05] p-3.5"
                      : "relative flex cursor-pointer gap-3 rounded-lg border border-white/10 p-3.5 transition hover:border-white/25"
                  }
                >
                  <input
                    type="radio"
                    name="addressChoice"
                    value={item.id}
                    checked={selectedAddress === item.id}
                    onChange={() => setSelectedAddress(item.id)}
                    className="mt-1 size-4 accent-flame-500"
                  />
                  <span className="text-xs leading-relaxed text-steel-300">
                    <span className="block font-semibold text-white">
                      {item.label} — {item.fullName}
                    </span>
                    {item.line1}
                    {item.line2 ? `, ${item.line2}` : ""}, {item.city}
                    <span className="mt-0.5 block text-steel-500">{item.phone}</span>
                  </span>
                </label>
              ))}
              <label className="flex cursor-pointer items-center gap-2.5 px-1 pt-1 text-xs text-steel-400">
                <input
                  type="radio"
                  name="addressChoice"
                  value="new"
                  checked={selectedAddress === ""}
                  onChange={() => setSelectedAddress("")}
                  className="size-4 accent-flame-500"
                />
                Use a different address
              </label>
            </div>
          ) : null}

          <div key={formKey} className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              label="Street address"
              name="addressLine"
              autoComplete="street-address"
              defaultValue={
                address ? `${address.line1}${address.line2 ? `, ${address.line2}` : ""}` : ""
              }
              placeholder="Shop / building, street, area"
              required
              className="sm:col-span-2"
              error={state?.fieldErrors?.addressLine}
            />
            <Field
              label="City"
              name="city"
              autoComplete="address-level2"
              defaultValue={address?.city ?? "Karachi"}
              required
              error={state?.fieldErrors?.city}
            />
            <Field
              label="Postal code (optional)"
              name="postalCode"
              autoComplete="postal-code"
              defaultValue={address?.postalCode ?? ""}
              error={state?.fieldErrors?.postalCode}
            />
            <Field
              label="Order notes (optional)"
              name="notes"
              placeholder="Site contact, delivery instructions…"
              className="sm:col-span-2"
              error={state?.fieldErrors?.notes}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-ink-900 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full border border-flame-500/30 bg-flame-500/10 text-[11px] font-bold text-flame-400">
              03
            </span>
            <h2 className="font-display text-lg font-semibold">Payment</h2>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <label
              className={
                payment === "COD"
                  ? "flex cursor-pointer gap-3 rounded-lg border border-flame-500/60 bg-flame-500/[0.05] p-4"
                  : "flex cursor-pointer gap-3 rounded-lg border border-white/10 p-4 transition hover:border-white/25"
              }
            >
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={payment === "COD"}
                onChange={() => setPayment("COD")}
                className="mt-1 size-4 accent-flame-500"
              />
              <span>
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Banknote className="size-4 text-flame-500" /> Cash on delivery
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-steel-500">
                  Pay in cash when the order is handed over. Available within
                  our delivery area.
                </span>
              </span>
            </label>

            <label
              className={
                payment === "BANK_TRANSFER"
                  ? "flex cursor-pointer gap-3 rounded-lg border border-flame-500/60 bg-flame-500/[0.05] p-4"
                  : "flex cursor-pointer gap-3 rounded-lg border border-white/10 p-4 transition hover:border-white/25"
              }
            >
              <input
                type="radio"
                name="paymentMethod"
                value="BANK_TRANSFER"
                checked={payment === "BANK_TRANSFER"}
                onChange={() => setPayment("BANK_TRANSFER")}
                className="mt-1 size-4 accent-flame-500"
              />
              <span>
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Building2 className="size-4 text-flame-500" /> Bank transfer
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-steel-500">
                  Bank details are issued after the order is confirmed. Payment
                  remains pending until our team verifies the transfer.
                </span>
              </span>
            </label>
          </div>

          {payment === "BANK_TRANSFER" ? (
            <Alert tone="info" className="mt-3">
              No online card payment is taken on this storefront. We do not mark
              an order paid until the transfer appears in the company account.
            </Alert>
          ) : null}
        </section>

        {state?.error ? <Alert tone="error">{state.error}</Alert> : null}

        <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-steel-400">
          <input
            type="checkbox"
            name="acceptTerms"
            className="mt-0.5 size-4 shrink-0 accent-flame-500"
          />
          <span>
            I have reviewed the order and accept the{" "}
            <Link href="/terms" className="text-white underline underline-offset-2">
              terms of service
            </Link>
            ,{" "}
            <Link href="/shipping" className="text-white underline underline-offset-2">
              shipping policy
            </Link>{" "}
            and{" "}
            <Link href="/returns" className="text-white underline underline-offset-2">
              returns policy
            </Link>
            .
          </span>
        </label>
        {state?.fieldErrors?.acceptTerms ? (
          <p className="text-xs text-danger">{state.fieldErrors.acceptTerms}</p>
        ) : null}
      </div>

      <aside className="lg:sticky lg:top-28">
        <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Your order</h2>
            <Link href="/cart" className="text-[10px] uppercase tracking-[0.12em] text-steel-500 hover:text-white">
              Edit
            </Link>
          </div>

          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
            {summary.items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded bg-steel-100">
                  {item.image ? (
                    <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
                  ) : null}
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-ink-950 text-[9px] font-bold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-steel-200">{item.name}</p>
                  <p className="mt-0.5 text-[10px] text-steel-500">
                    {formatPrice(item.lineTotal)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2.5 border-y border-white/10 py-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-steel-400">Subtotal</dt>
              <dd className="text-white">{formatPrice(summary.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel-400">Delivery</dt>
              <dd className="text-white">
                {summary.shipping === 0 ? "Free" : formatPrice(summary.shipping)}
              </dd>
            </div>
          </dl>

          <div className="flex items-end justify-between py-4">
            <span className="text-sm text-steel-300">Total</span>
            <span className="font-display text-2xl font-semibold text-white">
              {formatPrice(summary.total)}
            </span>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-flame-500 font-display text-sm font-semibold text-ink-950 transition hover:bg-flame-400 disabled:opacity-60"
          >
            {pending ? "Placing order…" : "Place order"}
          </button>

          <p className="mt-4 flex items-start gap-2 text-[10px] leading-relaxed text-steel-500">
            <LockKeyhole className="mt-0.5 size-3.5 shrink-0" />
            Server-side price and stock validation. Your order is created as
            Pending — no charge is claimed until payment is confirmed.
          </p>

          <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-4 text-[10px] text-steel-600">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3" /> Karachi delivery
            </span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="size-3" /> Order updates by phone/email
            </span>
          </div>
        </div>
      </aside>
    </form>
  );
}
