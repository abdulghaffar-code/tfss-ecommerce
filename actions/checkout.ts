"use server";

import { randomBytes, randomInt } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { computeTotals } from "@/lib/order-math";
import { checkoutSchema, fieldErrors } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type CheckoutState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

class CheckoutError extends Error {}

function generateOrderNumber() {
  const now = new Date();
  const y = String(now.getFullYear()).slice(2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += alphabet[randomInt(alphabet.length)];
  return `TFSS-${y}${m}${d}-${suffix}`;
}

export async function placeOrderAction(
  _prev: CheckoutState | undefined,
  formData: FormData
): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse({
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    addressLine: formData.get("addressLine"),
    city: formData.get("city"),
    postalCode: formData.get("postalCode") || "",
    notes: formData.get("notes") || "",
    paymentMethod: formData.get("paymentMethod"),
    acceptTerms: formData.get("acceptTerms"),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const ip = await clientIp();
  const limit = rateLimit(`checkout:${ip}`, 12, 10 * 60_000);
  if (!limit.ok) {
    return { error: "Too many checkout attempts. Please wait and try again." };
  }

  const user = await getCurrentUser();
  const cart = await getCart(user);
  if (!cart || cart.items.length === 0) {
    return { error: "Your cart is empty." };
  }
  if (cart.hasIssues) {
    return {
      error:
        "Some items in your cart are unavailable. Please update quantities before checking out.",
    };
  }

  const input = parsed.data;
  const publicToken = randomBytes(24).toString("base64url");
  let orderNumber = generateOrderNumber();
  let redirectToken = publicToken;
  let createdNumber: string | null = null;

  for (let attempt = 0; attempt < 3 && !createdNumber; attempt++) {
    try {
      const created = await prisma.$transaction(
        async (tx) => {
          const freshCart = await tx.cart.findUnique({
            where: { id: cart.id },
            include: {
              items: {
                include: {
                  product: {
                    select: {
                      id: true,
                      name: true,
                      sku: true,
                      price: true,
                      salePrice: true,
                      stock: true,
                      isActive: true,
                    },
                  },
                },
              },
            },
          });

          if (!freshCart || freshCart.items.length === 0) {
            throw new CheckoutError("Your cart is empty.");
          }

          const lines: { unitPrice: number; quantity: number }[] = [];

          for (const item of freshCart.items) {
            const p = item.product;
            if (!p.isActive) {
              throw new CheckoutError(
                `“${p.name}” is no longer available. Please remove it from your cart.`
              );
            }
            if (item.quantity < 1) {
              throw new CheckoutError("Please review the quantities in your cart.");
            }
            const updated = await tx.product.updateMany({
              where: { id: p.id, stock: { gte: item.quantity } },
              data: { stock: { decrement: item.quantity } },
            });
            if (updated.count !== 1) {
              throw new CheckoutError(
                `Insufficient stock for “${p.name}”. Please reduce the quantity.`
              );
            }
            lines.push({
              unitPrice: Number(p.salePrice ?? p.price),
              quantity: item.quantity,
            });
          }

          const totals = computeTotals(lines);

          const order = await tx.order.create({
            data: {
              orderNumber,
              publicToken,
              userId: user?.id ?? null,
              status: "PENDING",
              paymentStatus: "PENDING",
              paymentMethod: input.paymentMethod,
              subtotal: totals.subtotal,
              discount: totals.discount,
              shipping: totals.shipping,
              total: totals.total,
              customerName: input.customerName,
              customerEmail: input.customerEmail,
              customerPhone: input.customerPhone,
              addressLine: input.addressLine,
              city: input.city,
              postalCode: input.postalCode || null,
              notes: input.notes || null,
            },
          });

          await tx.orderItem.createMany({
            data: freshCart.items.map((item, index) => ({
              orderId: order.id,
              productId: item.productId,
              name: item.product.name,
              sku: item.product.sku,
              unitPrice: lines[index].unitPrice,
              quantity: item.quantity,
              lineTotal: Math.round(lines[index].unitPrice * item.quantity * 100) / 100,
            })),
          });

          await tx.payment.create({
            data: {
              orderId: order.id,
              method: input.paymentMethod,
              status: "PENDING",
              amount: totals.total,
            },
          });

          await tx.inventoryMovement.createMany({
            data: freshCart.items.map((item) => ({
              productId: item.productId,
              delta: -item.quantity,
              reason: `Sale — order ${order.orderNumber}`,
              orderId: order.id,
            })),
          });

          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

          return order;
        },
        { isolationLevel: "Serializable", maxWait: 5_000, timeout: 20_000 }
      );

      createdNumber = created.orderNumber;
      redirectToken = created.publicToken;
      revalidatePath("/cart");
      revalidatePath("/admin/orders");
    } catch (error) {
      if (error instanceof CheckoutError) {
        return { error: error.message };
      }
      const code =
        typeof error === "object" && error && "code" in error
          ? String((error as { code?: string }).code)
          : "";
      if (code === "P2002") {
        orderNumber = generateOrderNumber();
        continue;
      }
      console.error("Checkout failed", error);
      return {
        error:
          "We could not place your order. No payment has been taken. Please try again.",
      };
    }
  }

  if (!createdNumber) {
    return { error: "Could not generate an order number. Please try again." };
  }

  redirect(
    `/checkout/success/${createdNumber}?token=${encodeURIComponent(redirectToken)}`
  );
}
