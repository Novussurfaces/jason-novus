import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CommercialLanding } from "@/components/landing/CommercialLanding";
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
      ? "Revetement de Sol Commercial | Epoxy Industriel Quebec"
      : "Commercial Floor Coating | Industrial Epoxy Quebec",
    description: isFr
      ? "Revetements de sol commerciaux haute performance. Epoxy, polyurea, polyaspartique pour commerces, bureaux et espaces publics. Soumission gratuite."
      : "High-performance commercial floor coatings. Epoxy, polyurea, polyaspartic for retail, offices and public spaces. Free quote.",
    alternates: {
      canonical: `https://novusepoxy.ca/${locale}/lp/commercial`,
      languages: { fr: "/fr/lp/commercial", en: "/en/lp/commercial" },
    },
    openGraph: {
      title: isFr ? "Sol Commercial Epoxy | Novus Epoxy" : "Commercial Epoxy Flooring | Novus Epoxy",
      description: isFr
        ? "Revetements commerciaux haute performance. Epoxy, polyurea, garantie professionnelle."
        : "High-performance commercial coatings. Epoxy, polyurea, professional warranty.",
      type: "website",
      siteName: "Novus Epoxy",
      locale: isFr ? "fr_CA" : "en_CA",
    },
  };
}

export default async function CommercialLandingPage({ params }: Props) {
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
              { name: loc === "fr" ? "Sol Commercial Epoxy" : "Commercial Epoxy Floor", href: "/lp/commercial" },
            ],
            loc
          ),
        ]}
      />
      <CommercialLanding />
    </>
  );
}
