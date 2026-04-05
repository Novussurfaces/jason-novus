import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

const BASE_URL = "https://novusepoxy.ca";

// FR path → EN path mapping for all static pages
const PAGE_MAP: Record<string, string> = {
  "": "",
  "/produits": "/products",
  "/realisations": "/portfolio",
  "/soumission": "/quote",
  "/a-propos": "/about",
  "/contact": "/contact",
  "/calculateur": "/calculator",
  "/blog": "/blog",
};

// Landing pages (same slug in both langs)
const LANDING_PAGES = [
  "garage",
  "commercial",
  "gym",
  "restaurant",
  "entrepot",
  "condo",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Static pages (FR + EN) ──
  const staticFr = Object.keys(PAGE_MAP).map((frPath) => ({
    url: `${BASE_URL}/fr${frPath}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: frPath === "" ? 1 : 0.8,
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr${frPath}`,
        en: `${BASE_URL}/en${PAGE_MAP[frPath]}`,
      },
    },
  }));

  const staticEn = Object.keys(PAGE_MAP).map((frPath) => ({
    url: `${BASE_URL}/en${PAGE_MAP[frPath]}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: frPath === "" ? 1 : 0.8,
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr${frPath}`,
        en: `${BASE_URL}/en${PAGE_MAP[frPath]}`,
      },
    },
  }));

  // ── Product pages (FR + EN) ──
  const productsFr = products.map((p) => ({
    url: `${BASE_URL}/fr/produits/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr/produits/${p.slug}`,
        en: `${BASE_URL}/en/products/${p.slug}`,
      },
    },
  }));

  const productsEn = products.map((p) => ({
    url: `${BASE_URL}/en/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr/produits/${p.slug}`,
        en: `${BASE_URL}/en/products/${p.slug}`,
      },
    },
  }));

  // ── Landing pages (FR + EN) — high priority for paid ads ──
  const lpFr = LANDING_PAGES.map((slug) => ({
    url: `${BASE_URL}/fr/lp/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr/lp/${slug}`,
        en: `${BASE_URL}/en/lp/${slug}`,
      },
    },
  }));

  const lpEn = LANDING_PAGES.map((slug) => ({
    url: `${BASE_URL}/en/lp/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr/lp/${slug}`,
        en: `${BASE_URL}/en/lp/${slug}`,
      },
    },
  }));

  return [
    ...staticFr,
    ...staticEn,
    ...productsFr,
    ...productsEn,
    ...lpFr,
    ...lpEn,
  ];
}
