export const SITE_NAME = "Total Fire & Safety Solution";
export const SITE_DESCRIPTION =
  "Karachi-based industrial safety and PPE supplier since 1992. Fall protection, fire safety, head, eye, hand and respiratory protection, safety footwear and site safety supplies.";
export const CURRENCY = "PKR";
export const FLAT_SHIPPING = 250;
export const FREE_SHIPPING_THRESHOLD = 15000;
export const LOW_STOCK_THRESHOLD = 5;
export const PRODUCTS_PER_PAGE = 12;

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending verification",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: "Cash on Delivery",
  BANK_TRANSFER: "Bank Transfer",
};
