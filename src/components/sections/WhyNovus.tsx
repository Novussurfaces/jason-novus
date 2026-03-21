"use client";

import { useTranslations } from "next-intl";
import { Leaf, Shield, Headphones, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const features = [
  {
    key: "madeInCanada",
    icon: Leaf,
    gradient: "from-emerald-500/20 to-emerald-600/5",
    iconGlow: "rgba(5,150,105,0.3)",
    accent: "text-emerald-400",
  },
  {
    key: "industrial",
    icon: Shield,
    gradient: "from-blue-500/20 to-blue-600/5",
    iconGlow: "rgba(37,99,235,0.3)",
    accent: "text-blue-400",
  },
  {
    key: "expertise",
    icon: Headphones,
    gradient: "from-violet-500/20 to-violet-600/5",
    iconGlow: "rgba(124,58,237,0.3)",
    accent: "text-violet-400",
  },
  {
    key: "delivery",
    icon: Truck,
    gradient: "from-cyan-500/20 to-cyan-600/5",
    iconGlow: "rgba(6,182,212,0.3)",
    accent: "text-cyan-400",
  },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function WhyNovus() {
  const t = useTranslations("whyNovus");

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/80 to-surface" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <Container className="relative z-10">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.key} variants={cardVariants}>
                <SpotlightCard className="h-full group">
                  {/* Icon container with gradient glow */}
                  <div className="relative mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center border border-white/[0.06] transition-all duration-500 group-hover:scale-110`}
                    >
                      <Icon size={26} className={`${feature.accent} transition-all duration-300`} />
                    </div>
                    {/* Glow behind icon on hover */}
                    <div
                      className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                      style={{
                        background: `radial-gradient(circle, ${feature.iconGlow} 0%, transparent 70%)`,
                        filter: "blur(12px)",
                      }}
                    />
                  </div>

                  <h3 className="text-lg font-semibold mb-3 group-hover:text-foreground transition-colors">
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted/70 leading-relaxed">
                    {t(`${feature.key}.description`)}
                  </p>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
