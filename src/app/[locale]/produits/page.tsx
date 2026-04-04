import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductsCatalog } from "@/components/sections/ProductsCatalog";
import { MultiStructuredData } from "@/components/StructuredData";
import {
  getAllProductsSchema,
  getPromoOfferSchema,
  getBreadcrumbSchema,
} from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pagesMeta.products" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/produits`,
      languages: { fr: "/fr/produits", en: "/en/produits" },
    },
  };
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "fr" | "en";

  return (
    <>
      <MultiStructuredData
        schemas={[
          getAllProductsSchema(loc),
          getPromoOfferSchema(loc),
          getBreadcrumbSchema(
            [
              { name: loc === "fr" ? "Accueil" : "Home", href: "" },
              { name: loc === "fr" ? "Produits" : "Products", href: "/produits" },
            ],
            loc
          ),
        ]}
      />
      <ProductsCatalog />
    </>
  );
}
