import { setRequestLocale } from "next-intl/server";
import { FAQContent } from "@/components/sections/FAQContent";
import { MultiStructuredData } from "@/components/StructuredData";
import {
  getFAQSchema,
  getBreadcrumbSchema,
  getOrganizationSchema,
} from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "fr" | "en";

  return (
    <>
      <MultiStructuredData
        schemas={[
          getOrganizationSchema(),
          getFAQSchema(loc),
          getBreadcrumbSchema(
            [
              { name: loc === "fr" ? "Accueil" : "Home", href: "" },
              { name: "FAQ", href: "/faq" },
            ],
            loc
          ),
        ]}
      />
      <FAQContent />
    </>
  );
}
