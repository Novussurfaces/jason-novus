"use client";

import { useTranslations } from "next-intl";
import { Leaf, Shield, Headphones, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const features = [
  { key: "madeInCanada", icon: Leaf },
  { key: "industrial", icon: Shield },
  { key: "expertise", icon: Headphones },
  { key: "delivery", icon: Truck },
] as const;

export function WhyNovus() {
  const t = useTranslations("whyNovus");

  return (
    <section className="py-24 md:py-32 bg-surface">
      <Container>
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection key={feature.key} delay={i * 0.1}>
                <SpotlightCard className="h-full">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Icon size={24} className="text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {t(`${feature.key}.description`)}
                  </p>
                </SpotlightCard>
              </AnimatedSection>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
