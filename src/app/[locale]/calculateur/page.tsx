import { setRequestLocale } from "next-intl/server";
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
