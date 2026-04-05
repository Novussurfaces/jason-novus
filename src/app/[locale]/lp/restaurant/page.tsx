import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { RestaurantLanding } from "@/components/landing/RestaurantLanding";
import { MultiStructuredData } from "@/components/StructuredData";
import { getLocalBusinessSchema, getFAQSchema, getBreadcrumbSchema } from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";

  return {
    title: isFr
      ? "Plancher de Restaurant en Epoxy | Revetement Cuisine Commerciale"
      : "Restaurant Epoxy Flooring | Commercial Kitchen Floor Coating",
    description: isFr
      ? "Revetement de sol pour restaurants et cuisines commerciales. Conforme aux normes sanitaires, antiderapant, facile a nettoyer. Soumission gratuite."
      : "Floor coating for restaurants and commercial kitchens. Health code compliant, anti-slip, easy to clean. Free quote.",
    alternates: {
      canonical: `https://novusepoxy.ca/${locale}/lp/restaurant`,
      languages: { fr: "/fr/lp/restaurant", en: "/en/lp/restaurant" },
    },
    openGraph: {
      title: isFr ? "Plancher Restaurant Epoxy | Novus Epoxy" : "Restaurant Epoxy Floor | Novus Epoxy",
      description: isFr
        ? "Sol de restaurant conforme, antiderapant, facile a entretenir."
        : "Compliant restaurant floor, anti-slip, easy maintenance.",
      type: "website",
      siteName: "Novus Epoxy",
      locale: isFr ? "fr_CA" : "en_CA",
    },
  };
}

export default async function RestaurantLandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as "fr" | "en";
  return (
    <>
      <MultiStructuredData
        schemas={[
          getLocalBusinessSchema(),
          getFAQSchema(loc),
          getBreadcrumbSchema(
            [
              { name: loc === "fr" ? "Accueil" : "Home", href: "" },
              { name: loc === "fr" ? "Plancher Restaurant Epoxy" : "Restaurant Epoxy Floor", href: "/lp/restaurant" },
            ],
            loc
          ),
        ]}
      />
      <RestaurantLanding />
    </>
  );
}
