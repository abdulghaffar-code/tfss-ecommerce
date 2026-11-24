import { describe, expect, it } from "vitest";
import { computeShipping, computeTotals, roundMoney } from "@/lib/order-math";

describe("roundMoney", () => {
  it("rounds to two decimals", () => {
    expect(roundMoney(10.005)).toBe(10.01);
    expect(roundMoney(0.1 + 0.2)).toBe(0.3);
  });
});

describe("computeShipping", () => {
  it("charges flat delivery below the threshold", () => {
    expect(computeShipping(14999)).toBe(250);
  });

  it("is free at the threshold", () => {
    expect(computeShipping(15000)).toBe(0);
  });

  it("is zero for an empty order", () => {
    expect(computeShipping(0)).toBe(0);
  });
});

describe("computeTotals", () => {
  it("calculates subtotal, shipping and total", () => {
    const totals = computeTotals([
      { unitPrice: 3350, quantity: 2 },
      { unitPrice: 950, quantity: 1 },
    ]);
    expect(totals.subtotal).toBe(7650);
    expect(totals.shipping).toBe(250);
    expect(totals.total).toBe(7900);
    expect(totals.itemCount).toBe(3);
  });

  it("unlocks free delivery above the threshold", () => {
    const totals = computeTotals([{ unitPrice: 12500, quantity: 2 }]);
    expect(totals.subtotal).toBe(25000);
    expect(totals.shipping).toBe(0);
    expect(totals.total).toBe(25000);
  });

  it("caps discount at the subtotal", () => {
    const totals = computeTotals([{ unitPrice: 1000, quantity: 1 }], {
      discount: 5000,
    });
    expect(totals.discount).toBe(1000);
    expect(totals.total).toBe(250);
  });

  it("never returns a negative total", () => {
    const totals = computeTotals([{ unitPrice: 100, quantity: 1 }], {
      discount: 100,
      flatRate: 0,
    });
    expect(totals.total).toBe(0);
  });
});
