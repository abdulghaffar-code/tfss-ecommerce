"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveAddressAction } from "@/actions/account";
import { Alert } from "@/components/ui/Alert";
import { Field } from "@/components/ui/Field";

type AddressValues = {
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

export function AddressForm({ address }: { address?: AddressValues }) {
  const [state, action, pending] = useActionState(saveAddressAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok && !address) formRef.current?.reset();
  }, [state?.ok, address]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      {address ? <input type="hidden" name="addressId" value={address.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Label"
          name="label"
          defaultValue={address?.label ?? "Shipping"}
          placeholder="Office, site, warehouse…"
          error={state?.fieldErrors?.label}
        />
        <Field
          label="Recipient name"
          name="fullName"
          defaultValue={address?.fullName}
          autoComplete="name"
          required
          error={state?.fieldErrors?.fullName}
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          defaultValue={address?.phone}
          autoComplete="tel"
          required
          error={state?.fieldErrors?.phone}
        />
        <Field
          label="City"
          name="city"
          defaultValue={address?.city ?? "Karachi"}
          autoComplete="address-level2"
          required
          error={state?.fieldErrors?.city}
        />
        <Field
          label="Address line 1"
          name="line1"
          defaultValue={address?.line1}
          autoComplete="address-line1"
          required
          className="sm:col-span-2"
          error={state?.fieldErrors?.line1}
        />
        <Field
          label="Address line 2 (optional)"
          name="line2"
          defaultValue={address?.line2 ?? ""}
          autoComplete="address-line2"
          className="sm:col-span-2"
          error={state?.fieldErrors?.line2}
        />
        <Field
          label="Postal code (optional)"
          name="postalCode"
          defaultValue={address?.postalCode ?? ""}
          autoComplete="postal-code"
          error={state?.fieldErrors?.postalCode}
        />
        <label className="flex items-center gap-2.5 self-end pb-3 text-xs text-steel-300">
          <input
            type="checkbox"
            name="isDefault"
            defaultChecked={address?.isDefault}
            className="size-4 accent-flame-500"
          />
          Set as default address
        </label>
      </div>

      {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state?.fieldErrors?.form ? <Alert tone="error">{state.fieldErrors.form}</Alert> : null}
      {state?.ok ? <Alert tone="success">{state.message}</Alert> : null}

      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-lg bg-flame-500 px-5 font-display text-xs font-semibold text-ink-950 transition hover:bg-flame-400 disabled:opacity-60"
      >
        {pending ? "Saving…" : address ? "Update address" : "Add address"}
      </button>
    </form>
  );
}
