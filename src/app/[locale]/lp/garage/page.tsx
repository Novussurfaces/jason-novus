import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { GarageLanding } from "@/components/landing/GarageLanding";
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
      ? "Plancher de Garage en Epoxy | Installation Professionnelle Quebec"
      : "Garage Epoxy Flooring | Professional Installation Quebec",
    description: isFr
      ? "Transformez votre garage avec un plancher epoxy haut de gamme. Resistant aux produits chimiques, antiderapant, garantie 15 ans. Soumission gratuite partout au Quebec."
      : "Transform your garage with premium epoxy flooring. Chemical resistant, anti-slip, 15-year warranty. Free quote across Quebec.",
    alternates: {
      canonical: `https://novusepoxy.ca/${locale}/lp/garage`,
      languages: { fr: "/fr/lp/garage", en: "/en/lp/garage" },
    },
    openGraph: {
      title: isFr ? "Plancher Epoxy pour Garage | Novus Epoxy" : "Garage Epoxy Flooring | Novus Epoxy",
      description: isFr
        ? "Plancher de garage epoxy professionnel. Resistant, antiderapant, 15 ans de garantie."
        : "Professional garage epoxy flooring. Durable, anti-slip, 15-year warranty.",
      type: "website",
      siteName: "Novus Epoxy",
      locale: isFr ? "fr_CA" : "en_CA",
    },
  };
}

export default async function GarageLandingPage({ params }: Props) {
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
              { name: loc === "fr" ? "Plancher Garage Epoxy" : "Garage Epoxy Floor", href: "/lp/garage" },
            ],
            loc
          ),
        ]}
      />
      <GarageLanding />
    </>
  );
}
