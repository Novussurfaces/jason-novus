import { setRequestLocale } from "next-intl/server";
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
