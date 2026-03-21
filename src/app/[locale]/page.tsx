import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { WhyNovus } from "@/components/sections/WhyNovus";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Testimonials } from "@/components/sections/Testimonials";
import { WorldwideShipping } from "@/components/sections/WorldwideShipping";
import { CTASection } from "@/components/sections/CTASection";
import { StructuredData } from "@/components/StructuredData";
import { getOrganizationSchema, getBreadcrumbSchema } from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <StructuredData data={getOrganizationSchema()} />
      <StructuredData
        data={getBreadcrumbSchema(
          [{ name: locale === "fr" ? "Accueil" : "Home", href: "" }],
          locale as "fr" | "en"
        )}
      />
      <Hero />
      <TrustBar />
      <FeaturedProducts />
      <WhyNovus />
      <BeforeAfter />
      <Testimonials />
      <WorldwideShipping />
      <CTASection />
    </>
  );
}
