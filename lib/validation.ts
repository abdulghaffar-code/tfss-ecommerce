import { z } from "zod";

const email = z
  .string()
  .trim()
  .min(3)
  .max(254)
  .email("Enter a valid email address")
  .transform((v) => v.toLowerCase());

const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(24, "Phone number is too long")
  .regex(/^[0-9+()\-\s]+$/, "Phone can only contain digits and + - ( )");

const password = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(72, "Password is too long");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email,
  phone: phone.optional().or(z.literal("")),
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password").max(72),
  next: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: phone.optional().or(z.literal("")),
});

export const addressSchema = z.object({
  label: z.string().trim().min(2).max(40).default("Shipping"),
  fullName: z.string().trim().min(2).max(80),
  phone,
  line1: z.string().trim().min(5).max(180),
  line2: z.string().trim().max(180).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(80),
  postalCode: z
    .string()
    .trim()
    .max(12)
    .optional()
    .or(z.literal("")),
  isDefault: z.boolean().optional().default(false),
});

export const cartAddSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(99).default(1),
});

export const cartUpdateSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Enter the full name").max(80),
  customerEmail: email,
  customerPhone: phone,
  addressLine: z.string().trim().min(8, "Enter a complete address").max(220),
  city: z.string().trim().min(2, "Enter a city").max(80),
  postalCode: z.string().trim().max(12).optional().or(z.literal("")),
  notes: z.string().trim().max(600).optional().or(z.literal("")),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER"]),
  acceptTerms: z.literal("on", {
    errorMap: () => ({ message: "Please accept the terms to place the order" }),
  }),
});

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email,
  phone,
  company: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us what you need").max(2000),
  productId: z.string().optional().or(z.literal("")),
});

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined));

export const productSchema = z.object({
  name: z.string().trim().min(3, "Name is required").max(160),
  sku: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(/^[A-Za-z0-9._-]+$/, "SKU can use letters, numbers, dot, dash, underscore"),
  slug: optionalText(120),
  categoryId: z.string().min(1, "Choose a category"),
  brandId: optionalText(60),
  shortDescription: z.string().trim().min(10).max(300),
  description: z.string().trim().min(20).max(8000),
  specsText: optionalText(4000),
  imagesText: optionalText(4000),
  modelUrl: optionalText(500),
  price: z.coerce.number().positive("Price must be greater than zero").max(10_000_000),
  salePrice: z
    .union([z.coerce.number().positive().max(10_000_000), z.literal("")])
    .optional(),
  stock: z.coerce.number().int().min(0).max(1_000_000),
  lowStockThreshold: z.coerce.number().int().min(0).max(10_000).default(5),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  seoTitle: optionalText(160),
  seoDescription: optionalText(300),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: optionalText(100),
  description: optionalText(500),
  imageUrl: optionalText(500),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  isActive: z.boolean().optional().default(true),
});

export const brandSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: optionalText(100),
  logoUrl: optionalText(500),
  description: optionalText(500),
  isActive: z.boolean().optional().default(true),
});

export const bannerSchema = z.object({
  title: z.string().trim().min(2).max(140),
  subtitle: optionalText(300),
  imageUrl: z.string().trim().max(500).optional().or(z.literal("")),
  href: optionalText(300),
  ctaLabel: optionalText(60),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  isActive: z.boolean().optional().default(true),
});

export const settingsSchema = z.object({
  companyName: z.string().trim().min(2).max(120),
  tagline: optionalText(160),
  phone: z.string().trim().min(5).max(40),
  phoneAlt: optionalText(40),
  email: z.string().trim().email(),
  address: z.string().trim().min(10).max(300),
  safelinkAddress: optionalText(300),
  mapEmbedUrl: optionalText(1000),
  logoUrl: optionalText(500),
  ownerImageUrl: optionalText(500),
  announcement: optionalText(300),
});

export const inventorySchema = z.object({
  productId: z.string().min(1),
  delta: z.coerce.number().int().min(-100000).max(100000).refine((v) => v !== 0, {
    message: "Enter a non-zero adjustment",
  }),
  reason: z.string().trim().min(2).max(80),
  note: optionalText(300),
});

export const orderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export const paymentStatusSchema = z.object({
  orderId: z.string().min(1),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]),
  reference: optionalText(120),
});

export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
