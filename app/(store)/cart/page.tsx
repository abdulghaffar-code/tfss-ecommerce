import Link from "next/link";
import { ArrowRight, LockKeyhole, ShoppingBag } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CartLineRow } from "@/components/cart/CartLineRow";
import { Alert } from "@/components/ui/Alert";
import { clearCartAction } from "@/actions/cart";
import { getCart } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Your cart",
  description: "Review your safety equipment cart.",
  path: "/cart",
  noIndex: true,
});

export default async function CartPage() {
  const user = await getCurrentUser();
  const cart = await getCart(user);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - (cart?.subtotal ?? 0));
  const progress = Math.min(
    100,
    Math.round(((cart?.subtotal ?? 0) / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <div className="shell py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your selection</p>
          <h1 className="mt-3 text-4xl leading-[0.98] tracking-tightest sm:text-5xl">
            Cart
          </h1>
        </div>
        {cart && cart.items.length > 0 ? (
          <p className="text-xs text-steel-500">
            {cart.itemCount} {cart.itemCount === 1 ? "unit" : "units"} ·{" "}
            {cart.items.length} {cart.items.length === 1 ? "line" : "lines"}
          </p>
        ) : null}
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-ink-900 px-6 py-20 text-center">
          <span className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <ShoppingBag className="size-6 text-steel-400" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-semibold">
            Nothing in the cart yet.
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-steel-400">
            Browse the catalogue or send us a requirement if you cannot find the
            exact specification.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-flame-500 px-5 text-sm font-semibold text-ink-950 transition hover:bg-flame-400"
            >
              Browse products <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-lg border border-white/20 px-5 text-sm font-semibold text-white transition hover:border-white/40"
            >
              Request a quotation
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-12">
          <div>
            {cart.hasIssues ? (
              <Alert tone="error" className="mb-4">
                Some items need attention before checkout. Adjust the quantities
                or remove the unavailable lines.
              </Alert>
            ) : null}

            <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-ink-900 px-5 sm:px-6">
              {cart.items.map((line) => (
                <CartLineRow key={line.id} line={line} />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/shop"
                className="text-xs font-semibold text-steel-300 underline-offset-4 transition hover:text-white hover:underline"
              >
                ← Continue shopping
              </Link>
              <form action={clearCartAction}>
                <button
                  type="submit"
                  className="text-[10px] uppercase tracking-[0.14em] text-steel-600 transition hover:text-danger"
                >
                  Clear cart
                </button>
              </form>
            </div>

            {!user ? (
              <p className="mt-4 text-[11px] leading-relaxed text-steel-500">
                Your cart is saved to this browser.{" "}
                <Link
                  href="/login?next=/cart"
                  className="font-semibold text-flame-400 hover:underline"
                >
                  Sign in
                </Link>{" "}
                to merge it with your account cart and keep it across devices.
              </p>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 sm:p-6">
              <h2 className="font-display text-lg font-semibold">Order summary</h2>

              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-steel-500">
                  <span>
                    {remaining > 0
                      ? `${formatPrice(remaining)} to free delivery`
                      : "Free delivery unlocked"}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-flame-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <dl className="mt-5 space-y-3 border-y border-white/10 py-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-steel-400">Subtotal</dt>
                  <dd className="text-white">{formatPrice(cart.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-steel-400">Delivery</dt>
                  <dd className="text-white">
                    {cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-steel-400">Discount</dt>
                  <dd className="text-steel-500">—</dd>
                </div>
              </dl>

              <div className="flex items-end justify-between py-4">
                <span className="text-sm text-steel-300">Total</span>
                <span className="font-display text-2xl font-semibold text-white">
                  {formatPrice(cart.total)}
                </span>
              </div>

              <Link
                href={cart.hasIssues ? "/cart" : "/checkout"}
                aria-disabled={cart.hasIssues}
                className={
                  cart.hasIssues
                    ? "pointer-events-none flex h-12 items-center justify-center rounded-lg bg-white/10 text-sm font-semibold text-steel-500"
                    : "flex h-12 items-center justify-center gap-2 rounded-lg bg-flame-500 font-display text-sm font-semibold text-ink-950 transition hover:bg-flame-400"
                }
              >
                Continue to checkout <ArrowRight className="size-4" />
              </Link>

              <p className="mt-4 flex items-start gap-2 text-[10px] leading-relaxed text-steel-500">
                <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-steel-400" />
                Prices and stock are revalidated on the server when the order is
                placed. Payment is never marked paid automatically.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
