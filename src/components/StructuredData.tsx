export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Novus Surfaces",
    url: "https://novussurfaces.com",
    logo: "https://novussurfaces.com/logo-icon.svg",
    description: "Premium epoxy, polyurea, and polyaspartic floor coating systems. Professional-grade surface solutions manufactured in Montreal, shipped worldwide.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Montreal",
      addressRegion: "QC",
      addressCountry: "CA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@novussurfaces.com",
      contactType: "sales",
      availableLanguage: ["French", "English"],
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 45.5017,
        longitude: -73.5673,
      },
      geoRadius: "20000 km",
    },
    knowsAbout: [
      "Epoxy floor coatings",
      "Polyurea coatings",
      "Polyaspartic coatings",
      "Industrial flooring",
      "Commercial floor systems",
      "Garage floor coatings",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Novus Surfaces",
    image: "https://novussurfaces.com/logo-icon.svg",
    url: "https://novussurfaces.com",
    email: "info@novussurfaces.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Montreal",
      addressRegion: "QC",
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 45.5017,
      longitude: -73.5673,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
