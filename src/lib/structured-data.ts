import { products, type Product } from "./products";

const BASE_URL = "https://novussurfaces.com";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Novus Surfaces",
    url: BASE_URL,
    logo: `${BASE_URL}/logo-icon.svg`,
    email: "info@novussurfaces.com",
    description:
      "Premium surface coatings — epoxy, polyurea, and quartz systems. Made in Canada, shipped worldwide.",
    areaServed: [
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "United States" },
      { "@type": "Continent", name: "North America" },
    ],
    brand: {
      "@type": "Brand",
      name: "Novus Surfaces",
    },
    sameAs: ["https://www.facebook.com/novussurfaces"],
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#business`,
    name: "Novus Surfaces",
    url: BASE_URL,
    email: "info@novussurfaces.com",
    description:
      "Premium epoxy, polyurea, and quartz surface coatings. Made in Canada, worldwide delivery.",
    areaServed: [
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "United States" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    priceRange: "$$",
  };
}

export function getProductSchema(product: Product, locale: "fr" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name[locale],
    description: product.description[locale],
    brand: {
      "@type": "Brand",
      name: "Novus Surfaces",
    },
    manufacturer: {
      "@type": "Organization",
      name: "SCI Coatings Inc.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Montreal",
        addressRegion: "QC",
        addressCountry: "CA",
      },
    },
    category: product.specs.chemistry,
    url: `${BASE_URL}/${locale}/produits/${product.slug}`,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "CAD",
      seller: {
        "@type": "Organization",
        name: "Novus Surfaces",
      },
    },
  };
}

export function getBreadcrumbSchema(
  items: { name: string; href: string }[],
  locale: "fr" | "en"
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}/${locale}${item.href}`,
    })),
  };
}
