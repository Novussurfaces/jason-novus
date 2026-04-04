import { products, type Product } from "./products";
import { pricePerSqFt } from "./pricing";

const BASE_URL = "https://novusepoxy.ca";
const ALT_URL = "https://novussurfaces.com";

/* ──────────────────────────────────────────────
   ORGANIZATION — Novus Surfaces corporate entity
   ────────────────────────────────────────────── */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Novus Surfaces",
    alternateName: "Novus Epoxy",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo-icon.svg`,
      width: 512,
      height: 512,
    },
    image: `${BASE_URL}/og-image.svg`,
    email: "gestionnovusepoxy@gmail.com",
    telephone: "+1-581-307-2678",
    description:
      "Premium surface coatings — epoxy, polyurea, polyaspartic, and quartz systems. Manufactured by SCI Coatings in Montreal, branded and sold worldwide by Novus Surfaces.",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Quebec",
        addressRegion: "QC",
        addressCountry: "CA",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Quebec",
      addressRegion: "QC",
      addressCountry: "CA",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-581-307-2678",
        email: "gestionnovusepoxy@gmail.com",
        contactType: "sales",
        availableLanguage: ["French", "English"],
        areaServed: ["CA", "US", "FR", "BE", "CH"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+1-581-307-2678",
        email: "gestionnovusepoxy@gmail.com",
        contactType: "customer service",
        availableLanguage: ["French", "English"],
      },
    ],
    areaServed: [
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "France" },
      { "@type": "Continent", name: "North America" },
      { "@type": "Continent", name: "Europe" },
    ],
    brand: {
      "@type": "Brand",
      name: "Novus Surfaces",
      logo: `${BASE_URL}/logo-icon.svg`,
    },
    sameAs: [
      "https://www.facebook.com/novussurfaces",
      ALT_URL,
    ],
    knowsAbout: [
      "Epoxy floor coatings",
      "Polyurea coatings",
      "Polyaspartic coatings",
      "Quartz flooring systems",
      "Metallic epoxy floors",
      "Industrial flooring",
      "Commercial floor systems",
      "Garage floor coatings",
      "Cementitious polyurethane",
      "Waterproofing membranes",
    ],
    parentOrganization: {
      "@type": "Organization",
      name: "Groupe Novus",
    },
  };
}

/* ──────────────────────────────────────────────
   LOCAL BUSINESS — physical presence + service area
   ────────────────────────────────────────────── */
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#business`,
    name: "Novus Surfaces",
    alternateName: "Novus Epoxy",
    url: BASE_URL,
    image: `${BASE_URL}/og-image.svg`,
    logo: `${BASE_URL}/logo-icon.svg`,
    email: "gestionnovusepoxy@gmail.com",
    telephone: "+1-581-307-2678",
    description:
      "Premium epoxy, polyurea, polyaspartic, and quartz surface coatings. Manufactured by SCI Coatings in Montreal, sold and shipped worldwide.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Quebec",
      addressRegion: "QC",
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 46.8139,
      longitude: -71.2080,
    },
    areaServed: [
      {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: 46.8139,
          longitude: -71.2080,
        },
        geoRadius: "20000 km",
      },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "France" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    priceRange: "$$",
    currenciesAccepted: "CAD, USD",
    paymentAccepted: "Credit Card, Debit Card, Bank Transfer",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "SCI Coating Systems",
      itemListElement: products.map((p) => ({
        "@type": "OfferCatalog",
        name: p.name.en,
        description: p.shortDescription.en,
      })),
    },
  };
}

/* ──────────────────────────────────────────────
   PRODUCT — individual product with pricing from pricing.ts
   ────────────────────────────────────────────── */
