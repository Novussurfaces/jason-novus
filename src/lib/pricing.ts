import { products, type Product } from "./products";

type PriceRange = { min: number; max: number };

const pricePerSqFt: Record<string, PriceRange> = {
  "sci-100-coating-system": { min: 3, max: 5 },
  "sci-broadcast-system": { min: 3, max: 5 },
  "sci-flake-system": { min: 3, max: 5 },
  "sci-polyurea-flake-system": { min: 5, max: 8 },
  "sci-metallic-system": { min: 6, max: 10 },
  "sci-quartz-broadcast-system": { min: 5, max: 8 },
  "sci-quartz-trowel-system": { min: 5, max: 8 },
  "sci-cementitious-polyurethane": { min: 8, max: 12 },
  "sci-slurry-system": { min: 7, max: 10 },
  "sci-trowel-mortar-system": { min: 7, max: 10 },
  "sci-membrane-system": { min: 5, max: 8 },
  "sci-cove-quartz-system": { min: 5, max: 8 },
  "sci-op-system": { min: 5, max: 8 },
};

function getVolumeDiscount(sqft: number): { percent: number; label: string } {
  if (sqft >= 5000) return { percent: 15, label: "15%" };
  if (sqft >= 2500) return { percent: 10, label: "10%" };
  return { percent: 0, label: "" };
}

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
