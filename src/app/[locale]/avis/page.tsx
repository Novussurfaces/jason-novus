import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ReviewsContent } from "@/components/sections/ReviewsContent";
import { MultiStructuredData } from "@/components/StructuredData";
import { getOrganizationSchema, getBreadcrumbSchema } from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

function getAggregateRatingSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://novusepoxy.ca/#business",
    name: "Novus Epoxy",
    image: "https://novusepoxy.ca/logo-icon.svg",
    url: "https://novusepoxy.ca",
    telephone: "+1-581-307-2678",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Quebec",
      addressRegion: "QC",
      addressCountry: "CA",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "53",
      reviewCount: "53",
    },
  };
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviews" });

  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
    alternates: {
      canonical: locale === "fr" ? "/avis" : "/en/reviews",
      languages: {
        fr: "/avis",
        en: "/en/reviews",
      },
    },
  };
}

export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "fr" | "en";

  return (
    <>
      <MultiStructuredData
        schemas={[
          getOrganizationSchema(),
          getAggregateRatingSchema(),
          getBreadcrumbSchema(
            [
              { name: loc === "fr" ? "Accueil" : "Home", href: "" },
              { name: loc === "fr" ? "Avis" : "Reviews", href: "/avis" },
            ],
            loc
          ),
        ]}
      />
      <ReviewsContent />
    </>
  );
}
