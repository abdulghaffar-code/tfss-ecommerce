import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export type PriceLine = {
  unitPrice: number;
  quantity: number;
};

export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function computeShipping(
  subtotal: number,
  freeThreshold = FREE_SHIPPING_THRESHOLD,
  flatRate = FLAT_SHIPPING
) {
  if (subtotal <= 0) return 0;
  return subtotal >= freeThreshold ? 0 : flatRate;
}

export function computeTotals(
  lines: PriceLine[],
  options?: { discount?: number; freeThreshold?: number; flatRate?: number }
) {
  const subtotal = roundMoney(
    lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
  );
  const shipping = computeShipping(
    subtotal,
    options?.freeThreshold,
    options?.flatRate
  );
  const discount = roundMoney(Math.min(options?.discount ?? 0, subtotal));
  const total = roundMoney(Math.max(0, subtotal - discount + shipping));
  return {
    subtotal,
    discount,
    shipping,
    total,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
  };
}
