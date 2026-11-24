"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  getCurrentUser,
  hashPassword,
  requireUser,
  verifyPassword,
} from "@/lib/auth";
import {
  addressSchema,
  fieldErrors,
  profileSchema,
} from "@/lib/validation";
import { z } from "zod";

export type AccountState = {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function updateProfileAction(
  _prev: AccountState | undefined,
  formData: FormData
): Promise<AccountState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in again." };

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") || "",
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
    },
  });
  revalidatePath("/account");
  return { ok: true, message: "Profile updated." };
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
      .string()
      .min(8, "Use at least 8 characters")
      .max(72)
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export async function changePasswordAction(
  _prev: AccountState | undefined,
  formData: FormData
): Promise<AccountState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in again." };

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const row = await prisma.user.findUnique({ where: { id: user.id } });
  if (!row) return { error: "Account not found." };

  const valid = await verifyPassword(parsed.data.currentPassword, row.passwordHash);
  if (!valid) {
    return { fieldErrors: { currentPassword: "Current password is incorrect." } };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });
  return { ok: true, message: "Password changed." };
}

export async function saveAddressAction(
  _prev: AccountState | undefined,
  formData: FormData
): Promise<AccountState> {
  const user = await requireUser("/account/addresses");

  const parsed = addressSchema.safeParse({
    label: formData.get("label") || "Shipping",
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    line1: formData.get("line1"),
    line2: formData.get("line2") || "",
    city: formData.get("city"),
    postalCode: formData.get("postalCode") || "",
    isDefault: formData.get("isDefault") === "on",
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const addressId = String(formData.get("addressId") ?? "");
  const data = {
    label: parsed.data.label,
    fullName: parsed.data.fullName,
    phone: parsed.data.phone,
    line1: parsed.data.line1,
    line2: parsed.data.line2 || null,
    city: parsed.data.city,
    postalCode: parsed.data.postalCode || null,
    isDefault: parsed.data.isDefault,
  };

  const existingCount = await prisma.address.count({ where: { userId: user.id } });
  const makeDefault = data.isDefault || existingCount === 0;

  await prisma.$transaction(async (tx) => {
    if (makeDefault) {
      await tx.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }
    if (addressId) {
      const owned = await tx.address.findFirst({
        where: { id: addressId, userId: user.id },
        select: { id: true },
      });
      if (!owned) throw new Error("Address not found");
      await tx.address.update({
        where: { id: addressId },
        data: { ...data, isDefault: makeDefault },
      });
    } else {
      await tx.address.create({
        data: { ...data, userId: user.id, isDefault: makeDefault },
      });
    }
  });

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return { ok: true, message: addressId ? "Address updated." : "Address added." };
}

export async function deleteAddressAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const addressId = String(formData.get("addressId") ?? "");
  if (!addressId) return;

  await prisma.$transaction(async (tx) => {
    const deleted = await tx.address.deleteMany({
      where: { id: addressId, userId: user.id },
    });
    if (deleted.count > 0) {
      const next = await tx.address.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
      });
      if (next && next.isDefault === false) {
        await tx.address.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }
  });

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
}