export function getProductSchema(product: Product, locale: "fr" | "en") {
  const pricing = pricePerSqFt[product.slug];
  const hasPromo = true; // April 2026 promo active
  const promoDiscount = 0.20; // 20% off

  const baseOffer = {
    "@type": "Offer" as const,
    availability: "https://schema.org/InStock",
    priceCurrency: "CAD",
    price: pricing ? pricing.min.toFixed(2) : undefined,
    priceSpecification: pricing
      ? {
          "@type": "UnitPriceSpecification",
          price: pricing.min,
          priceCurrency: "CAD",
          unitCode: "FTK",
          unitText: "sq ft",
          minPrice: pricing.min,
          maxPrice: pricing.max,
        }
      : undefined,
    url: `${BASE_URL}/${locale}/produits/${product.slug}`,
    seller: {
      "@type": "Organization",
      name: "Novus Surfaces",
      url: BASE_URL,
    },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingDestination: [
        {
          "@type": "DefinedRegion",
          addressCountry: "CA",
        },
        {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
      ],
    },
    itemCondition: "https://schema.org/NewCondition",
  };

  const offers: Record<string, unknown>[] = [baseOffer];

  if (hasPromo && pricing) {
    offers.push({
      "@type": "Offer",
      name: locale === "fr" ? "Promo Avril — 20% de rabais" : "April Promo — 20% Off",
      availability: "https://schema.org/InStock",
      priceCurrency: "CAD",
      price: (pricing.min * (1 - promoDiscount)).toFixed(2),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: +(pricing.min * (1 - promoDiscount)).toFixed(2),
        priceCurrency: "CAD",
        unitCode: "FTK",
        unitText: "sq ft",
        minPrice: +(pricing.min * (1 - promoDiscount)).toFixed(2),
        maxPrice: +(pricing.max * (1 - promoDiscount)).toFixed(2),
      },
      priceValidUntil: "2026-04-30",
      url: `${BASE_URL}/${locale}/produits/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "Novus Surfaces",
      },
      itemCondition: "https://schema.org/NewCondition",
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${BASE_URL}/${locale}/produits/${product.slug}#product`,
    name: product.name[locale],
    description: product.description[locale],
    sku: product.sciCode,
    mpn: product.sciCode,
    image: `${BASE_URL}${product.image}`,
    url: `${BASE_URL}/${locale}/produits/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: "Novus Surfaces",
    },
    manufacturer: {
      "@type": "Organization",
      name: "SCI Coatings Inc.",
      url: "https://scicoatings.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Anjou",
        addressRegion: "QC",
        addressCountry: "CA",
      },
    },
    category: product.specs.chemistry,
    material: product.specs.chemistry,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: locale === "fr" ? "Epaisseur" : "Thickness",
        value: product.specs.thickness,
      },
      {
        "@type": "PropertyValue",
        name: locale === "fr" ? "Temps de cure" : "Cure Time",
        value: product.specs.cureTime,
      },
      {
        "@type": "PropertyValue",
        name: locale === "fr" ? "Prêt au trafic" : "Traffic Ready",
        value: product.specs.trafficReady,
      },
    ],
    offers: offers.length === 1 ? offers[0] : offers,
  };
}

/* ──────────────────────────────────────────────
   ALL PRODUCTS LIST — for catalog pages
   ────────────────────────────────────────────── */
export function getAllProductsSchema(locale: "fr" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "fr" ? "Produits Novus Surfaces" : "Novus Surfaces Products",
    description:
      locale === "fr"
        ? "13 systemes de revetement SCI — epoxy, polyurea, polyaspartique, quartz, metallique"
        : "13 SCI coating systems — epoxy, polyurea, polyaspartic, quartz, metallic",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name[locale],
      url: `${BASE_URL}/${locale}/produits/${p.slug}`,
      item: {
        "@type": "Product",
        name: p.name[locale],
        description: p.shortDescription[locale],
        sku: p.sciCode,
        image: `${BASE_URL}${p.image}`,
        brand: { "@type": "Brand", name: "Novus Surfaces" },
        offers: pricePerSqFt[p.slug]
          ? {
              "@type": "Offer",
              priceCurrency: "CAD",
              price: pricePerSqFt[p.slug].min.toFixed(2),
              availability: "https://schema.org/InStock",
            }
          : undefined,
      },
    })),
  };
}

/* ──────────────────────────────────────────────
   BREADCRUMB LIST — navigation trail
   ────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────
   WEBSITE — with SearchAction for sitelinks search
   ────────────────────────────────────────────── */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "Novus Surfaces",
    alternateName: "Novus Epoxy",
    url: BASE_URL,
    inLanguage: ["fr-CA", "en-CA"],
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Novus Surfaces",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/fr/produits?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* ──────────────────────────────────────────────
   FAQ PAGE — common epoxy coating questions (bilingual)
   ────────────────────────────────────────────── */
type FAQItem = { question: { fr: string; en: string }; answer: { fr: string; en: string } };

const faqItems: FAQItem[] = [
  {
    question: {
      fr: "Combien coute un plancher epoxy au pied carre?",
      en: "How much does an epoxy floor cost per square foot?",
    },
    answer: {
      fr: "Les prix varient de 2,75$ a 11,00$ le pied carre selon le systeme choisi. Les systemes de base comme le SCI-100 commencent a 2,75$/pi2, tandis que les systemes specialises comme le polyurethane cimentaire peuvent atteindre 11,00$/pi2. Demandez une soumission gratuite pour un prix exact.",
      en: "Prices range from $2.75 to $11.00 per square foot depending on the system chosen. Base systems like the SCI-100 start at $2.75/sqft, while specialized systems like cementitious polyurethane can reach $11.00/sqft. Request a free quote for an exact price.",
    },
  },
  {
    question: {
      fr: "Combien de temps dure un plancher epoxy?",
      en: "How long does an epoxy floor last?",
    },
    answer: {
      fr: "Un plancher epoxy professionnel Novus Surfaces dure entre 10 et 20 ans selon le systeme, le trafic et l'entretien. Les systemes quartz comme le SCI-Quartz Broadcast ont une duree de vie de 15+ ans meme dans les zones a tres fort trafic.",
      en: "A professional Novus Surfaces epoxy floor lasts between 10 and 20 years depending on the system, traffic, and maintenance. Quartz systems like the SCI-Quartz Broadcast have a 15+ year lifespan even in very high-traffic areas.",
    },
  },
  {
    question: {
      fr: "Est-ce que l'epoxy resiste aux produits chimiques?",
      en: "Is epoxy resistant to chemicals?",
    },
    answer: {
      fr: "Oui. Tous nos systemes offrent une resistance chimique. Pour les environnements industriels agressifs (acides, solvants), nous recommandons le SCI-Slurry ou le SCI-CPU (polyurethane cimentaire) qui offrent une resistance chimique de grade superieur.",
      en: "Yes. All our systems offer chemical resistance. For aggressive industrial environments (acids, solvents), we recommend the SCI-Slurry or the SCI-CPU (cementitious polyurethane) which provide superior-grade chemical resistance.",
    },
  },
  {
    question: {
      fr: "Livrez-vous partout au Canada et a l'international?",
      en: "Do you ship across Canada and internationally?",
    },
    answer: {
      fr: "Oui. Novus Surfaces livre partout au Canada, aux Etats-Unis, en Europe et dans le monde entier par voie aerienne et maritime. Tous nos produits sont fabriques par SCI Coatings a Montreal, Quebec.",
      en: "Yes. Novus Surfaces ships across Canada, the United States, Europe, and worldwide via air and sea freight. All our products are manufactured by SCI Coatings in Montreal, Quebec.",
    },
  },
  {
    question: {
      fr: "Quelle est la difference entre epoxy et polyurea?",
      en: "What is the difference between epoxy and polyurea?",
    },
    answer: {
      fr: "L'epoxy offre une excellente resistance chimique et une finition brillante, mais necessite 24-72h de cure. Le polyurea cure en 2-4 heures, est 4x plus flexible et resistant aux UV. Le systeme SCI-Polyurea permet une installation complete en 1 jour.",
      en: "Epoxy offers excellent chemical resistance and a glossy finish, but requires 24-72h cure time. Polyurea cures in 2-4 hours, is 4x more flexible, and UV resistant. The SCI-Polyurea system allows complete installation in 1 day.",
    },
  },
  {
    question: {
      fr: "Peut-on installer l'epoxy soi-meme (DIY)?",
      en: "Can you install epoxy yourself (DIY)?",
    },
    answer: {
      fr: "Novus Surfaces vend directement aux professionnels et aux proprietaires. Nos produits SCI sont de grade professionnel avec des instructions detaillees. Pour les meilleurs resultats, nous recommandons une installation par un professionnel certifie.",
      en: "Novus Surfaces sells directly to professionals and property owners. Our SCI products are professional-grade with detailed instructions. For best results, we recommend installation by a certified professional.",
    },
  },
  {
    question: {
      fr: "Quelles sont les conditions ideales pour appliquer un revetement epoxy?",
      en: "What are the ideal conditions for applying an epoxy coating?",
    },
    answer: {
      fr: "La temperature ideale est entre 10C et 30C avec un taux d'humidite inferieur a 80%. Le beton doit etre sec et propre. Utilisez notre outil de conditions de cure sur novusepoxy.ca pour verifier si les conditions sont favorables dans votre region.",
      en: "The ideal temperature is between 10C and 30C with humidity below 80%. The concrete must be dry and clean. Use our curing conditions tool on novusepoxy.ca to check if conditions are favorable in your area.",
    },
  },
  {
    question: {
      fr: "Offrez-vous des rabais pour les gros volumes?",
      en: "Do you offer volume discounts?",
    },
    answer: {
      fr: "Oui. Nous offrons des rabais progressifs: 5% a partir de 1 000 pi2, 10% a 2 500 pi2, 15% a 5 000 pi2, et 20% a 10 000 pi2 et plus. Les prix palette offrent des economies supplementaires de 14-18% par rapport a l'achat unitaire.",
      en: "Yes. We offer progressive discounts: 5% from 1,000 sqft, 10% at 2,500 sqft, 15% at 5,000 sqft, and 20% at 10,000 sqft and above. Pallet pricing offers additional savings of 14-18% compared to unit purchases.",
    },
  },
];

export function getFAQSchema(locale: "fr" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question[locale],
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer[locale],
      },
    })),
  };
}

/* ──────────────────────────────────────────────
   OFFER — April promo 20% discount
   ────────────────────────────────────────────── */
export function getPromoOfferSchema(locale: "fr" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    "@id": `${BASE_URL}/#april-promo`,
    name:
      locale === "fr"
        ? "Promotion Avril 2026 — 20% de rabais sur tous les systemes"
        : "April 2026 Promotion — 20% Off All Systems",
    description:
      locale === "fr"
        ? "20% de rabais sur tous les systemes de revetement SCI. Offre valide jusqu'au 30 avril 2026."
        : "20% off all SCI coating systems. Offer valid until April 30, 2026.",
    url: `${BASE_URL}/${locale}/produits`,
    priceCurrency: "CAD",
    availability: "https://schema.org/InStock",
    priceValidUntil: "2026-04-30",
    validFrom: "2026-04-01",
    category:
      locale === "fr" ? "Revetements de plancher" : "Floor Coatings",
    seller: {
      "@type": "Organization",
      name: "Novus Surfaces",
      url: BASE_URL,
    },
    eligibleRegion: [
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "United States" },
    ],
  };
}

/* ──────────────────────────────────────────────
   SERVICE — for service-oriented pages
   ────────────────────────────────────────────── */
export function getServiceSchema(locale: "fr" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/#service`,
    name:
      locale === "fr"
        ? "Vente et distribution de revetements de plancher"
        : "Floor Coating Sales and Distribution",
    description:
      locale === "fr"
        ? "Vente et distribution de systemes de revetement epoxy, polyurea, polyaspartique et quartz. Produits SCI Coatings fabriques a Montreal, livres partout dans le monde."
        : "Sales and distribution of epoxy, polyurea, polyaspartic, and quartz coating systems. SCI Coatings products manufactured in Montreal, shipped worldwide.",
    provider: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Novus Surfaces",
    },
    serviceType: locale === "fr" ? "Revetements de plancher" : "Floor Coatings",
    areaServed: [
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "France" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === "fr" ? "Systemes de revetement SCI" : "SCI Coating Systems",
      itemListElement: products.slice(0, 5).map((p) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: p.name[locale],
          description: p.shortDescription[locale],
        },
      })),
    },
  };
}
