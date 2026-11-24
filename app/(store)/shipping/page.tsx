import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { PolicyBody } from "@/components/layout/PolicyBody";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shipping policy",
  description:
    "Delivery charges and arrangements for orders from Total Fire & Safety Solution, Karachi.",
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <>
      <PageHero
        eyebrow="Policies"
        title="Shipping & delivery."
        description="How orders leave the Nicol Road counter, what delivery costs and what happens after checkout."
        crumbs={[{ label: "Shipping" }]}
      />
      <div className="shell">
        <PolicyBody
          updated="November 2026"
          intro="Delivery is arranged after your order has been reviewed and confirmed by our team. The website calculates the delivery charge using the current flat-rate rule, but it does not promise a dispatch date by itself."
          sections={[
            {
              title: "Delivery charges",
              content: (
                <ul className="list-disc space-y-2 pl-5">
                  <li>Orders below PKR 15,000: flat delivery charge of PKR 250.</li>
                  <li>Orders of PKR 15,000 or more: free standard delivery.</li>
                  <li>
                    Bulky, palletised, hazardous or out-of-city consignments may
                    require a separate freight quotation. We will confirm this
                    before dispatch.
                  </li>
                </ul>
              ),
            },
            {
              title: "Where we deliver",
              content: (
                <p>
                  Standard delivery is offered in Karachi. Deliveries to other
                  cities can be arranged through a courier or freight service and
                  will be quoted separately. If your address is outside the
                  standard service area, our team will contact you before
                  accepting the order.
                </p>
              ),
            },
            {
              title: "Timing",
              content: (
                <p>
                  Delivery timing is confirmed by phone or email after the order is
                  reviewed. Timings depend on stock, the delivery area and the
                  carrier. We do not advertise a guaranteed same-day service.
                </p>
              ),
            },
            {
              title: "Counter collection",
              content: (
                <p>
                  Collection from Shop # 1-B, Adnan Center, Nicol Road, Karachi can
                  be arranged. Wait for confirmation that the order is ready before
                  travelling; some lines are sourced to order.
                </p>
              ),
            },
            {
              title: "Address and contact details",
              content: (
                <p>
                  Please give a complete address, a reachable phone number and any
                  site access instructions in the order notes. We may need to
                  contact you to confirm access before dispatch. Re-delivery
                  charges may apply where a delivery fails because the address or
                  contact details were incorrect.
                </p>
              ),
            },
            {
              title: "Receiving goods",
              content: (
                <p>
                  Check the number of packages and their condition at handover.
                  Note any visible damage with the rider and contact us promptly.
                  Keep the packaging until you have checked the contents. See the{" "}
                  <Link href="/returns" className="text-white underline underline-offset-2">
                    returns policy
                  </Link>{" "}
                  for the next step.
                </p>
              ),
            },
          ]}
          aside={
            <div className="rounded-xl border border-white/10 bg-ink-900 p-5">
              <p className="eyebrow">Delivery summary</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-steel-400">Below PKR 15,000</dt>
                  <dd className="text-white">PKR 250</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-steel-400">PKR 15,000+</dt>
                  <dd className="text-success">Free</dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-white/10 pt-3">
                  <dt className="text-steel-400">Area</dt>
                  <dd className="text-white">Karachi standard</dd>
                </div>
              </dl>
              <Link
                href="/contact"
                className="mt-4 inline-block text-xs font-semibold text-flame-400 hover:text-flame-300"
              >
                Ask about your area →
              </Link>
            </div>
          }
        />
      </div>
    </>
  );
}
