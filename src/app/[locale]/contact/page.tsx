import { setRequestLocale } from "next-intl/server";
import { ContactContent } from "@/components/sections/ContactContent";
import { StructuredData } from "@/components/StructuredData";
import { getLocalBusinessSchema, getBreadcrumbSchema } from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <StructuredData data={getLocalBusinessSchema()} />
      <StructuredData
        data={getBreadcrumbSchema(
          [
            { name: locale === "fr" ? "Accueil" : "Home", href: "" },
            { name: "Contact", href: "/contact" },
          ],
          locale as "fr" | "en"
        )}
      />
      <ContactContent />
    </>
  );
}
