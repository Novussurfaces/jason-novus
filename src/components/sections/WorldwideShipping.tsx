"use client";

import { useTranslations } from "next-intl";
import { Globe, Ship, Plane } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";

const regions = [
  { key: "northAmerica", icon: Globe },
  { key: "europe", icon: Ship },
  { key: "international", icon: Plane },
] as const;

export function WorldwideShipping() {
  const t = useTranslations("shipping");

  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regions.map((region, i) => {
            const Icon = region.icon;
            return (
              <AnimatedSection key={region.key} delay={i * 0.12}>
                <SpotlightCard className="h-full text-center">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                    <Icon size={28} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t(`regions.${region.key}`)}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {t(`regions.${region.key}Desc`)}
                  </p>
                </SpotlightCard>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection className="mt-10 text-center">
          <Button href="/soumission" variant="secondary">
            {t("cta")}
          </Button>
        </AnimatedSection>
      </Container>
    </section>
  );
}
