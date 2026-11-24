import { describe, expect, it } from "vitest";
import {
  checkoutSchema,
  loginSchema,
  registerSchema,
} from "@/lib/validation";

describe("registerSchema", () => {
  it("normalises email and accepts a valid registration", () => {
    const result = registerSchema.safeParse({
      name: "Ayesha Khan",
      email: "  AYESHA@Example.COM ",
      phone: "+92 300 1234567",
      password: "longenough1",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("ayesha@example.com");
  });

  it("rejects short passwords and bad emails", () => {
    expect(
      registerSchema.safeParse({
        name: "A",
        email: "not-an-email",
        password: "short",
      }).success
    ).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires a password", () => {
    expect(
      loginSchema.safeParse({ email: "a@b.com", password: "" }).success
    ).toBe(false);
  });
});

describe("checkoutSchema", () => {
  const base = {
    customerName: "Demo Customer",
    customerEmail: "customer@example.com",
    customerPhone: "+92 300 0000000",
    addressLine: "Shop 1, Nicol Road, Karachi",
    city: "Karachi",
    postalCode: "",
    notes: "",
    paymentMethod: "COD",
    acceptTerms: "on",
  };

  it("accepts a complete checkout", () => {
    expect(checkoutSchema.safeParse(base).success).toBe(true);
  });

  it("requires terms acceptance", () => {
    expect(
      checkoutSchema.safeParse({ ...base, acceptTerms: undefined }).success
    ).toBe(false);
  });

  it("rejects unknown payment methods", () => {
    expect(
      checkoutSchema.safeParse({ ...base, paymentMethod: "CARD" }).success
    ).toBe(false);
  });
});
