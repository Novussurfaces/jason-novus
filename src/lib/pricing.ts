import { products, type Product } from "./products";

type PriceRange = { min: number; max: number };

/* ──────────────────────────────────────────────
   APRIL 2026 PROMO — 20% off all projects
   Active for the month of April only
   ────────────────────────────────────────────── */
export const APRIL_PROMO_PERCENT = 20;

export function isAprilPromoActive(): boolean {
  const now = new Date();
  return now.getMonth() === 3 && now.getFullYear() === 2026; // month is 0-indexed
}

export function applyAprilPromo(amount: number): number {
  if (!isAprilPromoActive()) return amount;
  return Math.round(amount * (1 - APRIL_PROMO_PERCENT / 100));
}

/* ──────────────────────────────────────────────
   PRICE PER SQ FT — installed / applied pricing
   Used by the Calculator for project estimates
   ────────────────────────────────────────────── */
export const pricePerSqFt: Record<string, PriceRange> = {
  "sci-100-coating-system": { min: 2.75, max: 4.50 },
  "sci-broadcast-system": { min: 2.75, max: 4.50 },
  "sci-flake-system": { min: 2.85, max: 4.75 },
  "sci-polyurea-flake-system": { min: 4.50, max: 7.00 },
  "sci-metallic-system": { min: 5.50, max: 9.00 },
  "sci-quartz-broadcast-system": { min: 4.50, max: 7.50 },
  "sci-quartz-trowel-system": { min: 4.75, max: 7.50 },
  "sci-cementitious-polyurethane": { min: 7.00, max: 11.00 },
  "sci-slurry-system": { min: 6.00, max: 9.00 },
  "sci-trowel-mortar-system": { min: 6.50, max: 9.50 },
  "sci-membrane-system": { min: 4.50, max: 7.00 },
  "sci-cove-quartz-system": { min: 4.50, max: 7.00 },
  "sci-op-system": { min: 4.25, max: 6.50 },
};

/* ──────────────────────────────────────────────
   PAIL PRICING — per unit (3.78L / 1 US gal or 18.9L / 5 US gal)
   Coverage varies by product and application thickness
   ────────────────────────────────────────────── */
export type PailSize = "1gal" | "5gal";

export type PailPricing = {
  slug: string;
  unitPrice: Record<PailSize, number>;
  palletQty: Record<PailSize, number>;
  palletPrice: Record<PailSize, number>;
  coverage: { min: number; max: number; unit: "sqft" };
};

const pailPricing: Record<string, PailPricing> = {
  "sci-100-coating-system": {
    slug: "sci-100-coating-system",
    unitPrice: { "1gal": 89, "5gal": 385 },
    palletQty: { "1gal": 48, "5gal": 12 },
    palletPrice: { "1gal": 3650, "5gal": 3950 },
    coverage: { min: 80, max: 120, unit: "sqft" },
  },
  "sci-broadcast-system": {
    slug: "sci-broadcast-system",
    unitPrice: { "1gal": 85, "5gal": 365 },
    palletQty: { "1gal": 48, "5gal": 12 },
    palletPrice: { "1gal": 3480, "5gal": 3750 },
    coverage: { min: 60, max: 100, unit: "sqft" },
  },
  "sci-flake-system": {
    slug: "sci-flake-system",
    unitPrice: { "1gal": 92, "5gal": 399 },
    palletQty: { "1gal": 48, "5gal": 12 },
    palletPrice: { "1gal": 3780, "5gal": 4100 },
    coverage: { min: 80, max: 120, unit: "sqft" },
  },
  "sci-polyurea-flake-system": {
    slug: "sci-polyurea-flake-system",
    unitPrice: { "1gal": 135, "5gal": 589 },
    palletQty: { "1gal": 48, "5gal": 12 },
    palletPrice: { "1gal": 5550, "5gal": 6050 },
    coverage: { min: 60, max: 100, unit: "sqft" },
  },
  "sci-metallic-system": {
    slug: "sci-metallic-system",
    unitPrice: { "1gal": 165, "5gal": 725 },
    palletQty: { "1gal": 48, "5gal": 12 },
    palletPrice: { "1gal": 6800, "5gal": 7450 },
    coverage: { min: 50, max: 80, unit: "sqft" },
  },
  "sci-quartz-broadcast-system": {
    slug: "sci-quartz-broadcast-system",
    unitPrice: { "1gal": 125, "5gal": 545 },
    palletQty: { "1gal": 48, "5gal": 12 },
    palletPrice: { "1gal": 5100, "5gal": 5600 },
    coverage: { min: 50, max: 80, unit: "sqft" },
  },
  "sci-quartz-trowel-system": {
    slug: "sci-quartz-trowel-system",
    unitPrice: { "1gal": 129, "5gal": 559 },
    palletQty: { "1gal": 48, "5gal": 12 },
    palletPrice: { "1gal": 5300, "5gal": 5750 },
    coverage: { min: 40, max: 70, unit: "sqft" },
  },
  "sci-cementitious-polyurethane": {
    slug: "sci-cementitious-polyurethane",
    unitPrice: { "1gal": 195, "5gal": 859 },
    palletQty: { "1gal": 48, "5gal": 12 },
    palletPrice: { "1gal": 8000, "5gal": 8850 },
    coverage: { min: 30, max: 50, unit: "sqft" },
  },
  "sci-slurry-system": {
    slug: "sci-slurry-system",
    unitPrice: { "1gal": 155, "5gal": 675 },
    palletQty: { "1gal": 48, "5gal": 12 },
    palletPrice: { "1gal": 6350, "5gal": 6950 },
    coverage: { min: 30, max: 60, unit: "sqft" },
  },
  "sci-trowel-mortar-system": {
    slug: "sci-trowel-mortar-system",
    unitPrice: { "1gal": 159, "5gal": 695 },
    palletQty: { "1gal": 48, "5gal": 12 },
    palletPrice: { "1gal": 6500, "5gal": 7150 },
    coverage: { min: 25, max: 50, unit: "sqft" },
  },
  "sci-membrane-system": {
    slug: "sci-membrane-system",
    unitPrice: { "1gal": 119, "5gal": 519 },
    palletQty: { "1gal": 48, "5gal": 12 },
    palletPrice: { "1gal": 4900, "5gal": 5350 },
    coverage: { min: 50, max: 80, unit: "sqft" },
  },
  "sci-cove-quartz-system": {
    slug: "sci-cove-quartz-system",
    unitPrice: { "1gal": 125, "5gal": 545 },
    palletQty: { "1gal": 48, "5gal": 12 },
    palletPrice: { "1gal": 5100, "5gal": 5600 },
    coverage: { min: 40, max: 70, unit: "sqft" },
  },
  "sci-op-system": {
    slug: "sci-op-system",
    unitPrice: { "1gal": 115, "5gal": 499 },
    palletQty: { "1gal": 48, "5gal": 12 },
    palletPrice: { "1gal": 4700, "5gal": 5100 },
    coverage: { min: 60, max: 100, unit: "sqft" },
  },
};

