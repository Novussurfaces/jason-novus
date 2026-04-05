import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { GymLanding } from "@/components/landing/GymLanding";
import { MultiStructuredData } from "@/components/StructuredData";
import { getLocalBusinessSchema, getFAQSchema, getBreadcrumbSchema } from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";

  return {
    title: isFr
      ? "Plancher de Gym en Epoxy | Revetement Centre d'Entrainement"
      : "Gym Epoxy Flooring | Fitness Center Floor Coating",
    description: isFr
      ? "Plancher epoxy pour gymnases et centres d'entrainement. Antiderapant, resistant aux impacts et aux equipements lourds. Soumission gratuite Quebec."
      : "Epoxy flooring for gyms and fitness centers. Anti-slip, impact resistant, handles heavy equipment. Free quote Quebec.",
    alternates: {
      canonical: `https://novusepoxy.ca/${locale}/lp/gym`,
      languages: { fr: "/fr/lp/gym", en: "/en/lp/gym" },
    },
    openGraph: {
      title: isFr ? "Plancher Gym Epoxy | Novus Epoxy" : "Gym Epoxy Floor | Novus Epoxy",
      description: isFr
        ? "Revetement de sol pour gym. Antiderapant, ultra-resistant, garantie professionnelle."
        : "Gym floor coating. Anti-slip, ultra-durable, professional warranty.",
      type: "website",
      siteName: "Novus Epoxy",
      locale: isFr ? "fr_CA" : "en_CA",
    },
  };
}

export default async function GymLandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as "fr" | "en";
  return (
    <>
      <MultiStructuredData
        schemas={[
          getLocalBusinessSchema(),
          getFAQSchema(loc),
          getBreadcrumbSchema(
            [
              { name: loc === "fr" ? "Accueil" : "Home", href: "" },
              { name: loc === "fr" ? "Plancher Gym Epoxy" : "Gym Epoxy Floor", href: "/lp/gym" },
            ],
            loc
          ),
        ]}
      />
      <GymLanding />
    </>
  );
}
