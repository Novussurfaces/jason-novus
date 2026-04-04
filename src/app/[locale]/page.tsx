import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { WhyNovus } from "@/components/sections/WhyNovus";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Testimonials } from "@/components/sections/Testimonials";
import { WorldwideShipping } from "@/components/sections/WorldwideShipping";
import { CTASection } from "@/components/sections/CTASection";
import { MultiStructuredData } from "@/components/StructuredData";
import {
  getOrganizationSchema,
  getLocalBusinessSchema,
  getWebSiteSchema,
  getFAQSchema,
  getPromoOfferSchema,
  getBreadcrumbSchema,
} from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "fr" | "en";

  return (
    <>
      <MultiStructuredData
        schemas={[
          getOrganizationSchema(),
          getLocalBusinessSchema(),
          getWebSiteSchema(),
          getFAQSchema(loc),
          getPromoOfferSchema(loc),
          getBreadcrumbSchema(
            [{ name: loc === "fr" ? "Accueil" : "Home", href: "" }],
            loc
          ),
        ]}
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
