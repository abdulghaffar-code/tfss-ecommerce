import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getCart } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Checkout",
  description: "Complete your safety equipment order.",
  path: "/checkout",
  noIndex: true,
});

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  const cart = await getCart(user);

  if (!cart || cart.items.length === 0) redirect("/cart");
  if (cart.hasIssues) redirect("/cart");

  const addresses = user
    ? await prisma.address.findMany({
        where: { userId: user.id },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      })
    : [];

  return (
    <div className="shell py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <div className="mt-5 max-w-2xl">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-3 text-4xl leading-[0.98] tracking-tightest sm:text-5xl">
          Finish the order.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-steel-400">
          We confirm stock and delivery with you before dispatch. No card
          details are collected on this site.
        </p>
      </div>

      <div className="mt-8">
        <CheckoutForm
          summary={{
            items: cart.items.map((item) => ({
              id: item.id,
              name: item.name,
              slug: item.slug,
              image: item.image,
              quantity: item.quantity,
              lineTotal: item.lineTotal,
            })),
            subtotal: cart.subtotal,
            shipping: cart.shipping,
            total: cart.total,
            itemCount: cart.itemCount,
          }}
          defaults={{
            name: user?.name ?? "",
            email: user?.email ?? "",
            phone: user?.phone ?? "",
          }}
          addresses={addresses.map((address) => ({
            id: address.id,
            label: address.label,
            fullName: address.fullName,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            postalCode: address.postalCode,
            isDefault: address.isDefault,
          }))}
        />
      </div>
    </div>
  );
}
