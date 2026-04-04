import { setRequestLocale } from "next-intl/server";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { MultiStructuredData } from "@/components/StructuredData";
import {
  getLocalBusinessSchema,
  getPromoOfferSchema,
  getBreadcrumbSchema,
} from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function QuotePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "fr" | "en";

  return (
    <>
      <MultiStructuredData
        schemas={[
          getLocalBusinessSchema(),
          getPromoOfferSchema(loc),
          getBreadcrumbSchema(
            [
              { name: loc === "fr" ? "Accueil" : "Home", href: "" },
              {
                name: loc === "fr" ? "Soumission gratuite" : "Free Quote",
                href: "/soumission",
              },
            ],
            loc
          ),
        ]}
      />
      <QuoteForm />
    </>
  );
}
