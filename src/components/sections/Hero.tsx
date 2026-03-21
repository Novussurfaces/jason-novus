"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { AuroraBackground } from "@/components/three/AuroraBackground";

const HeroBlob = dynamic(
  () => import("@/components/three/HeroBlob").then((m) => m.HeroBlob),
  { ssr: false }
);

const stats = [
  { end: 13, suffix: "", key: "products" },
  { end: 13, suffix: "+", key: "years" },
  { end: 100, suffix: "%", key: "coverage" },
  { end: 100, suffix: "%", key: "satisfaction" },
];

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Aurora animated background */}
      <AuroraBackground />

      {/* 3D Blob — right side on desktop */}
      <div className="absolute right-0 top-0 w-full h-full md:w-1/2 md:right-0 pointer-events-none">
        <HeroBlob />
      </div>

      <Container className="relative z-10 pt-32 pb-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              {t("badge")}
            </span>
          </motion.div>

          {/* Chrome / metallic title */}
          <motion.h1
            variants={fadeUp}
            className="mt-8 font-[family-name:var(--font-cabinet)] text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            {t("title")}{" "}
            <span
              className="relative inline-block"
              style={{
                background:
                  "linear-gradient(135deg, #e0e7ff 0%, #2563eb 25%, #60a5fa 50%, #2563eb 75%, #e0e7ff 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "chrome-shift 4s ease infinite",
              }}
            >
              {t("titleHighlight")}
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute bottom-2 left-0 h-3 bg-accent/20 rounded-full -z-10"
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg sm:text-xl text-muted max-w-2xl leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row items-start gap-4"
          >
            <Button href="/soumission" size="lg">
              {t("cta")}
              <ArrowRight size={20} />
            </Button>
            <Button href="/produits" variant="secondary" size="lg">
              {t("ctaSecondary")}
            </Button>
          </motion.div>

          {/* Stats with animated counters */}
          <motion.div
            variants={fadeUp}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border/50 pt-10"
          >
            {stats.map((stat) => (
              <div key={stat.key} className="text-center md:text-left">
                <div className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-cabinet)] text-foreground">
                  <AnimatedCounter
                    end={stat.end}
                    suffix={stat.suffix}
                    duration={2.5}
                  />
                </div>
                <div className="mt-1 text-sm text-muted">
                  {t(`stats.${stat.key}`)}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-muted/60">
            Scroll
          </span>
          <ChevronDown size={20} className="text-muted/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
