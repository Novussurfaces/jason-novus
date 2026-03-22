"use client";

import { useTranslations } from "next-intl";
import { Globe, Ship, Plane, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";

const regions = [
  {
    key: "northAmerica",
    icon: Globe,
    gradient: "from-blue-500 to-cyan-500",
    glowColor: "rgba(37,99,235,0.15)",
    delay: "3–7",
    unit: "days",
  },
  {
    key: "europe",
    icon: Ship,
    gradient: "from-violet-500 to-purple-500",
    glowColor: "rgba(124,58,237,0.15)",
    delay: "10–21",
    unit: "days",
  },
  {
    key: "international",
    icon: Plane,
    gradient: "from-emerald-500 to-teal-500",
    glowColor: "rgba(5,150,105,0.15)",
    delay: "Custom",
    unit: "quote",
  },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
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

const shippingStyles = `
@keyframes globe-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(2.5); opacity: 0; }
}
@keyframes dot-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
`;

export function WorldwideShipping() {
  const t = useTranslations("shipping");

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: shippingStyles }} />

      {/* Background effects */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #2563eb 0%, transparent 60%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <Container className="relative z-10">
        {/* Header with animated globe */}
        <div className="text-center mb-16">
          {/* Animated globe icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-flex items-center justify-center mb-8"
          >
            {/* Rotating ring */}
            <div
              className="absolute w-24 h-24 rounded-full border border-accent/20"
              style={{ animation: "globe-rotate 20s linear infinite" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent" />
            </div>

            {/* Pulse rings */}
            <div className="absolute w-20 h-20 rounded-full border border-accent/20" style={{ animation: "pulse-ring 3s ease-out infinite" }} />
            <div className="absolute w-20 h-20 rounded-full border border-accent/20" style={{ animation: "pulse-ring 3s ease-out infinite 1s" }} />

            {/* Center globe */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 flex items-center justify-center backdrop-blur-sm">
              <Globe size={28} className="text-accent" />
            </div>
          </motion.div>

          <SectionHeader title={t("title")} subtitle={t("subtitle")} />

          {/* Origin badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-5 py-2 text-sm text-muted backdrop-blur-sm"
          >
            <MapPin size={14} className="text-accent" />
            <span>{t("origin")}</span>
            <span className="text-muted/40">→</span>
            <span className="text-accent font-medium">{t("worldwide")}</span>
          </motion.div>
        </div>

        {/* Region cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {regions.map((region) => {
            const Icon = region.icon;
            return (
              <motion.div key={region.key} variants={cardVariants}>
                <SpotlightCard className="h-full group text-center relative overflow-hidden">
                  {/* Background gradient on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(circle at 50% 30%, ${region.glowColor} 0%, transparent 60%)`,
                    }}
                  />

                  <div className="relative z-10">
                    {/* Icon with gradient bg */}
                    <div className="relative mx-auto mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${region.gradient} flex items-center justify-center mx-auto opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110`}
                        style={{ boxShadow: `0 8px 32px ${region.glowColor}` }}
                      >
                        <Icon size={28} className="text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-2">
                      {t(`regions.${region.key}`)}
                    </h3>
                    <p className="text-sm text-muted/70 leading-relaxed">
                      {t(`regions.${region.key}Desc`)}
                    </p>

                    {/* Animated connection dots */}
                    <div className="mt-6 flex items-center justify-center gap-1.5">
                      {[0, 1, 2, 3, 4].map((dot) => (
                        <div
                          key={dot}
                          className="w-1.5 h-1.5 rounded-full bg-accent/40"
                          style={{
                            animation: `dot-pulse 2s ease-in-out infinite ${dot * 0.3}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Button href="/soumission" variant="secondary" className="group">
            {t("cta")}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
