import { setRequestLocale } from "next-intl/server";
import { Realisations } from "@/components/sections/Realisations";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { MultiStructuredData } from "@/components/StructuredData";
import { getBreadcrumbSchema } from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

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