/* ──────────────────────────────────────────────
   VOLUME DISCOUNT TIERS — applied to sqft estimates
   More aggressive than competitors:
   - Most competitors start discounts at 5,000+ sqft
   - We start at 1,000 sqft to win smaller contractors
   ────────────────────────────────────────────── */
function getVolumeDiscount(sqft: number): { percent: number; label: string } {
  if (sqft >= 10000) return { percent: 20, label: "20%" };
  if (sqft >= 5000) return { percent: 15, label: "15%" };
  if (sqft >= 2500) return { percent: 10, label: "10%" };
  if (sqft >= 1000) return { percent: 5, label: "5%" };
  return { percent: 0, label: "" };
}

/* ──────────────────────────────────────────────
   PALLET DISCOUNT — savings vs buying individual units
   ────────────────────────────────────────────── */
export function getPalletSavings(slug: string, size: PailSize): {
  unitTotal: number;
  palletPrice: number;
  savings: number;
  savingsPercent: number;
  qty: number;
} | null {
  const p = pailPricing[slug];
  if (!p) return null;

  const qty = p.palletQty[size];
  const unitTotal = p.unitPrice[size] * qty;
  const palletPrice = p.palletPrice[size];
  const savings = unitTotal - palletPrice;
  const savingsPercent = Math.round((savings / unitTotal) * 100);

  return { unitTotal, palletPrice, savings, savingsPercent, qty };
}

/* ──────────────────────────────────────────────
   GET PAIL PRICING for a product
   ────────────────────────────────────────────── */
export function getPailPricing(slug: string): PailPricing | null {
  return pailPricing[slug] || null;
}

/* ──────────────────────────────────────────────
   SQFT ESTIMATE — project cost calculator
   ────────────────────────────────────────────── */
export type PriceEstimate = {
  product: Product;
  sqft: number;
  pricePerSqFtRange: PriceRange;
  subtotalMin: number;
  subtotalMax: number;
  discount: { percent: number; label: string };
  totalMin: number;
  totalMax: number;
};

export function calculateEstimate(
  productSlug: string,
  sqft: number
): PriceEstimate | null {
  const product = products.find((p) => p.slug === productSlug);
  if (!product) return null;

  const range = pricePerSqFt[productSlug];
  if (!range) return null;

  const subtotalMin = sqft * range.min;
  const subtotalMax = sqft * range.max;
  const discount = getVolumeDiscount(sqft);
  const multiplier = 1 - discount.percent / 100;

  return {
    product,
    sqft,
    pricePerSqFtRange: range,
    subtotalMin,
    subtotalMax,
    discount,
    totalMin: Math.round(subtotalMin * multiplier),
    totalMax: Math.round(subtotalMax * multiplier),
  };
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceDecimal(amount: number): string {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
