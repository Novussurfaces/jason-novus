import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalculatorSection } from "@/components/sections/Calculator";
import { CuringConditions } from "@/components/sections/CuringConditions";
import { MultiStructuredData } from "@/components/StructuredData";
import {
  getFAQSchema,
  getPromoOfferSchema,
  getBreadcrumbSchema,
} from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pagesMeta.calculator" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/calculateur`,
      languages: { fr: "/fr/calculateur", en: "/en/calculateur" },
    },
  };
}

export default async function CalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "fr" | "en";

  return (
    <>
      <MultiStructuredData
        schemas={[
          getFAQSchema(loc),
          getPromoOfferSchema(loc),
          getBreadcrumbSchema(
            [
              { name: loc === "fr" ? "Accueil" : "Home", href: "" },
              {
                name: loc === "fr" ? "Calculateur de prix" : "Price Calculator",
                href: "/calculateur",
              },
            ],
            loc
          ),
        ]}
      />
      <CalculatorSection />
      <CuringConditions />
    </>
  );
}
