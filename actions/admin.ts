"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  bannerSchema,
  brandSchema,
  categorySchema,
  fieldErrors,
  inventorySchema,
  orderStatusSchema,
  paymentStatusSchema,
  productSchema,
  settingsSchema,
} from "@/lib/validation";
import { slugify } from "@/lib/utils";
import { saveImage, saveModel, UploadError } from "@/lib/upload";

function back(
  formData: FormData,
  fallback: string,
  message: string,
  tone: "saved" | "error" = "saved"
): never {
  const raw = String(formData.get("returnTo") ?? "");
  const base =
    raw.startsWith("/admin") && !raw.startsWith("//")
      ? raw.split("?")[0]
      : fallback;
  redirect(`${base}?${tone}=${encodeURIComponent(message)}`);
}

function firstError(errors: Record<string, string>) {
  return Object.values(errors)[0] ?? "Check the form and try again.";
}

function errorMessage(error: unknown) {
  if (error instanceof UploadError) return error.message;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return "That slug, SKU or email is already in use.";
    if (error.code === "P2003") return "A linked record no longer exists.";
  }
  console.error("Admin action failed", error);
  return "The change could not be saved. Please try again.";
}

async function uniqueSlug(
  kind: "product" | "category" | "brand",
  base: string,
  excludeId?: string
) {
  const clean = slugify(base) || "item";
  let candidate = clean;
  let counter = 2;
  for (;;) {
    const where = {
      slug: candidate,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    };
    const existing =
      kind === "product"
        ? await prisma.product.findFirst({ where, select: { id: true } })
        : kind === "category"
          ? await prisma.category.findFirst({ where, select: { id: true } })
          : await prisma.brand.findFirst({ where, select: { id: true } });
    if (!existing) return candidate;
    candidate = `${clean}-${counter++}`;
  }
}

function parseSpecs(text: string | undefined) {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const index = line.indexOf(":");
      if (index === -1) return { label: "Specification", value: line };
      return {
        label: line.slice(0, index).trim(),
        value: line.slice(index + 1).trim(),
      };
    })
    .filter((spec) => spec.label && spec.value)
    .slice(0, 40);
}

function parseImages(text: string | undefined) {
  if (!text) return [];
  return Array.from(
    new Set(
      text
        .split(/[\r\n,]+/)
        .map((line) => line.trim())
        .filter(
          (line) =>
            line.startsWith("/") ||
            line.startsWith("https://") ||
            line.startsWith("http://")
        )
    )
  ).slice(0, 8);
}

function refreshProduct(slug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  if (slug) revalidatePath(`/product/${slug}`);
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") ?? "");
  const fallback = productId ? `/admin/products/${productId}` : "/admin/products";

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    slug: formData.get("slug") || undefined,
    categoryId: formData.get("categoryId"),
    brandId: formData.get("brandId") || undefined,
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    specsText: formData.get("specsText") || undefined,
    imagesText: formData.get("imagesText") || undefined,
    modelUrl: formData.get("modelUrl") || undefined,
    price: formData.get("price"),
    salePrice: formData.get("salePrice") || "",
    stock: formData.get("stock"),
    lowStockThreshold: formData.get("lowStockThreshold") || 5,
    isFeatured: formData.get("isFeatured") === "on",
    isActive: formData.get("isActive") === "on",
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
  });
  if (!parsed.success) back(formData, fallback, firstError(fieldErrors(parsed.error)), "error");
  const data = parsed.data;

  const salePrice =
    typeof data.salePrice === "number" ? data.salePrice : null;
  if (salePrice !== null && salePrice >= data.price) {
    back(formData, fallback, "Sale price must be lower than the regular price.", "error");
  }

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
    select: { id: true },
  });
  if (!category) back(formData, fallback, "Choose a valid category.", "error");

  let uploadedImage: string | null = null;
  let uploadedModel: string | null = null;
  try {
    uploadedImage = await saveImage(formData.get("imageFile"), "products");
    uploadedModel = await saveModel(formData.get("modelFile"));
  } catch (error) {
    back(formData, fallback, errorMessage(error), "error");
  }

  const images = [...(uploadedImage ? [uploadedImage] : []), ...parseImages(data.imagesText)];
  const modelUrl = uploadedModel ?? data.modelUrl ?? null;
  const slug = await uniqueSlug(
    "product",
    data.slug || data.name,
    productId || undefined
  );

  const base = {
    name: data.name,
    sku: data.sku.toUpperCase(),
    slug,
    categoryId: data.categoryId,
    brandId: data.brandId || null,
    shortDescription: data.shortDescription,
    description: data.description,
    specs: parseSpecs(data.specsText),
    modelUrl,
    price: data.price,
    salePrice,
    stock: data.stock,
    lowStockThreshold: data.lowStockThreshold,
    isFeatured: Boolean(data.isFeatured),
    isActive: Boolean(data.isActive),
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
  };

  let createdId: string | null = null;
  try {
    if (productId) {
      await prisma.$transaction(async (tx) => {
        const existing = await tx.product.findUnique({
          where: { id: productId },
          select: { id: true },
        });
        if (!existing) throw new Error("Product not found");
        await tx.product.update({ where: { id: productId }, data: base });
        await tx.productImage.deleteMany({ where: { productId } });
        if (images.length) {
          await tx.productImage.createMany({
            data: images.map((url, index) => ({
              productId,
              url,
              alt: data.name,
              sortOrder: index,
            })),
          });
        }
      });
    } else {
      const created = await prisma.product.create({
        data: {
          ...base,
          images: {
            create: images.map((url, index) => ({
              url,
              alt: data.name,
              sortOrder: index,
            })),
          },
        },
        select: { id: true },
      });
      createdId = created.id;
    }
  } catch (error) {
    back(formData, fallback, errorMessage(error), "error");
  }

  refreshProduct(slug);
  back(
    formData,
    createdId ? `/admin/products/${createdId}` : fallback,
    createdId ? "Product created." : "Product saved."
  );
}

