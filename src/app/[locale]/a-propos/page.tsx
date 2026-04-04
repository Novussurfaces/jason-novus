import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutContent } from "@/components/sections/AboutContent";
import { Testimonials } from "@/components/sections/Testimonials";
import { WorldwideShipping } from "@/components/sections/WorldwideShipping";
import { MultiStructuredData } from "@/components/StructuredData";
import {
  getOrganizationSchema,
  getServiceSchema,
  getBreadcrumbSchema,
} from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pagesMeta.about" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/a-propos`,
      languages: { fr: "/fr/a-propos", en: "/en/a-propos" },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "fr" | "en";

  return (
    <>
      <MultiStructuredData
        schemas={[
          getOrganizationSchema(),
          getServiceSchema(loc),
          getBreadcrumbSchema(
            [
              { name: loc === "fr" ? "Accueil" : "Home", href: "" },
              { name: loc === "fr" ? "A propos" : "About", href: "/a-propos" },
            ],
            loc
          ),
        ]}
      />
      <AboutContent />
      <Testimonials />
      <WorldwideShipping />
    </>
  );
}
