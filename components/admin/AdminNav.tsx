"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  Image as ImageIcon,
  LayoutGrid,
  Mail,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "Trade",
    links: [
      { href: "/admin", label: "Overview", icon: BarChart3, exact: true },
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Catalogue",
    links: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: LayoutGrid },
      { href: "/admin/brands", label: "Manufacturers", icon: Tags },
      { href: "/admin/inventory", label: "Inventory", icon: Boxes },
    ],
  },
  {
    label: "Storefront",
    links: [
      { href: "/admin/banners", label: "Homepage slider", icon: ImageIcon },
      { href: "/admin/settings", label: "Company settings", icon: Settings },
    ],
  },
];

export function AdminNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav className="no-scrollbar flex gap-1 overflow-x-auto px-4 py-2" aria-label="Admin">
        {groups.flatMap((group) => group.links).map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-[11px] font-medium transition",
                active ? "bg-white/10 text-white" : "text-steel-400"
              )}
            >
              <link.icon className="size-3.5" /> {link.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Admin" className="space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-steel-600">
            {group.label}
          </p>
          <div className="mt-2 space-y-0.5">
            {group.links.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition",
                    active
                      ? "bg-white/[0.08] text-white"
                      : "text-steel-400 hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  <link.icon className="size-4 shrink-0" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
