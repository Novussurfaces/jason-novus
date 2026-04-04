import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Realisations } from "@/components/sections/Realisations";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { MultiStructuredData } from "@/components/StructuredData";
import { getBreadcrumbSchema } from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pagesMeta.portfolio" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/realisations`,
      languages: { fr: "/fr/realisations", en: "/en/realisations" },
    },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "fr" | "en";

  return (
    <>
      <MultiStructuredData
        schemas={[
          getBreadcrumbSchema(
            [
              { name: loc === "fr" ? "Accueil" : "Home", href: "" },
              {
                name: loc === "fr" ? "Realisations" : "Portfolio",
                href: "/realisations",
              },
            ],
            loc
          ),
        ]}
      />
      <Realisations />
      <BeforeAfter />
    </>
  );
}
