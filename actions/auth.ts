"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  cleanupExpiredSessions,
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { mergeGuestCart } from "@/lib/cart";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { fieldErrors, loginSchema, registerSchema } from "@/lib/validation";
import { safeNextPath } from "@/lib/utils";

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function loginAction(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const ip = await clientIp();
  const limit = rateLimit(`login:${ip}:${parsed.data.email}`, 10, 15 * 60_000);
  if (!limit.ok) {
    return {
      error: `Too many attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} minute(s).`,
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  const valid = user
    ? await verifyPassword(parsed.data.password, user.passwordHash)
    : false;

  if (!user || !valid) {
    return { error: "Email or password is incorrect." };
  }

  const h = await headers();
  await createSession(user.id, h.get("user-agent"));
  await mergeGuestCart(user.id);
  await cleanupExpiredSessions();
  revalidatePath("/", "layout");

  redirect(safeNextPath(parsed.data.next) ?? "/account");
}

export async function registerAction(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const ip = await clientIp();
  const limit = rateLimit(`register:${ip}`, 5, 60 * 60_000);
  if (!limit.ok) {
    return { error: "Too many registration attempts. Please try again later." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });
  if (existing) {
    return {
      fieldErrors: { email: "An account with this email already exists." },
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user
    .create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        passwordHash,
        role: "CUSTOMER",
      },
    })
    .catch((error: unknown) => {
      // A concurrent signup can pass the check above; the unique index is the
      // authority, so translate its violation back into a field error.
      if ((error as { code?: unknown }).code === "P2002") return null;
      throw error;
    });

  if (!user) {
    return {
      fieldErrors: { email: "An account with this email already exists." },
    };
  }

  const h = await headers();
  await createSession(user.id, h.get("user-agent"));
  await mergeGuestCart(user.id);
  revalidatePath("/", "layout");
  redirect("/account");
}

export async function logoutAction() {
  await destroySession();
  revalidatePath("/", "layout");
  redirect("/");
}
