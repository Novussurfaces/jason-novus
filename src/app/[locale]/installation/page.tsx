import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { InstallationGuide } from "@/components/sections/InstallationGuide";
import { Installation } from "@/components/sections/Installation";
import { MultiStructuredData } from "@/components/StructuredData";
import { getBreadcrumbSchema } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pagesMeta.installation" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/installation`,
      languages: { fr: "/fr/installation", en: "/en/installation" },
    },
  };
}

function getHowToSchema(locale: "fr" | "en") {
  const isFr = locale === "fr";
  const BASE_URL = "https://novusepoxy.ca";

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: isFr
      ? "Guide d'installation de revetement epoxy"
      : "Epoxy Coating Installation Guide",
    description: isFr
      ? "Guide complet etape par etape pour installer un revetement epoxy, polyurea ou quartz. Preparation, application, cure et erreurs a eviter."
      : "Complete step-by-step guide for installing an epoxy, polyurea, or quartz coating. Preparation, application, curing, and mistakes to avoid.",
    image: `${BASE_URL}/images/products/sci-flake.jpg`,
    totalTime: "PT48H",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "CAD",
      value: "2.75-11.00",
    },
    supply: [
      {
        "@type": "HowToSupply",
        name: isFr ? "Revetement epoxy/polyurea" : "Epoxy/polyurea coating",
      },
      {
        "@type": "HowToSupply",
        name: isFr ? "Appret penetrant" : "Penetrating primer",
      },
      {
        "@type": "HowToSupply",
        name: isFr ? "Flocons decoratifs ou agregat" : "Decorative flakes or aggregate",
      },
      {
        "@type": "HowToSupply",
        name: isFr ? "Couche de finition protectrice" : "Protective top coat",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: isFr ? "Meuleuse au diamant" : "Diamond grinder",
      },
      {
        "@type": "HowToTool",
        name: isFr ? "Rouleau a resine" : "Resin roller",
      },
      {
        "@type": "HowToTool",
        name: isFr ? "Test d'humidite du beton" : "Concrete moisture test",
      },
      {
        "@type": "HowToTool",
        name: isFr ? "Hygrometre" : "Hygrometer",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: isFr ? "Inspection du beton" : "Concrete Inspection",
        text: isFr
          ? "Inspectez la surface pour fissures, huile, peinture et defauts. Effectuez un test d'humidite."
          : "Inspect the surface for cracks, oil, paint, and defects. Perform a moisture test.",
        url: `${BASE_URL}/${locale}/installation#guide-section-0`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: isFr ? "Meulage de la surface" : "Surface Grinding",
        text: isFr
          ? "Meulage au diamant pour creer le profil CSP requis. Retirer tout revetement existant."
          : "Diamond grind to create the required CSP profile. Remove any existing coatings.",
        url: `${BASE_URL}/${locale}/installation#guide-section-0`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: isFr ? "Nettoyage complet" : "Thorough Cleaning",
        text: isFr
          ? "Aspirez toute poussiere. Degraissez la surface. Laissez secher completement."
          : "Vacuum all dust. Degrease the surface. Allow to dry completely.",
        url: `${BASE_URL}/${locale}/installation#guide-section-0`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: isFr ? "Application de l'appret" : "Primer Application",
        text: isFr
          ? "Appliquez l'appret penetrant epoxy pour sceller le beton et prevenir le degazage."
          : "Apply penetrating epoxy primer to seal concrete and prevent outgassing.",
        url: `${BASE_URL}/${locale}/installation#guide-section-1`,
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: isFr ? "Couche de base" : "Base Coat",
        text: isFr
          ? "Appliquez la couche de base du systeme choisi a l'epaisseur recommandee."
          : "Apply the selected system base coat at the recommended thickness.",
        url: `${BASE_URL}/${locale}/installation#guide-section-1`,
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: isFr ? "Broadcast / fini" : "Broadcast / Finish",
        text: isFr
          ? "Appliquez les flocons decoratifs, agregat quartz ou pigments metalliques selon le systeme."
          : "Apply decorative flakes, quartz aggregate, or metallic pigments depending on the system.",
        url: `${BASE_URL}/${locale}/installation#guide-section-1`,
      },
      {
        "@type": "HowToStep",
        position: 7,
        name: isFr ? "Couche de finition" : "Top Coat",
        text: isFr
          ? "Appliquez la couche de finition protectrice anti-UV. Respectez les temps de cure entre couches."
          : "Apply the UV-protective top coat. Respect cure times between coats.",
        url: `${BASE_URL}/${locale}/installation#guide-section-1`,
      },
      {
        "@type": "HowToStep",
        position: 8,
        name: isFr ? "Cure et mise en service" : "Curing and Service",
        text: isFr
          ? "Laissez curer selon les specifications du produit. Trafic pieton en 24h, vehicules en 72h."
          : "Allow to cure per product specifications. Foot traffic in 24h, vehicles in 72h.",
        url: `${BASE_URL}/${locale}/installation#guide-section-2`,
      },
    ],
  };
}

function getInstallationBreadcrumbSchema(locale: "fr" | "en") {
  const isFr = locale === "fr";
  return getBreadcrumbSchema(
    [
      { name: isFr ? "Accueil" : "Home", href: "" },
      {
        name: isFr ? "Guide d'installation" : "Installation Guide",
        href: "/installation",
      },
    ],
    locale
  );
}

function getInstallationFAQSchema(locale: "fr" | "en") {
  const isFr = locale === "fr";
  const questions = isFr
    ? [
        {
          q: "Combien de temps dure l'installation d'un plancher epoxy?",
          a: "La plupart des installations residentielles sont completees en 1-2 jours. Les systemes polyurea et polyaspartique permettent un retour en service en 24 heures. Les projets commerciaux peuvent prendre 3-5 jours.",
        },
        {
          q: "Quelle est la temperature minimale pour appliquer un revetement?",
          a: "La temperature minimale est de 10 degres C avec une humidite inferieure a 80%. Utilisez notre outil de conditions de cure pour verifier la meteo locale avant l'application.",
        },
        {
          q: "Faut-il meuler le beton avant d'appliquer l'epoxy?",
          a: "Oui. Le meulage au diamant est essentiel pour creer le profil de surface necessaire a l'adherence du revetement. C'est l'etape la plus importante de l'installation.",
        },
      ]
    : [
        {
          q: "How long does an epoxy floor installation take?",
          a: "Most residential installations are completed in 1-2 days. Polyurea and polyaspartic systems allow return to service within 24 hours. Commercial projects may take 3-5 days.",
        },
        {
          q: "What is the minimum temperature for applying a coating?",
          a: "The minimum temperature is 10 degrees C (50 degrees F) with humidity below 80%. Use our curing conditions tool to check local weather before application.",
        },
        {
          q: "Do I need to grind the concrete before applying epoxy?",
          a: "Yes. Diamond grinding is essential to create the surface profile needed for coating adhesion. It is the most important step in the installation.",
        },
      ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export default async function InstallationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "fr" | "en";

  return (
    <>
      <MultiStructuredData
        schemas={[
          getHowToSchema(loc),
          getInstallationBreadcrumbSchema(loc),
          getInstallationFAQSchema(loc),
        ]}
      />
      <InstallationGuide />
      <Installation />
    </>
  );
}
