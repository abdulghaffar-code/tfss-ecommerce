"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/actions/auth";
import { Alert } from "@/components/ui/Alert";
import { Field } from "@/components/ui/Field";

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <Field
        label="Full name"
        name="name"
        autoComplete="name"
        placeholder="Your name"
        required
        error={state?.fieldErrors?.name}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        required
        error={state?.fieldErrors?.email}
      />
      <Field
        label="Phone (optional)"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="+92 300 0000000"
        error={state?.fieldErrors?.phone}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        required
        minLength={8}
        error={state?.fieldErrors?.password}
        hint="At least 8 characters. Use a unique password."
      />
      {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center rounded-lg bg-flame-500 font-display text-sm font-semibold text-ink-950 transition hover:bg-flame-400 disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
      <p className="pt-1 text-[11px] leading-relaxed text-steel-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-white underline-offset-4 hover:underline">
          Sign in
        </Link>
        . By creating an account you accept our{" "}
        <Link href="/terms" className="text-steel-300 underline underline-offset-2">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-steel-300 underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
