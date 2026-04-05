import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CondoLanding } from "@/components/landing/CondoLanding";
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
      ? "Plancher Epoxy pour Condo | Revetement Residentiel Haut de Gamme"
      : "Condo Epoxy Flooring | Premium Residential Floor Coating",
    description: isFr
      ? "Plancher epoxy luxueux pour condos et residences. Finis metalliques, quartz, polyaspartique. Installation rapide, sans odeur. Soumission gratuite."
      : "Luxurious epoxy flooring for condos and homes. Metallic, quartz, polyaspartic finishes. Fast, odorless installation. Free quote.",
    alternates: {
      canonical: `https://novusepoxy.ca/${locale}/lp/condo`,
      languages: { fr: "/fr/lp/condo", en: "/en/lp/condo" },
    },
    openGraph: {
      title: isFr ? "Plancher Condo Epoxy | Novus Epoxy" : "Condo Epoxy Floor | Novus Epoxy",
      description: isFr
        ? "Epoxy luxueux pour condos. Metallique, quartz, installation rapide."
        : "Luxury epoxy for condos. Metallic, quartz, fast installation.",
      type: "website",
      siteName: "Novus Epoxy",
      locale: isFr ? "fr_CA" : "en_CA",
    },
  };
}

export default async function CondoLandingPage({ params }: Props) {
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
              { name: loc === "fr" ? "Plancher Condo Epoxy" : "Condo Epoxy Floor", href: "/lp/condo" },
            ],
            loc
          ),
        ]}
      />
      <CondoLanding />
    </>
  );
}
