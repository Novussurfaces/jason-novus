"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Layers,
  Paintbrush,
  ShieldCheck,
  Timer,
  ChevronDown,
  ArrowRight,
  Phone,
  ClipboardCheck,
  Hammer,
  Droplets,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/cn";

/* ── Pricing systems data ── */
const systems = [
  { key: "flake", sciCode: "SCI-Flake", priceMin: 8, priceMax: 8, color: "#059669" },
  { key: "metallic", sciCode: "SCI-Metallic", priceMin: 10, priceMax: 15, color: "#d97706" },
  { key: "polyurea", sciCode: "SCI-Polyurea", priceMin: 9, priceMax: 12, color: "#7c3aed" },
  { key: "solidEpoxy", sciCode: "SCI-100", priceMin: 7, priceMax: 10, color: "#C9A84C" },
  { key: "quartz", sciCode: "SCI-Quartz", priceMin: 8, priceMax: 11, color: "#0891b2" },
  { key: "membrane", sciCode: "SCI-Membrane", priceMin: 10, priceMax: 14, color: "#6366f1" },
] as const;

/* ── Process steps icons ── */
const processIcons = [ClipboardCheck, Hammer, Droplets, Clock] as const;

/* ── What's included icons ── */
const includedIcons = [Layers, Paintbrush, Layers, ShieldCheck, Sparkles] as const;

/* ── FAQ Accordion ── */
function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <AnimatedSection delay={index * 0.05}>
      <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-white/[0.02]">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer group"
        >
          <span className="font-medium text-foreground group-hover:text-accent transition-colors pr-4">
            {question}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown size={18} className="text-muted shrink-0" />
          </motion.div>
        </button>
        <motion.div
          initial={false}
          animate={{
            height: open ? "auto" : 0,
            opacity: open ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <p className="px-6 pb-5 text-sm text-muted leading-relaxed">
            {answer}
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

export function Installation() {
  const t = useTranslations("installation");

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.08] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, #C9A84C 0%, transparent 70%)",
          }}
        />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm font-medium mb-6"
            >
              <Timer size={14} />
              {t("badge")}
            </motion.div>

            {/* Title with gradient */}
            <h1 className="font-[family-name:var(--font-cabinet)] text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.02em] leading-[1.1] mb-6">
              <span className="bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]">
                {t("title")}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-10">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <Button href="/soumission" size="lg">
                  <span className="relative z-10">{t("cta")}</span>
                  <ArrowRight size={18} />
                </Button>
              </MagneticButton>
              <Button href="/calculateur" variant="secondary" size="lg">
                {t("ctaSecondary")}
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Pricing Grid ── */}
      <section className="py-24 md:py-32">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] leading-tight bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]">
              {t("pricingTitle")}
            </h2>
            <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">
              {t("pricingSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map((sys, i) => (
              <AnimatedSection key={sys.key} delay={i * 0.08}>
                <SpotlightCard className="h-full">
                  {/* Color bar top */}
                  <div
                    className="h-1 rounded-full mb-5"
                    style={{
                      background: `linear-gradient(90deg, ${sys.color}, ${sys.color}88)`,
                    }}
                  />

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-[family-name:var(--font-cabinet)] text-lg font-bold">
                        {t(`systems.${sys.key}.name`)}
                      </h3>
                      <p className="text-xs text-muted mt-0.5">{sys.sciCode}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-2xl font-bold text-accent">
                          ${sys.priceMin}
                          {sys.priceMin !== sys.priceMax && (
                            <>–${sys.priceMax}</>
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-muted">{t("perSqFt")}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted leading-relaxed mb-5">
                    {t(`systems.${sys.key}.description`)}
                  </p>

                  {/* Includes mini-list */}
                  <div className="space-y-2">
                    {[0, 1, 2].map((j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2 text-xs text-foreground/70"
                      >
                        <CheckCircle2
                          size={14}
                          className="text-accent shrink-0"
                        />
                        {t(`systems.${sys.key}.includes.${j}`)}
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.3}>
            <p className="text-center text-sm text-muted mt-8">
              {t("pricingDisclaimer")}
            </p>
          </AnimatedSection>
        </Container>
      </section>

      {/* ── What's Included ── */}
      <section className="py-24 md:py-32 relative">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, #C9A84C 0%, transparent 50%)",
          }}
        />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] leading-tight bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]">
              {t("includedTitle")}
            </h2>
            <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">
              {t("includedSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[0, 1, 2, 3, 4].map((i) => {
              const Icon = includedIcons[i];
              return (
                <AnimatedSection key={i} delay={i * 0.08}>
                  <div className="text-center p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-accent/20 hover:bg-accent/[0.03] transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <Icon size={22} className="text-accent" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">
                      {t(`included.${i}.title`)}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {t(`included.${i}.description`)}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Process Section ── */}
      <section className="py-24 md:py-32">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] leading-tight bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]">
              {t("processTitle")}
            </h2>
            <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">
              {t("processSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[0, 1, 2, 3].map((i) => {
              const Icon = processIcons[i];
              return (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <div className="relative text-center">
                    {/* Step number */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center z-10">
                      {i + 1}
                    </div>

                    <SpotlightCard className="pt-8">
                      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                        <Icon size={26} className="text-accent" />
                      </div>
                      <h3 className="font-[family-name:var(--font-cabinet)] font-bold text-lg mb-2">
                        {t(`process.${i}.title`)}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">
                        {t(`process.${i}.description`)}
                      </p>
                    </SpotlightCard>

                    {/* Connector line (hidden on last + mobile) */}
                    {i < 3 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-accent/40 to-transparent" />
                    )}
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-24 md:py-32 relative">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, #C9A84C 0%, transparent 50%)",
          }}
        />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] leading-tight bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]">
              {t("faqTitle")}
            </h2>
            <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">
              {t("faqSubtitle")}
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <FAQItem
                key={i}
                question={t(`faq.${i}.question`)}
                answer={t(`faq.${i}.answer`)}
                index={i}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, #C9A84C 0%, transparent 60%)",
          }}
        />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] leading-tight mb-4 bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]">
              {t("ctaTitle")}
            </h2>
            <p className="text-lg text-foreground/60 mb-8">
              {t("ctaSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <MagneticButton>
                <Button href="/soumission" size="lg">
                  <span className="relative z-10">{t("cta")}</span>
                  <ArrowRight size={18} />
                </Button>
              </MagneticButton>
              <Button variant="secondary" size="lg" href="/contact">
                <Phone size={16} />
                {t("ctaCall")}
              </Button>
            </div>

            <p className="text-sm text-muted">
              {t("ctaTrust")}
            </p>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
