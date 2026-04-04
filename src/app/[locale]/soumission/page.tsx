import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pagesMeta.quote" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/soumission`,
      languages: { fr: "/fr/soumission", en: "/en/soumission" },
    },
  };
}

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
