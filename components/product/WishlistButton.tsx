"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useActionState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { toggleWishlistAction } from "@/actions/wishlist";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  initialSaved = false,
  className,
  withLabel = false,
}: {
  productId: string;
  initialSaved?: boolean;
  className?: string;
  withLabel?: boolean;
}) {
  const [state, action, pending] = useActionState(
    toggleWishlistAction,
    undefined
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state?.requiresAuth) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [state?.requiresAuth, router, pathname]);

  const saved =
    state?.ok && state.message?.toLowerCase().includes("saved")
      ? true
      : state?.ok
        ? false
        : initialSaved;

  return (
    <form action={action} className={cn("inline-flex", className)}>
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        disabled={pending}
        aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        aria-pressed={saved}
        title={saved ? "Remove from wishlist" : "Save to wishlist"}
        className={cn(
          "flex h-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-ink-950/70 px-3 text-steel-300 backdrop-blur transition hover:border-white/35 hover:text-white",
          saved && "border-flame-500/50 text-flame-400",
          withLabel && "rounded-lg px-4 text-xs font-semibold uppercase tracking-[0.12em]"
        )}
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Heart className={cn("size-4", saved && "fill-flame-500 text-flame-500")} />
        )}
        {withLabel ? <span>{saved ? "Saved" : "Save"}</span> : null}
      </button>
    </form>
  );
}
