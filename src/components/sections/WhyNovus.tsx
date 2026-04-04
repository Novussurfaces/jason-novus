"use client";

import { useTranslations } from "next-intl";
import { Shield, Palette, Zap, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const features = [
  { key: "durable", icon: Shield },
  { key: "custom", icon: Palette },
  { key: "fast", icon: Zap },
  { key: "guaranteed", icon: BadgeCheck },
] as const;

export function WhyNovus() {
  const t = useTranslations("whyNovus");

  return (
    <section className="relative py-24 md:py-32">
      <Container>
        {/* Badge pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-5"
        >
          <span className="inline-flex items-center backdrop-blur-xl bg-white/[0.06] border border-white/[0.10] rounded-full px-3 py-1 text-xs text-foreground/70">
            {t("badge")}
          </span>
        </motion.div>

        {/* Section title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-center max-w-2xl mx-auto font-[family-name:var(--font-cabinet)] text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.02em] mb-14"
        >
          {t("title")}
        </motion.h2>

        {/* Bento grid — 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <SpotlightCard className="h-full border-l-2 border-l-accent/30 bg-white/[0.06]">
                  {/* Icon container */}
                  <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center">
                    <Icon size={22} className="text-accent" />
                  </div>

                  {/* Title */}
                  <h3 className="font-[family-name:var(--font-cabinet)] text-lg font-semibold mt-4 text-foreground">
                    {t(`${feature.key}.title`)}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-foreground/60 mt-2 leading-relaxed">
                    {t(`${feature.key}.description`)}
                  </p>

                  {/* Stat line */}
                  <p className="text-xs text-accent mt-4 pt-4 border-t border-white/[0.10]">
                    {t(`${feature.key}.stat`)}
                  </p>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
