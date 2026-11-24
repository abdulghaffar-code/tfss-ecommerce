import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { PolicyBody } from "@/components/layout/PolicyBody";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Returns & exchanges",
  description:
    "How to report damaged, incorrect or unsuitable safety equipment supplied by Total Fire & Safety Solution.",
  path: "/returns",
});

export default function ReturnsPage() {
  return (
    <>
      <PageHero
        eyebrow="Policies"
        title="Returns & exchanges."
        description="Safety equipment is personal protective equipment. Returns need to be handled carefully so the next customer is not sold an opened or compromised item."
        crumbs={[{ label: "Returns" }]}
      />
      <div className="shell">
        <PolicyBody
          updated="November 2026"
          intro="If something is wrong with your supply, contact us quickly with the order number and photographs. We will assess the issue against the product and its packaging, then agree a replacement, credit or refund where appropriate. This policy does not reduce any rights you have under applicable law."
          sections={[
            {
              title: "Damaged, incorrect or defective goods",
              content: (
                <p>
                  Contact us within 3 working days of delivery (or collection) with
                  your order number, a description of the issue and photographs of
                  the item and packaging. Keep the goods and packaging available
                  for inspection. Where the fault is ours or the item arrived
                  damaged, we will arrange a replacement or refund and cover the
                  return cost.
                </p>
              ),
            },
            {
              title: "Unwanted or incorrectly ordered items",
              content: (
                <p>
                  Unused items in original, undamaged packaging may be considered
                  for return within 7 days of delivery, subject to inspection and
                  approval. The buyer is responsible for return delivery costs.
                  A restocking charge may apply where the item is a non-stock or
                  specially ordered line.
                </p>
              ),
            },
            {
              title: "Items we cannot normally accept back",
              content: (
                <ul className="list-disc space-y-2 pl-5">
                  <li>Used, worn, washed or contaminated PPE.</li>
                  <li>Opened hygiene-sensitive items such as respirators, earplugs or undergarments.</li>
                  <li>Cut-to-length, mixed, printed or specially sourced items.</li>
                  <li>Products whose packaging or labels have been removed or damaged.</li>
                </ul>
              ),
            },
            {
              title: "Exchanges",
              content: (
                <p>
                  Size or specification exchanges depend on stock. Tell us what you
                  need and we will confirm availability and any price difference
                  before proceeding. Safety footwear and clothing must be tried
                  indoors on a clean surface; outdoor wear marks the product as
                  used.
                </p>
              ),
            },
            {
              title: "Refunds",
              content: (
                <p>
                  Approved refunds are made to the original payment method. Cash on
                  delivery orders may be refunded by bank transfer or cash at the
                  counter. We will confirm the amount and method in writing. Bank
                  processing time is outside our control.
                </p>
              ),
            },
            {
              title: "How to start a return",
              content: (
                <p>
                  Email{" "}
                  <a href="mailto:info@totalfirensafety.com" className="text-white underline underline-offset-2">
                    info@totalfirensafety.com
                  </a>{" "}
                  or call +92-21-32434289 with the order number. Do not send goods
                  back without confirmation; we need to record the return and tell
                  you where to deliver it. See the{" "}
                  <Link href="/contact" className="text-white underline underline-offset-2">
                    contact page
                  </Link>{" "}
                  for addresses.
                </p>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
