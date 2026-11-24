"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Check, Loader2, Plus } from "lucide-react";
import { addToCartAction } from "@/actions/cart";
import { cn } from "@/lib/utils";

export function QuickAddButton({
  productId,
  stock,
  className,
}: {
  productId: string;
  stock: number;
  className?: string;
}) {
  const [state, action, pending] = useActionState(addToCartAction, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state?.ok, router]);

  return (
    <form action={action} className={cn("inline-flex", className)}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={1} />
      <button
        type="submit"
        disabled={pending || stock <= 0}
        aria-label={state?.ok ? "Added to cart" : "Add to cart"}
        title={state?.error ?? state?.message ?? "Add to cart"}
        className={cn(
          "flex size-10 items-center justify-center rounded-full border border-white/15 bg-ink-950/80 text-white backdrop-blur transition hover:border-flame-500 hover:bg-flame-500 hover:text-ink-950 disabled:opacity-50",
          state?.ok && "border-success/60 text-success hover:bg-success hover:text-ink-950"
        )}
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : state?.ok ? (
          <Check className="size-4" />
        ) : (
          <Plus className="size-4" />
        )}
      </button>
    </form>
  );
}
