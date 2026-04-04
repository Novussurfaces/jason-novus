"use client";

import { useTranslations } from "next-intl";
import { MapPin, Clock, Award, Shield, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CTASection } from "@/components/sections/CTASection";

const values = [
  { key: "quality", icon: Shield },
  { key: "service", icon: Users },
  { key: "innovation", icon: Sparkles },
] as const;

export function AboutContent() {
  const t = useTranslations("about");

  return (
    <>
      <section className="pt-16 pb-24">
        <Container>
          <SectionHeader title={t("title")} subtitle={t("subtitle")} />

          {/* Story */}
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
                <h2 className="font-[family-name:var(--font-cabinet)] text-2xl font-bold mb-6">
                  {t("story.title")}
                </h2>
                <p className="text-muted leading-relaxed mb-4">{t("story.p1")}</p>
                <p className="text-muted leading-relaxed">{t("story.p2")}</p>
              </div>
            </AnimatedSection>

            {/* Partnership */}
            <AnimatedSection delay={0.1} className="mt-8">
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 md:p-12">
                <h2 className="font-[family-name:var(--font-cabinet)] text-2xl font-bold mb-4">
                  {t("partnership.title")}
                </h2>
                <p className="text-muted leading-relaxed mb-6">
                  {t("partnership.description")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 rounded-xl bg-background/50 px-4 py-3">
                    <MapPin size={20} className="text-accent shrink-0" />
                    <span className="text-sm font-medium">{t("partnership.location")}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-background/50 px-4 py-3">
                    <Clock size={20} className="text-accent shrink-0" />
                    <span className="text-sm font-medium">{t("partnership.experience")}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-background/50 px-4 py-3">
                    <Award size={20} className="text-accent shrink-0" />
                    <span className="text-sm font-medium">{t("partnership.madeIn")}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Values */}
            <div className="mt-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-[family-name:var(--font-cabinet)] text-2xl font-bold text-center mb-8"
              >
                {t("valuesHeading")}
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {values.map((v, i) => {
                  const Icon = v.icon;
                  return (
                    <AnimatedSection key={v.key} delay={i * 0.1}>
                      <div className="rounded-2xl border border-border bg-card p-6 h-full text-center">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                          <Icon size={24} className="text-accent" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {t(`values.${v.key}.title`)}
                        </h3>
                        <p className="text-sm text-muted leading-relaxed">
                          {t(`values.${v.key}.description`)}
                        </p>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
