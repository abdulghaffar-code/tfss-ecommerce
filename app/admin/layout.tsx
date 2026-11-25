import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/actions/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin dashboard",
  description: "Store administration.",
  noIndex: true,
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="mx-auto flex max-w-[1680px]">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-ink-900 px-3 py-5 lg:flex">
          <Link href="/admin" className="px-3">
            <Image
              src="/brand/logo.png"
              alt="Total Fire & Safety Solution"
              width={512}
              height={512}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <div className="mt-5 flex-1 overflow-y-auto pb-4">
            <AdminNav />
          </div>
          <div className="border-t border-white/10 pt-4">
            <Link
              href="/"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-steel-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              View store <ArrowUpRight className="size-3.5" />
            </Link>
            <div className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2">
              <span className="flex size-8 items-center justify-center rounded-full border border-flame-500/30 bg-flame-500/10 text-[10px] font-bold text-flame-400">
                {user.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-white">{user.name}</p>
                <p className="truncate text-[10px] text-steel-500">{user.email}</p>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  aria-label="Sign out"
                  className="text-steel-500 transition hover:text-white"
                >
                  <LogOut className="size-4" />
                </button>
              </form>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/90 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <Image
                src="/brand/logo.png"
                alt="Total Fire & Safety Solution"
                width={512}
                height={512}
                className="h-9 w-auto object-contain"
              />
              <div className="flex items-center gap-3">
                <Link href="/" className="text-[10px] uppercase tracking-[0.12em] text-steel-400">
                  Store
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="text-[10px] uppercase tracking-[0.12em] text-steel-400">
                    Sign out
                  </button>
                </form>
              </div>
            </div>
            <AdminNav mobile />
          </header>

          <div className="p-5 sm:p-7 lg:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