export async function toggleProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("productId") ?? "");
  const product = await prisma.product.findUnique({
    where: { id },
    select: { isActive: true, slug: true },
  });
  if (!product) back(formData, "/admin/products", "Product not found.", "error");
  await prisma.product.update({
    where: { id },
    data: { isActive: !product.isActive },
  });
  refreshProduct(product.slug);
  back(formData, "/admin/products", product.isActive ? "Product archived." : "Product published.");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("productId") ?? "");
  const [product, orderCount] = await Promise.all([
    prisma.product.findUnique({ where: { id }, select: { slug: true, name: true } }),
    prisma.orderItem.count({ where: { productId: id } }),
  ]);
  if (!product) back(formData, "/admin/products", "Product not found.", "error");
  if (orderCount > 0) {
    back(
      formData,
      "/admin/products",
      "This product has order history. Archive it instead of deleting.",
      "error"
    );
  }
  await prisma.product.delete({ where: { id } });
  refreshProduct();
  back(formData, "/admin/products", "Product deleted.");
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("categoryId") ?? "");
  const fallback = "/admin/categories";
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) back(formData, fallback, firstError(fieldErrors(parsed.error)), "error");
  const data = parsed.data;

  let uploaded: string | null = null;
  try {
    uploaded = await saveImage(formData.get("imageFile"), "products");
  } catch (error) {
    back(formData, fallback, errorMessage(error), "error");
  }

  const slug = await uniqueSlug("category", data.slug || data.name, id || undefined);
  const payload = {
    name: data.name,
    slug,
    description: data.description ?? null,
    imageUrl: uploaded ?? data.imageUrl ?? null,
    sortOrder: data.sortOrder,
    isActive: Boolean(data.isActive),
  };

  try {
    if (id) await prisma.category.update({ where: { id }, data: payload });
    else await prisma.category.create({ data: payload });
  } catch (error) {
    back(formData, fallback, errorMessage(error), "error");
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/categories");
  back(formData, fallback, id ? "Category saved." : "Category created.");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("categoryId") ?? "");
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    back(formData, "/admin/categories", "Move products out of this category first.", "error");
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/categories");
  back(formData, "/admin/categories", "Category deleted.");
}

export async function saveBrandAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("brandId") ?? "");
  const fallback = "/admin/brands";
  const parsed = brandSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
    description: formData.get("description") || undefined,
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) back(formData, fallback, firstError(fieldErrors(parsed.error)), "error");
  const data = parsed.data;

  let uploaded: string | null = null;
  try {
    uploaded = await saveImage(formData.get("logoFile"), "brand");
  } catch (error) {
    back(formData, fallback, errorMessage(error), "error");
  }

  const slug = await uniqueSlug("brand", data.slug || data.name, id || undefined);
  const payload = {
    name: data.name,
    slug,
    logoUrl: uploaded ?? data.logoUrl ?? null,
    description: data.description ?? null,
    isActive: Boolean(data.isActive),
  };

  try {
    if (id) await prisma.brand.update({ where: { id }, data: payload });
    else await prisma.brand.create({ data: payload });
  } catch (error) {
    back(formData, fallback, errorMessage(error), "error");
  }

  revalidatePath("/");
  revalidatePath("/brands");
  revalidatePath("/admin/brands");
  back(formData, fallback, id ? "Manufacturer saved." : "Manufacturer created.");
}

