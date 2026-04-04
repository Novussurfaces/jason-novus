"use client";

import { useTranslations } from "next-intl";
import { Globe, Ship, Plane, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";

const regions = [
  { key: "northAmerica", icon: Globe },
  { key: "europe", icon: Ship },
  { key: "international", icon: Plane },
] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function WorldwideShipping() {
  const t = useTranslations("shipping");

  return (
    <section className="relative py-24 md:py-32">
      <Container>
        {/* Glass badge pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-5"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/[0.06] px-4 py-1.5 text-xs font-medium tracking-wide text-[#C9A84C] backdrop-blur-xl">
            <Package size={14} className="text-[#C9A84C]" />
            {t("badge")}
          </span>
        </motion.div>

        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        {/* Region cards — 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {regions.map((region, i) => {
            const Icon = region.icon;
            return (
              <motion.div
                key={region.key}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <SpotlightCard className="h-full text-center">
                  {/* Accent icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 mx-auto mb-5">
                    <Icon size={24} className="text-[#C9A84C]" />
                  </div>

                  <h3 className="text-foreground font-semibold text-lg font-[family-name:var(--font-cabinet)] mb-2">
                    {t(`regions.${region.key}`)}
                  </h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    {t(`regions.${region.key}Desc`)}
                  </p>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-14 text-center"
        >
          <Button href="/soumission" variant="secondary" size="md" className="group">
            {t("cta")}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
