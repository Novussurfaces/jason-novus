"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AuroraBackground } from "@/components/three/AuroraBackground";
import { cn } from "@/lib/cn";

/* ── Premium cubic-bezier: Apple-style deceleration ── */
const premiumEase = [0.22, 1, 0.36, 1] as const;

/* ── Stagger orchestrator ── */
const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

/* ── Badge: fade in first with blur-to-clear ── */
const badgeVariant = {
  hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, delay: 0.2, ease: premiumEase },
  },
};

/* ── Headline: dramatic slide-up with blur ── */
const headlineVariant = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, delay: 0.4, ease: premiumEase },
  },
};

/* ── Subtitle: gentler slide-up ── */
const subtitleVariant = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: 0.6, ease: premiumEase },
  },
};

/* ── CTAs: scale + fade ── */
const ctaVariant = {
  hidden: { opacity: 0, y: 16, scale: 0.95, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, delay: 0.8, ease: premiumEase },
  },
};

/* ── HERO ── */
export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background py-32 md:py-40">
      {/* Aurora animated background */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <AuroraBackground />
      </div>

      {/* Bottom gradient overlay — seamless transition to next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-b from-transparent to-background"
        aria-hidden="true"
      />

      {/* Content */}
      <Container className="relative z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          {/* ── Glass floating badge ── */}
          <motion.div variants={badgeVariant} className="flex justify-center mb-10">
            <div
              className={cn(
                "inline-flex items-center gap-2",
                "rounded-full px-3.5 py-1",
                "backdrop-blur-xl bg-white/[0.06]",
                "border border-white/[0.08]",
                "text-xs text-foreground/70 font-medium tracking-wide"
              )}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
              {t("badge")}
            </div>
          </motion.div>

          {/* ── Headline — premium gradient text ── */}
          <motion.h1
            variants={headlineVariant}
            className={cn(
              "font-[family-name:var(--font-cabinet)]",
              "text-[clamp(2.8rem,7vw,5.5rem)]",
              "font-bold leading-[1.02] tracking-[-0.03em]",
              "bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent",
              "drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]"
            )}
          >
            {t("title")}
          </motion.h1>

          {/* ── Subtitle ── */}
          <motion.p
            variants={subtitleVariant}
            className="mx-auto mt-8 max-w-2xl text-base md:text-lg text-foreground/60 leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>

          {/* ── CTAs ── */}
          <motion.div
            variants={ctaVariant}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button href="/soumission" size="lg" className="group">
              {t("cta")}
              <ArrowRight
                size={18}
                className="ml-1 transition-transform group-hover:translate-x-1"
              />
            </Button>

            <Button href="/realisations" variant="secondary" size="lg" className="group">
              {t("ctaSecondary")}
              <ArrowRight
                size={18}
                className="ml-1 transition-transform group-hover:translate-x-1"
              />
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