export async function deleteBrandAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("brandId") ?? "");
  const count = await prisma.product.count({ where: { brandId: id } });
  if (count > 0) {
    back(formData, "/admin/brands", "Reassign this manufacturer's products first.", "error");
  }
  await prisma.brand.delete({ where: { id } });
  revalidatePath("/admin/brands");
  back(formData, "/admin/brands", "Manufacturer deleted.");
}

export async function saveBannerAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("bannerId") ?? "");
  const fallback = "/admin/banners";
  const parsed = bannerSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || undefined,
    imageUrl: formData.get("imageUrl") || "",
    href: formData.get("href") || undefined,
    ctaLabel: formData.get("ctaLabel") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) back(formData, fallback, firstError(fieldErrors(parsed.error)), "error");
  const data = parsed.data;

  let uploaded: string | null = null;
  try {
    uploaded = await saveImage(formData.get("imageFile"), "banners");
  } catch (error) {
    back(formData, fallback, errorMessage(error), "error");
  }
  const imageUrl = uploaded || data.imageUrl || "";
  if (!imageUrl) back(formData, fallback, "Upload a slider image or enter an image URL.", "error");

  if (data.href && !data.href.startsWith("/")) {
    back(formData, fallback, "Slide links must be internal paths starting with /.", "error");
  }

  const payload = {
    title: data.title,
    subtitle: data.subtitle ?? null,
    imageUrl,
    href: data.href ?? null,
    ctaLabel: data.ctaLabel ?? null,
    sortOrder: data.sortOrder,
    isActive: Boolean(data.isActive),
  };

  try {
    if (id) await prisma.banner.update({ where: { id }, data: payload });
    else await prisma.banner.create({ data: payload });
  } catch (error) {
    back(formData, fallback, errorMessage(error), "error");
  }

  revalidatePath("/");
  revalidatePath("/admin/banners");
  back(formData, fallback, id ? "Slide saved." : "Slide created.");
}

export async function deleteBannerAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("bannerId") ?? "");
  await prisma.banner.delete({ where: { id } }).catch(() => undefined);
  revalidatePath("/");
  revalidatePath("/admin/banners");
  back(formData, "/admin/banners", "Slide deleted.");
}

export async function adjustInventoryAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = inventorySchema.safeParse({
    productId: formData.get("productId"),
    delta: formData.get("delta"),
    reason: formData.get("reason"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) back(formData, "/admin/inventory", firstError(fieldErrors(parsed.error)), "error");

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
    select: { id: true, name: true, stock: true, slug: true },
  });
  if (!product) back(formData, "/admin/inventory", "Product not found.", "error");
  if (product.stock + parsed.data.delta < 0) {
    back(formData, "/admin/inventory", "Adjustment would make stock negative.", "error");
  }

  await prisma.$transaction([
    prisma.product.update({
      where: { id: product.id },
      data: { stock: { increment: parsed.data.delta } },
    }),
    prisma.inventoryMovement.create({
      data: {
        productId: product.id,
        delta: parsed.data.delta,
        reason: parsed.data.reason,
        note: parsed.data.note ?? null,
        createdById: admin.id,
      },
    }),
  ]);

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${product.slug}`);
  back(
    formData,
    "/admin/inventory",
    `Stock updated for ${product.name}.`
  );
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const parsed = orderStatusSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
  });
  if (!parsed.success) back(formData, "/admin/orders", "Choose a valid status.", "error");

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { items: { select: { productId: true, quantity: true, name: true } } },
  });
  if (!order) back(formData, "/admin/orders", "Order not found.", "error");
  if (order.status === parsed.data.status) {
    back(formData, `/admin/orders/${order.orderNumber}`, "Status unchanged.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (parsed.data.status === "CANCELLED" && order.status !== "CANCELLED") {
        for (const item of order.items) {
          if (!item.productId) continue;
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
          await tx.inventoryMovement.create({
            data: {
              productId: item.productId,
              delta: item.quantity,
              reason: `Order cancelled — ${order.orderNumber}`,
              orderId: order.id,
            },
          });
        }
      }

      if (order.status === "CANCELLED" && parsed.data.status !== "CANCELLED") {
        for (const item of order.items) {
          if (!item.productId) continue;
          const updated = await tx.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (updated.count !== 1) {
            throw new Error(
              `Insufficient stock to reopen “${item.name}”. Adjust inventory first.`
            );
          }
          await tx.inventoryMovement.create({
            data: {
              productId: item.productId,
              delta: -item.quantity,
              reason: `Order reopened — ${order.orderNumber}`,
              orderId: order.id,
            },
          });
        }
      }

      await tx.order.update({
        where: { id: order.id },
        data: { status: parsed.data.status },
      });
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The status could not be updated.";
    back(formData, `/admin/orders/${order.orderNumber}`, message, "error");
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${order.orderNumber}`);
  back(formData, `/admin/orders/${order.orderNumber}`, "Order status updated.");
}

