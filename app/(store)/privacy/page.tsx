import { PageHero } from "@/components/layout/PageHero";
import { PolicyBody } from "@/components/layout/PolicyBody";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description:
    "How Total Fire & Safety Solution handles customer account, order and inquiry information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy."
        description="What we collect, why we collect it and how to ask us about it. This policy describes the current implementation of this storefront."
        crumbs={[{ label: "Privacy" }]}
      />
      <div className="shell">
        <PolicyBody
          updated="November 2026"
          intro="Total Fire & Safety Solution uses customer information to run accounts, fulfil orders and respond to inquiries. We do not sell customer data. This page explains the data the storefront actually handles."
          sections={[
            {
              title: "Who we are",
              content: (
                <>
                  <p>
                    Total Fire &amp; Safety Solution, Shop # 1-B, Adnan Center,
                    Ground Floor, Nicol Road, Karachi, Pakistan. Email{" "}
                    <a href="mailto:info@totalfirensafety.com" className="text-white underline underline-offset-2">
                      info@totalfirensafety.com
                    </a>
                    , phone +92-21-32434289.
                  </p>
                </>
              ),
            },
            {
              title: "Information we collect",
              content: (
                <ul className="list-disc space-y-2 pl-5">
                  <li>Account details: name, email, phone and a hashed password.</li>
                  <li>Delivery addresses you choose to save.</li>
                  <li>Order details: items, quantities, prices, delivery address, order notes and payment method.</li>
                  <li>Inquiry details: name, email, phone, company and message.</li>
                  <li>Technical data needed to keep you signed in and keep a guest cart, stored in cookies.</li>
                </ul>
              ),
            },
            {
              title: "Card and bank data",
              content: (
                <p>
                  This storefront does not collect or store card numbers, CVV
                  codes or online banking credentials. Payment is offered as cash
                  on delivery or bank transfer, with bank details issued
                  separately after an order is confirmed. Payment status is
                  recorded manually after verification.
                </p>
              ),
            },
            {
              title: "Cookies",
              content: (
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong className="text-white">tfss_session</strong> — an
                    httpOnly session cookie, valid for up to 30 days, used to keep
                    you signed in. The database stores only a hash of the token.
                  </li>
                  <li>
                    <strong className="text-white">tfss_cart</strong> — an
                    httpOnly guest cart identifier, valid for up to 30 days, used
                    to preserve a cart before sign-in. It is removed when the guest
                    cart is merged into an account.
                  </li>
                  <li>
                    We do not currently run advertising or third-party analytics
                    cookies on this storefront.
                  </li>
                </ul>
              ),
            },
            {
              title: "How we use information",
              content: (
                <p>
                  To create and secure accounts, process and deliver orders,
                  respond to inquiries, prevent abuse, maintain inventory records
                  and meet accounting or legal obligations. We do not use order
                  data for unrelated marketing.
                </p>
              ),
            },
            {
              title: "Sharing",
              content: (
                <p>
                  Information is shared only as needed to run the service: with
                  the database and hosting infrastructure that operate the site,
                  and with delivery or logistics partners when an order is
                  dispatched. We do not sell or rent personal data.
                </p>
              ),
            },
            {
              title: "Retention and security",
              content: (
                <p>
                  Passwords are hashed with bcrypt. Session tokens are stored as
                  SHA-256 hashes, and access to account and admin areas is checked
                  on the server. Order records may be retained for accounting and
                  dispute handling. Expired sessions are cleaned up periodically.
                </p>
              ),
            },
            {
              title: "Your choices",
              content: (
                <p>
                  You can update your name, phone and addresses from your account.
                  To request access, correction or deletion of other data, contact
                  us with the email address on the account. Some order records may
                  need to be retained for legal or accounting reasons.
                </p>
              ),
            },
            {
              title: "Changes",
              content: (
                <p>
                  If this policy changes materially, the updated version will be
                  published on this page with a new date.
                </p>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
