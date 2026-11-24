"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import { Alert } from "@/components/ui/Alert";
import { Field } from "@/components/ui/Field";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
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
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Your password"
        required
        error={state?.fieldErrors?.password}
      />
      {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center rounded-lg bg-flame-500 font-display text-sm font-semibold text-ink-950 transition hover:bg-flame-400 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="pt-1 text-[11px] leading-relaxed text-steel-500">
        New here?{" "}
        <Link
          href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"}
          className="font-semibold text-white underline-offset-4 hover:underline"
        >
          Create a customer account
        </Link>
        . Admin accounts are created internally; registration here never grants
        admin access.
      </p>
    </form>
  );
}
