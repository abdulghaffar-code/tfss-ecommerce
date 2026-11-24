"use client";

import { useActionState } from "react";
import {
  changePasswordAction,
  updateProfileAction,
} from "@/actions/account";
import { Alert } from "@/components/ui/Alert";
import { Field } from "@/components/ui/Field";

export function ProfileForm({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string;
}) {
  const [state, action, pending] = useActionState(updateProfileAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" defaultValue={name} required error={state?.fieldErrors?.name} />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          defaultValue={phone}
          error={state?.fieldErrors?.phone}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          defaultValue={email}
          disabled
          className="sm:col-span-2"
          hint="Email changes require identity verification. Contact the counter."
        />
      </div>
      {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state?.ok ? <Alert tone="success">{state.message}</Alert> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-lg bg-white px-5 font-display text-xs font-semibold text-ink-950 transition hover:bg-steel-100 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <Field
        label="Current password"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        required
        error={state?.fieldErrors?.currentPassword}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="New password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          error={state?.fieldErrors?.newPassword}
          hint="8+ characters with a letter and a number."
        />
        <Field
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          error={state?.fieldErrors?.confirmPassword}
        />
      </div>
      {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state?.ok ? <Alert tone="success">{state.message}</Alert> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-lg border border-white/20 px-5 font-display text-xs font-semibold text-white transition hover:border-white/40 disabled:opacity-60"
      >
        {pending ? "Updating…" : "Change password"}
      </button>
    </form>
  );
}
