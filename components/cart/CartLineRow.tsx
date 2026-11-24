import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  removeCartItemAction,
  updateCartItemAction,
} from "@/actions/cart";
import type { CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

export function CartLineRow({ line }: { line: CartLine }) {
  const max = Math.max(1, Math.min(line.stock, 99));

  return (
    <div className="flex gap-4 py-5">
      <Link
        href={`/product/${line.slug}`}
        className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-steel-100 sm:size-28"
      >
        {line.image ? (
          <Image
            src={line.image}
            alt={line.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.14em] text-steel-500">
              {line.brand ?? "Industrial supply"} · {line.sku}
            </p>
            <h2 className="mt-1 truncate text-sm font-semibold text-white">
              <Link href={`/product/${line.slug}`} className="hover:text-flame-400">
                {line.name}
              </Link>
            </h2>
            <p className="mt-0.5 text-[11px] text-steel-500">{line.category}</p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-white">
            {formatPrice(line.lineTotal)}
          </p>
        </div>

        {line.issue ? (
          <p className="mt-2 text-[11px] text-danger">{line.issue}</p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          <div className="flex items-center rounded-lg border border-white/15">
            <form action={updateCartItemAction}>
              <input type="hidden" name="itemId" value={line.id} />
              <input type="hidden" name="quantity" value={line.quantity - 1} />
              <button
                type="submit"
                disabled={line.quantity <= 1}
                aria-label={`Decrease quantity of ${line.name}`}
                className="flex size-9 items-center justify-center text-steel-300 transition hover:text-white disabled:opacity-30"
              >
                <Minus className="size-3.5" />
              </button>
            </form>
            <span className="min-w-8 text-center text-xs font-semibold text-white">
              {line.quantity}
            </span>
            <form action={updateCartItemAction}>
              <input type="hidden" name="itemId" value={line.id} />
              <input type="hidden" name="quantity" value={line.quantity + 1} />
              <button
                type="submit"
                disabled={line.quantity >= max}
                aria-label={`Increase quantity of ${line.name}`}
                className="flex size-9 items-center justify-center text-steel-300 transition hover:text-white disabled:opacity-30"
              >
                <Plus className="size-3.5" />
              </button>
            </form>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-[11px] text-steel-500">
              {formatPrice(line.unitPrice)} each
            </p>
            <form action={removeCartItemAction}>
              <input type="hidden" name="itemId" value={line.id} />
              <button
                type="submit"
                aria-label={`Remove ${line.name}`}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-steel-500 transition hover:text-danger"
              >
                <Trash2 className="size-3.5" /> Remove
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
