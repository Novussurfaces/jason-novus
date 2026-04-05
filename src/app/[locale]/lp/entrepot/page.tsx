import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { EntrepotLanding } from "@/components/landing/EntrepotLanding";
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
      ? "Plancher d'Entrepot en Epoxy | Revetement Industriel Quebec"
      : "Warehouse Epoxy Flooring | Industrial Floor Coating Quebec",
    description: isFr
      ? "Revetement de sol industriel pour entrepots. Supporte le trafic lourd, chariots elevateurs, resistant aux produits chimiques. Soumission gratuite."
      : "Industrial floor coating for warehouses. Handles heavy traffic, forklifts, chemical resistant. Free quote.",
    alternates: {
      canonical: `https://novusepoxy.ca/${locale}/lp/entrepot`,
      languages: { fr: "/fr/lp/entrepot", en: "/en/lp/entrepot" },
    },
    openGraph: {
      title: isFr ? "Plancher Entrepot Epoxy | Novus Epoxy" : "Warehouse Epoxy Floor | Novus Epoxy",
      description: isFr
        ? "Sol industriel pour entrepots. Trafic lourd, resistant chimique."
        : "Industrial warehouse floor. Heavy traffic, chemical resistant.",
      type: "website",
      siteName: "Novus Epoxy",
      locale: isFr ? "fr_CA" : "en_CA",
    },
  };
}

export default async function EntrepotLandingPage({ params }: Props) {
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
              { name: loc === "fr" ? "Plancher Entrepot Epoxy" : "Warehouse Epoxy Floor", href: "/lp/entrepot" },
            ],
            loc
          ),
        ]}
      />
      <EntrepotLanding />
    </>
  );
}
