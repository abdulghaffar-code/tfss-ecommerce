import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Create a customer account",
  description: "Create a customer account for order tracking and saved equipment.",
  path: "/register",
  noIndex: true,
});

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <AuthShell
      eyebrow="Create an account"
      title="Keep the kit list together."
      subtitle="Save addresses, reorder everyday lines and keep a record of past orders. Customer accounts only — admin access is never granted through public registration."
      image="/hero/slider-04.webp"
      imageAlt="Industrial safety gloves"
      footer={
        <span>
          Prefer to order without an account? Guest checkout is available.
        </span>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
