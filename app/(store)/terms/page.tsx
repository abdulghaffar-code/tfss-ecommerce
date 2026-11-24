import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { PolicyBody } from "@/components/layout/PolicyBody";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of service",
  description:
    "Terms covering use of the Total Fire & Safety Solution storefront, orders, pricing and payment.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of service."
        description="The basis on which this storefront is provided and orders are accepted. Please read them before placing an order."
        crumbs={[{ label: "Terms" }]}
      />
      <div className="shell">
        <PolicyBody
          updated="November 2026"
          intro="By using this website or placing an order, you agree to these terms. They are written to match how this storefront actually operates; they do not replace any written quotation or contract agreed separately."
          sections={[
            {
              title: "About this storefront",
              content: (
                <p>
                  This is a demonstration storefront for Total Fire &amp; Safety
                  Solution. Product names, model numbers, prices, stock levels and
                  specifications shown here are sample data unless confirmed in
                  writing by our team. Manufacturer names and logos are used to
                  identify product lines; their appearance does not by itself
                  create a partnership, certification or endorsement claim.
                </p>
              ),
            },
            {
              title: "Accounts",
              content: (
                <p>
                  You are responsible for the accuracy of your account details and
                  for keeping your password confidential. Public registration
                  creates customer accounts only. Admin access is never granted
                  through public sign-up.
                </p>
              ),
            },
            {
              title: "Products and availability",
              content: (
                <p>
                  Product descriptions and specifications are indicative. The
                  exact specification, standard and documentation for a product
                  should be confirmed with us before purchase. Stock is validated
                  on the server when an order is placed, but availability can still
                  change before dispatch. If an item cannot be supplied, we will
                  contact you to adjust or cancel the order.
                </p>
              ),
            },
            {
              title: "Pricing",
              content: (
                <p>
                  Prices are shown in Pakistani Rupees (PKR). Delivery is charged
                  at a flat PKR 250 below PKR 15,000 and is free at or above that
                  threshold, as described in the{" "}
                  <Link href="/shipping" className="text-white underline underline-offset-2">
                    shipping policy
                  </Link>
                  . Obvious pricing or typographical errors do not oblige us to
                  supply at the incorrect price; we will contact you before
                  proceeding.
                </p>
              ),
            },
            {
              title: "Orders and acceptance",
              content: (
                <p>
                  Submitting checkout creates an order request with a Pending
                  status; it does not by itself guarantee supply. An order is
                  accepted when our team confirms stock and delivery with you.
                  Order numbers are unique and should be quoted in all
                  correspondence. We may decline or cancel an order where stock is
                  unavailable, the delivery address is outside our service area,
                  or we suspect fraudulent activity.
                </p>
              ),
            },
            {
              title: "Payment",
              content: (
                <p>
                  We accept cash on delivery and bank transfer. No card details
                  are collected on this site. For bank transfers, use only account
                  details issued by our team with your order confirmation. An
                  order is not treated as paid until the payment is verified; the
                  website never marks an order paid automatically.
                </p>
              ),
            },
            {
              title: "Delivery",
              content: (
                <p>
                  Delivery arrangements and timing are confirmed with you after the
                  order. Risk passes on handover. Inspect goods at delivery where
                  possible and report shortages or damage promptly as set out in
                  the{" "}
                  <Link href="/returns" className="text-white underline underline-offset-2">
                    returns policy
                  </Link>
                  .
                </p>
              ),
            },
            {
              title: "Intellectual property",
              content: (
                <p>
                  The site design, text and original imagery are used by Total Fire
                  &amp; Safety Solution. Manufacturer names, logos and product
                  imagery remain the property of their respective owners and are
                  used for identification.
                </p>
              ),
            },
            {
              title: "Liability",
              content: (
                <p>
                  Nothing in these terms excludes liability that cannot lawfully be
                  excluded. Subject to that, we are not liable for indirect or
                  consequential loss arising from use of this website. Safety
                  equipment must be selected, inspected and used in accordance with
                  the manufacturer&apos;s instructions and a competent site risk
                  assessment.
                </p>
              ),
            },
            {
              title: "Governing law and contact",
              content: (
                <p>
                  These terms are governed by the laws of Pakistan, with courts in
                  Karachi having jurisdiction. Questions:{" "}
                  <a href="mailto:info@totalfirensafety.com" className="text-white underline underline-offset-2">
                    info@totalfirensafety.com
                  </a>{" "}
                  or +92-21-32434289.
                </p>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
