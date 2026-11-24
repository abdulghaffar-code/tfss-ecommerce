"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  MapPin,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "Overview", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account" className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col">
      {links.map((link) => {
        const active =
          link.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-xs font-medium transition",
              active
                ? "bg-white/[0.08] text-white"
                : "text-steel-400 hover:bg-white/[0.04] hover:text-white"
            )}
          >
            <link.icon className="size-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
