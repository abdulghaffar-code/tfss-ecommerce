"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type HeaderCategory = {
  slug: string;
  name: string;
  count: number;
};

type HeaderUser = {
  name: string;
  email: string;
  role: string;
} | null;

export function Header({
  categories,
  user,
  cartCount,
  wishlistCount,
  announcement,
  phone,
  logoUrl = "/brand/logo.png",
}: {
  categories: HeaderCategory[];
  user: HeaderUser;
  cartCount: number;
  wishlistCount: number;
  announcement: string | null;
  phone: string;
  logoUrl?: string | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setCatsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setCatsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="relative z-40 border-b border-white/10 bg-ink-900">
        <div className="shell flex h-9 items-center justify-between text-[10px] uppercase tracking-[0.14em] text-steel-400">
          <p className="flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-flame-500" />
            <span className="truncate">
              {announcement ||
                "Karachi's industrial safety house · Established 1992"}
            </span>
          </p>
          <div className="hidden items-center gap-6 sm:flex">
            <span className="hidden text-steel-500 md:inline">
              Free delivery over PKR 15,000
            </span>
            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="flex items-center gap-1.5 font-medium text-white transition hover:text-flame-400"
            >
              <Phone className="size-3" />
              {phone}
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-colors duration-300",
          scrolled
            ? "border-white/10 bg-ink-950/92 backdrop-blur-xl"
            : "border-white/[0.06] bg-ink-950"
        )}
      >
        <div className="shell flex h-[70px] items-center gap-4 lg:h-[78px]">
          <Link href="/" aria-label="Total Fire & Safety Solution — home" className="shrink-0">
            <Image
              src={logoUrl || "/brand/logo.png"}
              alt="Total Fire & Safety Solution"
              width={512}
              height={512}
              priority
              className="h-12 w-auto object-contain sm:h-14"
            />
          </Link>

          <nav className="ml-6 hidden items-center gap-7 lg:flex" aria-label="Primary">
            <Link
              href="/shop"
              className={cn(
                "text-[13px] font-medium transition hover:text-white",
                isActive("/shop") ? "text-white" : "text-steel-300"
              )}
            >
              Shop all
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setCatsOpen(true)}
              onMouseLeave={() => setCatsOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCatsOpen((v) => !v)}
                aria-expanded={catsOpen}
                aria-haspopup="true"
                className={cn(
                  "flex items-center gap-1.5 py-4 text-[13px] font-medium transition hover:text-white",
                  pathname.startsWith("/category") ? "text-white" : "text-steel-300"
                )}
              >
                Categories
                <ChevronDown
                  className={cn("size-3.5 transition", catsOpen && "rotate-180")}
                />
              </button>

              <AnimatePresence>
                {catsOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 top-full w-[720px] -translate-x-1/2 pt-2"
                  >
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-lift">
                      <div className="grid grid-cols-2 gap-x-2 p-4">
                        {categories.map((category) => (
                          <Link
                            key={category.slug}
                            href={`/category/${category.slug}`}
                            className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition hover:bg-white/[0.05]"
                          >
                            <span className="text-[13px] text-steel-200 group-hover:text-white">
                              {category.name}
                            </span>
                            <span className="text-[10px] text-steel-500">
                              {category.count || "—"}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-5 py-3.5">
                        <span className="text-[11px] text-steel-500">
                          Can&apos;t find what you need? We source to order.
                        </span>
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-flame-400 hover:text-flame-300"
                        >
                          Ask us <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <Link
              href="/brands"
              className={cn(
                "text-[13px] font-medium transition hover:text-white",
                isActive("/brands") ? "text-white" : "text-steel-300"
              )}
            >
              Manufacturers
            </Link>
            <Link
              href="/about"
              className={cn(
                "text-[13px] font-medium transition hover:text-white",
                isActive("/about") ? "text-white" : "text-steel-300"
              )}
            >
              Our story
            </Link>
            <Link
              href="/contact"
              className={cn(
                "text-[13px] font-medium transition hover:text-white",
                isActive("/contact") ? "text-white" : "text-steel-300"
              )}
            >
              Contact
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
            <form
              action="/shop"
              role="search"
              className="relative hidden w-[210px] xl:block"
            >
              <label htmlFor="site-search" className="sr-only">
                Search products
              </label>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel-500" />
              <input
                id="site-search"
                name="q"
                type="search"
                placeholder="Search PPE, SKU…"
                className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-3 text-xs text-white placeholder:text-steel-500 transition focus:border-flame-500/60 focus:bg-ink-900 focus:outline-none"
              />
            </form>

            <Link
              href={user ? "/account" : "/login"}
              aria-label={user ? "Your account" : "Sign in"}
              className="hidden size-10 items-center justify-center rounded-lg text-steel-300 transition hover:bg-white/[0.06] hover:text-white sm:flex"
            >
              <User className="size-[18px]" />
            </Link>

            <Link
              href="/account/wishlist"
              aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ""}`}
              className="relative hidden size-10 items-center justify-center rounded-lg text-steel-300 transition hover:bg-white/[0.06] hover:text-white sm:flex"
            >
              <Heart className="size-[18px]" />
              {wishlistCount > 0 ? (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-flame-500 text-[9px] font-bold text-ink-950">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              ) : null}
            </Link>

            <Link
              href="/cart"
              aria-label={`Cart${cartCount ? `, ${cartCount} items` : ""}`}
              className="relative flex h-10 items-center gap-2 rounded-lg border border-white/12 px-3 text-steel-200 transition hover:border-white/30 hover:text-white"
            >
              <ShoppingBag className="size-[18px]" />
              <span className="hidden text-xs font-semibold sm:inline">Cart</span>
              <span
                className={cn(
                  "flex min-w-5 items-center justify-center rounded-md px-1 text-[10px] font-bold",
                  cartCount > 0
                    ? "bg-flame-500 text-ink-950"
                    : "bg-white/10 text-steel-400"
                )}
              >
                {cartCount}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex size-10 items-center justify-center rounded-lg text-white transition hover:bg-white/[0.06] lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="absolute right-0 top-0 flex h-full w-[min(92vw,420px)] flex-col overflow-y-auto border-l border-white/10 bg-ink-950 pb-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <Image
                  src={logoUrl || "/brand/logo.png"}
                  alt="Total Fire & Safety Solution"
                  width={512}
                  height={512}
                  className="h-11 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="flex size-10 items-center justify-center rounded-lg border border-white/10 text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="px-5 pt-5">
                <form action="/shop" role="search" className="relative">
                  <label htmlFor="mobile-search" className="sr-only">
                    Search products
                  </label>
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel-500" />
                  <input
                    id="mobile-search"
                    name="q"
                    type="search"
                    placeholder="Search products or SKU"
                    className="field pl-9"
                  />
                </form>
              </div>

              <nav className="px-5 py-6" aria-label="Mobile">
                <Link
                  href="/shop"
                  className="flex items-center justify-between border-b border-white/10 py-3.5 font-display text-lg text-white"
                >
                  Shop all <ArrowRight className="size-4 text-flame-500" />
                </Link>
                <p className="eyebrow mt-6">Categories</p>
                <div className="mt-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="flex items-center justify-between border-b border-white/[0.06] py-2.5 text-sm text-steel-300"
                    >
                      {category.name}
                      <span className="text-[10px] text-steel-600">{category.count || ""}</span>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 grid gap-2 text-sm">
                  <Link href="/brands" className="py-2 text-steel-200">
                    Manufacturers
                  </Link>
                  <Link href="/about" className="py-2 text-steel-200">
                    Our story
                  </Link>
                  <Link href="/contact" className="py-2 text-steel-200">
                    Contact &amp; location
                  </Link>
                  <Link href={user ? "/account" : "/login"} className="py-2 text-steel-200">
                    {user ? `Account — ${user.name.split(" ")[0]}` : "Sign in / Register"}
                  </Link>
                  <Link href="/account/wishlist" className="py-2 text-steel-200">
                    Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}
                  </Link>
                </div>
              </nav>

              <div className="mt-auto border-t border-white/10 px-5 pt-5">
                <p className="text-[11px] uppercase tracking-[0.16em] text-steel-500">
                  Speak to a specialist
                </p>
                <a
                  href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                  className="mt-1 block font-display text-xl text-white"
                >
                  {phone}
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
