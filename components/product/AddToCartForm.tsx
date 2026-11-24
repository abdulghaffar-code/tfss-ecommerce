"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { addToCartAction } from "@/actions/cart";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export function AddToCartForm({
  productId,
  stock,
  compact = false,
}: {
  productId: string;
  stock: number;
  compact?: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [state, action, pending] = useActionState(addToCartAction, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state?.ok, router]);

  const max = Math.max(1, Math.min(stock, 99));

  return (
    <div className="w-full">
      <form action={action} className="flex w-full flex-col gap-3 sm:flex-row">
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="quantity" value={quantity} />

        <div className="flex h-[3.25rem] items-center justify-between rounded-lg border border-white/15 bg-ink-900 px-1 sm:w-36">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex size-11 items-center justify-center text-steel-300 transition hover:text-white disabled:opacity-30"
          >
            <Minus className="size-4" />
          </button>
          <span aria-live="polite" className="min-w-6 text-center text-sm font-semibold text-white">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(max, q + 1))}
            disabled={quantity >= max}
            aria-label="Increase quantity"
            className="flex size-11 items-center justify-center text-steel-300 transition hover:text-white disabled:opacity-30"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={pending || stock <= 0}
          className={compact ? "flex-1" : "flex-1"}
        >
          <ShoppingBag className="size-4" />
          {stock <= 0
            ? "Out of stock"
            : pending
              ? "Adding…"
              : "Add to cart"}
        </Button>
      </form>

      {state?.error ? (
        <Alert tone="error" className="mt-3">
          {state.error}
        </Alert>
      ) : null}
      {state?.ok ? (
        <Alert tone="success" className="mt-3">
          {state.message}{" "}
          <Link href="/cart" className="font-semibold underline underline-offset-2">
            View cart
          </Link>
        </Alert>
      ) : null}
    </div>
  );
}
