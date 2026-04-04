import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { products, getProductBySlug } from "@/lib/products";
import { ProductDetail } from "@/components/sections/ProductDetail";
import { MultiStructuredData } from "@/components/StructuredData";
import { getProductSchema, getFAQSchema, getBreadcrumbSchema } from "@/lib/structured-data";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const loc = locale as "fr" | "en";
  return {
    title: product.name[loc],
    description: product.shortDescription[loc],
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const loc = locale as "fr" | "en";

  return (
    <>
      <MultiStructuredData
        schemas={[
          getProductSchema(product, loc),
          getFAQSchema(loc),
          getBreadcrumbSchema(
            [
              { name: loc === "fr" ? "Accueil" : "Home", href: "" },
              { name: loc === "fr" ? "Produits" : "Products", href: "/produits" },
              { name: product.name[loc], href: `/produits/${product.slug}` },
            ],
            loc
          ),
        ]}
      />
      <ProductDetail product={product} />
    </>
  );
}
