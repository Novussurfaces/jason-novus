import { setRequestLocale } from "next-intl/server";
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
