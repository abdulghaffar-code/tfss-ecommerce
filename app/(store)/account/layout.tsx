import Link from "next/link";
import { ArrowUpRight, LogOut, ShieldCheck } from "lucide-react";
import { AccountNav } from "@/components/account/AccountNav";
import { requireUser } from "@/lib/auth";
import { logoutAction } from "@/actions/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Your account",
  description: "Manage your orders, addresses and wishlist.",
  noIndex: true,
});

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser("/account");
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="shell py-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[248px_1fr] lg:gap-12">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-white/10 bg-ink-900 p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full border border-flame-500/30 bg-flame-500/10 font-display text-sm font-semibold text-flame-400">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                <p className="truncate text-[11px] text-steel-500">{user.email}</p>
              </div>
            </div>

            <div className="mt-4 border-t border-white/10 pt-3">
              <AccountNav />
            </div>

            {user.role === "ADMIN" ? (
              <Link
                href="/admin"
                className="mt-3 flex items-center justify-between rounded-lg border border-flame-500/20 bg-flame-500/[0.06] px-3 py-2.5 text-[11px] font-semibold text-flame-400 transition hover:bg-flame-500/10"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5" /> Admin dashboard
                </span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            ) : null}

            <form action={logoutAction} className="mt-3 border-t border-white/10 pt-3">
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2 text-xs text-steel-500 transition hover:bg-white/[0.04] hover:text-white"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
