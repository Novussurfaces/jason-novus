import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactContent } from "@/components/sections/ContactContent";
import { DealerMap } from "@/components/sections/DealerMap";
import { MultiStructuredData } from "@/components/StructuredData";
import {
  getLocalBusinessSchema,
  getOrganizationSchema,
  getBreadcrumbSchema,
} from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pagesMeta.contact" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { fr: "/fr/contact", en: "/en/contact" },
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <MultiStructuredData
        schemas={[
          getLocalBusinessSchema(),
          getOrganizationSchema(),
          getBreadcrumbSchema(
            [
              { name: locale === "fr" ? "Accueil" : "Home", href: "" },
              { name: "Contact", href: "/contact" },
            ],
            locale as "fr" | "en"
          ),
        ]}
      />
      <ContactContent />
      <DealerMap />
    </>
  );
}
