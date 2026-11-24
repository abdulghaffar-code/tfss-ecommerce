"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendInquiryAction } from "@/actions/inquiry";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field, Textarea } from "@/components/ui/Field";

export function InquiryForm({
  productId,
  compact = false,
  submitLabel = "Send inquiry",
}: {
  productId?: string;
  compact?: boolean;
  submitLabel?: string;
}) {
  const [state, action, pending] = useActionState(sendInquiryAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state?.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      {productId ? <input type="hidden" name="productId" value={productId} /> : null}
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <Field
          label="Your name"
          name="name"
          autoComplete="name"
          placeholder="Full name"
          required
          error={state?.fieldErrors?.name}
        />
        <Field
          label="Work email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          required
          error={state?.fieldErrors?.email}
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+92 300 0000000"
          required
          error={state?.fieldErrors?.phone}
        />
        <Field
          label="Company (optional)"
          name="company"
          autoComplete="organization"
          placeholder="Company / site name"
          error={state?.fieldErrors?.company}
        />
      </div>
      <Textarea
        label="What do you need?"
        name="message"
        placeholder="Product, quantity, site requirements or a question about availability…"
        required
        error={state?.fieldErrors?.message}
      />

      {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state?.ok ? <Alert tone="success">{state.message}</Alert> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[11px] leading-relaxed text-steel-500">
          Your details are used only to respond to this inquiry. No newsletter,
          no resale.
        </p>
        <Button type="submit" disabled={pending} size="md" className="shrink-0">
          {pending ? "Sending…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