export async function updatePaymentAction(formData: FormData) {
  await requireAdmin();
  const parsed = paymentStatusSchema.safeParse({
    orderId: formData.get("orderId"),
    paymentStatus: formData.get("paymentStatus"),
    reference: formData.get("reference") || undefined,
  });
  if (!parsed.success) back(formData, "/admin/orders", "Choose a valid payment status.", "error");

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    select: { id: true, orderNumber: true, total: true, paymentMethod: true },
  });
  if (!order) back(formData, "/admin/orders", "Order not found.", "error");

  await prisma.$transaction([
    prisma.payment.upsert({
      where: { orderId: order.id },
      update: {
        status: parsed.data.paymentStatus,
        reference: parsed.data.reference ?? null,
      },
      create: {
        orderId: order.id,
        method: order.paymentMethod,
        status: parsed.data.paymentStatus,
        amount: order.total,
        reference: parsed.data.reference ?? null,
      },
    }),
    prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: parsed.data.paymentStatus },
    }),
  ]);

  revalidatePath(`/admin/orders/${order.orderNumber}`);
  revalidatePath("/admin/orders");
  back(
    formData,
    `/admin/orders/${order.orderNumber}`,
    `Payment marked ${parsed.data.paymentStatus.toLowerCase()}.`
  );
}

export async function updateInquiryStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("inquiryId") ?? "");
  const status = String(formData.get("status") ?? "");
  const allowed = ["NEW", "READ", "RESPONDED", "CLOSED"];
  if (!allowed.includes(status)) back(formData, "/admin/inquiries", "Invalid status.", "error");
  await prisma.inquiry.update({
    where: { id },
    data: { status: status as "NEW" | "READ" | "RESPONDED" | "CLOSED" },
  });
  revalidatePath("/admin/inquiries");
  back(formData, "/admin/inquiries", "Inquiry updated.");
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const fallback = "/admin/settings";
  const parsed = settingsSchema.safeParse({
    companyName: formData.get("companyName"),
    tagline: formData.get("tagline") || undefined,
    phone: formData.get("phone"),
    phoneAlt: formData.get("phoneAlt") || undefined,
    email: formData.get("email"),
    address: formData.get("address"),
    safelinkAddress: formData.get("safelinkAddress") || undefined,
    mapEmbedUrl: formData.get("mapEmbedUrl") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
    ownerImageUrl: formData.get("ownerImageUrl") || undefined,
    announcement: formData.get("announcement") || undefined,
  });
  if (!parsed.success) back(formData, fallback, firstError(fieldErrors(parsed.error)), "error");
  const data = parsed.data;

  if (
    data.mapEmbedUrl &&
    !/^https:\/\/(www\.)?(google\.[a-z.]+|maps\.google\.[a-z.]+)\//.test(data.mapEmbedUrl)
  ) {
    back(formData, fallback, "Map embed must be a Google Maps https:// embed URL.", "error");
  }

  let uploadedLogo: string | null = null;
  let uploadedOwner: string | null = null;
  try {
    uploadedLogo = await saveImage(formData.get("logoFile"), "brand");
    uploadedOwner = await saveImage(formData.get("ownerFile"), "company");
  } catch (error) {
    back(formData, fallback, errorMessage(error), "error");
  }

  const payload = {
    companyName: data.companyName,
    tagline: data.tagline || "Protect • Prevent • Perform",
    phone: data.phone,
    phoneAlt: data.phoneAlt || "+92-21-32419200",
    email: data.email,
    address: data.address,
    safelinkAddress:
      data.safelinkAddress ||
      "Shop # 5-A, 1st Floor, Adnan Center, Nicol Road, Karachi",
    mapEmbedUrl: data.mapEmbedUrl ?? null,
    logoUrl: uploadedLogo || data.logoUrl || "/brand/logo-emblem-mono.png",
    ownerImageUrl: uploadedOwner ?? data.ownerImageUrl ?? null,
    announcement: data.announcement ?? null,
  };

  try {
    await prisma.companySettings.upsert({
      where: { id: "main" },
      update: payload,
      create: { id: "main", ...payload },
    });
  } catch (error) {
    back(formData, fallback, errorMessage(error), "error");
  }

  revalidatePath("/", "layout");
  back(formData, fallback, "Company settings saved.");
}
