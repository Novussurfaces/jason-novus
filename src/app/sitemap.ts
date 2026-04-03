import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

const BASE_URL = "https://novusepoxy.ca";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/produits",
    "/realisations",
    "/soumission",
    "/a-propos",
    "/contact",
    "/calculateur",
  ];

  const frPages = staticPages.map((page) => ({
    url: `${BASE_URL}/fr${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: page === "" ? 1 : 0.8,
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr${page}`,
        en: `${BASE_URL}/en${page}`,
      },
    },
  }));

  const enPages = staticPages.map((page) => {
    const enPath: Record<string, string> = {
      "": "",
      "/produits": "/products",
      "/realisations": "/portfolio",
      "/soumission": "/quote",
      "/a-propos": "/about",
      "/contact": "/contact",
      "/calculateur": "/calculator",
    };
    return {
      url: `${BASE_URL}/en${enPath[page] || page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.8,
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr${page}`,
          en: `${BASE_URL}/en${enPath[page] || page}`,
        },
      },
    };
  });

  const productPagesFr = products.map((p) => ({
    url: `${BASE_URL}/fr/produits/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr/produits/${p.slug}`,
        en: `${BASE_URL}/en/products/${p.slug}`,
      },
    },
  }));

  const productPagesEn = products.map((p) => ({
    url: `${BASE_URL}/en/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr/produits/${p.slug}`,
        en: `${BASE_URL}/en/products/${p.slug}`,
      },
    },
  }));

  return [...frPages, ...enPages, ...productPagesFr, ...productPagesEn];
}
