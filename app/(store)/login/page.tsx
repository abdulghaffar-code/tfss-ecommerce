import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";
import { safeNextPath } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Sign in",
  description: "Sign in to your Total Fire & Safety Solution account.",
  path: "/login",
  noIndex: true,
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getCurrentUser();
  const destination = safeNextPath(next);
  if (user) redirect(destination ?? "/account");

  return (
    <AuthShell
      eyebrow="Customer account"
      title="Welcome back."
      subtitle="Access order history, saved addresses and your wishlist. Guest carts merge automatically when you sign in."
      footer={
        <span>
          Need help with an existing order?{" "}
          <a href="mailto:info@totalfirensafety.com" className="text-steel-300 underline underline-offset-2">
            Contact the counter
          </a>
          .
        </span>
      }
    >
      <LoginForm next={destination ?? undefined} />
    </AuthShell>
  );
}
