"use server";

import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { fieldErrors, inquirySchema } from "@/lib/validation";

export type InquiryState = {
  ok?: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function sendInquiryAction(
  _prev: InquiryState | undefined,
  formData: FormData
): Promise<InquiryState> {
  const parsed = inquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company") || "",
    message: formData.get("message"),
    productId: formData.get("productId") || "",
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const ip = await clientIp();
  const limit = rateLimit(`inquiry:${ip}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return { error: "You have sent several inquiries. Please try again shortly." };
  }

  let productId: string | null = null;
  if (parsed.data.productId) {
    const product = await prisma.product.findUnique({
      where: { id: parsed.data.productId },
      select: { id: true },
    });
    productId = product?.id ?? null;
  }

  await prisma.inquiry.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company || null,
      message: parsed.data.message,
      productId,
    },
  });

  return {
    ok: true,
    message:
      "Thank you. Your inquiry has been recorded and our team will contact you during business hours.",
  };
}
