"use client";

import { useTranslations } from "next-intl";
import { Leaf, Shield, Headphones, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LampEffect } from "@/components/ui/LampEffect";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { Meteors } from "@/components/ui/Meteors";
import { NumberTicker } from "@/components/ui/NumberTicker";

const features = [
  {
    key: "madeInCanada",
    icon: Leaf,
    gradient: "from-emerald-500 to-emerald-700",
    gradientBar: "from-emerald-400 via-emerald-500 to-emerald-600",
    iconGlow: "rgba(5,150,105,0.4)",
    accent: "text-emerald-400",
    stat: 13,
    statSuffix: "+",
    statKey: "madeInCanada.stat",
    colSpan: "md:col-span-2",
  },
  {
    key: "industrial",
    icon: Shield,
    gradient: "from-blue-500 to-blue-700",
    gradientBar: "from-blue-400 via-blue-500 to-blue-600",
    iconGlow: "rgba(37,99,235,0.4)",
    accent: "text-blue-400",
    stat: 13,
    statSuffix: "+",
    statKey: "industrial.stat",
    colSpan: "",
  },
  {
    key: "expertise",
    icon: Headphones,
    gradient: "from-violet-500 to-violet-700",
    gradientBar: "from-violet-400 via-violet-500 to-violet-600",
    iconGlow: "rgba(124,58,237,0.4)",
    accent: "text-violet-400",
    stat: 24,
    statSuffix: "/7",
    statKey: "expertise.stat",
    colSpan: "",
  },
  {
    key: "delivery",
    icon: Truck,
    gradient: "from-cyan-500 to-cyan-700",
    gradientBar: "from-cyan-400 via-cyan-500 to-cyan-600",
    iconGlow: "rgba(6,182,212,0.4)",
    accent: "text-cyan-400",
    stat: 25,
    statSuffix: "+",
    statKey: "delivery.stat",
    colSpan: "md:col-span-3",
  },
] as const;

const iconHoverVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.2,
    rotate: 12,
    transition: { type: "spring" as const, stiffness: 400, damping: 12 },
  },
};

export function WhyNovus() {
  const t = useTranslations("whyNovus");

  return (
    <LampEffect className="bg-[#09090b] min-h-[700px] py-24 md:py-32">
      <Container className="relative z-10">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <div className="relative">
          {/* Background meteors */}
          <Meteors number={30} />

          <BentoGrid className="grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.key}
                  initial="rest"
                  whileHover="hover"
                  className={`${feature.colSpan} group`}
                >
                  <BentoGridItem
                    title={t(`${feature.key}.title`)}
                    description={t(`${feature.key}.description`)}
                    className="relative overflow-hidden bg-[#09090b]/80 border-white/[0.06] backdrop-blur-sm hover:border-white/[0.12] transition-all duration-500 h-full"
                    icon={
                      <motion.div
                        variants={iconHoverVariants}
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                        style={{
                          boxShadow: `0 0 20px ${feature.iconGlow}`,
                        }}
                      >
                        <Icon size={20} className="text-white" />
                      </motion.div>
                    }
                    header={
                      <>
                        {/* Gradient accent bar at top */}
                        <div
                          className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.gradientBar} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                        />

                        {/* Stat with NumberTicker */}
                        <div className="flex items-center gap-3 py-3">
                          <span
                            className={`text-3xl font-bold font-[family-name:var(--font-cabinet)] ${feature.accent}`}
                          >
                            <NumberTicker
                              value={feature.stat}
                              suffix={feature.statSuffix as string}
                              delay={0.5}
                              className={feature.accent}
                            />
                          </span>
                          <span className="text-sm text-muted/60 uppercase tracking-wider">
                            {t(feature.statKey)}
                          </span>
                        </div>

                        {/* Subtle glow effect on hover */}
                        <div
                          className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                          style={{
                            background: `radial-gradient(circle, ${feature.iconGlow} 0%, transparent 70%)`,
                          }}
                        />
                      </>
                    }
                  />
                </motion.div>
              );
            })}
          </BentoGrid>
        </div>
      </Container>
    </LampEffect>
  );
}
