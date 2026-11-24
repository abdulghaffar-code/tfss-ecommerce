import { describe, expect, it } from "vitest";
import { formatPrice, safeNextPath, slugify, stockLabel } from "@/lib/utils";

describe("slugify", () => {
  it("normalises product names", () => {
    expect(slugify("Fall Protection & Safety Harnesses")).toBe(
      "fall-protection-safety-harnesses"
    );
  });

  it("strips accents and extra punctuation", () => {
    expect(slugify("  Café — Gloves!  ")).toBe("cafe-gloves");
  });
});

describe("safeNextPath", () => {
  it("accepts internal paths", () => {
    expect(safeNextPath("/account/orders")).toBe("/account/orders");
  });

  it("rejects external and protocol-relative paths", () => {
    expect(safeNextPath("https://evil.example")).toBeNull();
    expect(safeNextPath("//evil.example")).toBeNull();
    expect(safeNextPath("/\\evil.example")).toBeNull();
    expect(safeNextPath(null)).toBeNull();
  });
});

describe("stockLabel", () => {
  it("flags out of stock, low stock and healthy stock", () => {
    expect(stockLabel(0).tone).toBe("danger");
    expect(stockLabel(3).tone).toBe("warn");
    expect(stockLabel(50).tone).toBe("ok");
  });
});

describe("formatPrice", () => {
  it("formats PKR values without decimals", () => {
    const formatted = formatPrice(12500);
    expect(formatted).toContain("12,500");
    expect(formatted).not.toContain(".00");
  });
});
