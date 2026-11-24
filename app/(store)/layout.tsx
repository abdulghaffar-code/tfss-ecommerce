import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCurrentUser } from "@/lib/auth";
import { getCartCount } from "@/lib/cart";
import { getCategories } from "@/lib/catalog";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export default async function StoreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  const [categories, cartCount, settings, wishlist] = await Promise.all([
    getCategories(true),
    getCartCount(user),
    getSettings(),
    user
      ? prisma.wishlist.findUnique({
          where: { userId: user.id },
          select: { _count: { select: { items: true } } },
        })
      : Promise.resolve(null),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-flame-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
      >
        Skip to content
      </a>
      <Header
        categories={categories.map((c) => ({
          slug: c.slug,
          name: c.name,
          count: c._count.products,
        }))}
        user={
          user
            ? { name: user.name, email: user.email, role: user.role }
            : null
        }
        cartCount={cartCount}
        wishlistCount={wishlist?._count.items ?? 0}
        announcement={settings.announcement}
        phone={settings.phone}
        logoUrl={settings.logoUrl}
      />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer
        settings={settings}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      />
    </div>
  );
}
