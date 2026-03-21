import { setRequestLocale } from "next-intl/server";
import { ProductsCatalog } from "@/components/sections/ProductsCatalog";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProductsCatalog />;
}
