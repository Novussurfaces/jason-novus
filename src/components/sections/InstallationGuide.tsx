"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Pickaxe,
  Layers,
  Paintbrush,
  Timer,
  ThermometerSun,
  Droplets,
  Wind,
  AlertTriangle,
  ArrowRight,
  Phone,
  CheckCircle2,
  XCircle,
  Hammer,
  Ruler,
  Eye,
  ShieldCheck,
  Clock,
  Gauge,
  Beaker,
  Wrench,
  CircleDot,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/cn";
import { products } from "@/lib/products";
import { pricePerSqFt } from "@/lib/pricing";

/* ──────────────────────────────────────────────
   SECTION 1 — Concrete Prep step data
   ────────────────────────────────────────────── */
const prepSteps = [
  { icon: Eye, color: "#C9A84C" },
  { icon: Pickaxe, color: "#059669" },
  { icon: Wrench, color: "#0891b2" },
  { icon: Droplets, color: "#7c3aed" },
  { icon: Gauge, color: "#d97706" },
] as const;

/* ──────────────────────────────────────────────
   SECTION 2 — Application step data
   ────────────────────────────────────────────── */
const appSteps = [
  { icon: Layers, color: "#C9A84C" },
  { icon: Paintbrush, color: "#059669" },
  { icon: CircleDot, color: "#7c3aed" },
  { icon: ShieldCheck, color: "#0891b2" },
] as const;

/* ──────────────────────────────────────────────
   SECTION 4 — Optimal conditions data
   ────────────────────────────────────────────── */
const conditionIcons = [ThermometerSun, Droplets, Wind] as const;
const conditionColors = ["#059669", "#0891b2", "#7c3aed"] as const;

/* ──────────────────────────────────────────────
   SECTION 5 — Common mistakes data
   ────────────────────────────────────────────── */
const mistakeIcons = [
  AlertTriangle,
  Droplets,
  Timer,
  Ruler,
  Beaker,
] as const;
const mistakeColors = [
  "#ef4444",
  "#f59e0b",
  "#7c3aed",
  "#0891b2",
  "#d97706",
] as const;

/* ──────────────────────────────────────────────
   CURE TIME TABLE — all 14 products from products.ts
   Data pulled directly from product specs
   ────────────────────────────────────────────── */
type CureRow = {
  slug: string;
  sciCode: string;
  nameFr: string;
  nameEn: string;
  chemistry: string;
  thickness: string;
  cureTime: string;
  trafficReady: string;
  color: string;
};

const CHEMISTRY_COLORS: Record<string, string> = {
  epoxy: "#C9A84C",
  polyurea: "#7c3aed",
  polyaspartic: "#6366f1",
  quartz: "#0891b2",
  metallic: "#d97706",
  polyurethane: "#059669",
  membrane: "#6366f1",
  overlay: "#f59e0b",
  mortar: "#ef4444",
};

const cureRows: CureRow[] = products.map((p) => ({
  slug: p.slug,
  sciCode: p.sciCode,
  nameFr: p.name.fr,
  nameEn: p.name.en,
  chemistry: p.specs.chemistry,
  thickness: p.specs.thickness,
  cureTime: p.specs.cureTime,
  trafficReady: p.specs.trafficReady,
  color: CHEMISTRY_COLORS[p.category] ?? "#C9A84C",
}));

/* ──────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────── */
export function InstallationGuide() {
  const t = useTranslations("installationGuide");

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] opacity-[0.07] pointer-events-none"
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm font-medium mb-6"
            >
              <Hammer size={14} />
              {t("heroBadge")}
            </motion.div>

            <h1 className="font-[family-name:var(--font-cabinet)] text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.02em] leading-[1.1] mb-6">
              <span className="bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]">
                {t("heroTitle")}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-6">
              {t("heroSubtitle")}
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
              {[0, 1, 2].map((i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {i === 0 && <NumberTicker value={5} delay={0.3} />}
                    {i === 1 && <NumberTicker value={14} delay={0.5} />}
                    {i === 2 && <NumberTicker value={4} delay={0.7} />}
                  </div>
                  <p className="text-xs text-muted mt-1">{t(`heroStats.${i}`)}</p>
                </div>
              ))}
            </div>

            {/* Quick nav */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <a
                  key={i}
                  href={`#guide-section-${i}`}
                  className="px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-muted hover:text-accent hover:border-accent/30 transition-all duration-300"
                >
                  {t(`navLinks.${i}`)}
                </a>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 1 — Preparation du beton
          ═══════════════════════════════════════════ */}
      <section id="guide-section-0" className="py-24 md:py-32 scroll-mt-24">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-medium mb-4">
                {t("section1Badge")}
              </div>
              <h2 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] leading-tight bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]">
                {t("section1Title")}
              </h2>
              <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">
                {t("section1Subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line connector */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent hidden sm:block" />

            <div className="space-y-6">
              {prepSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <AnimatedSection key={i} delay={i * 0.1}>
                    <div className="flex gap-5 sm:gap-8 items-start">
                      {/* Number + icon */}
                      <div className="relative shrink-0">
                        <div
                          className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center relative z-10"
                          style={{
                            background: `linear-gradient(135deg, ${step.color}22, ${step.color}11)`,
                            border: `1px solid ${step.color}33`,
                          }}
                        >
                          <Icon
                            size={24}
                            style={{ color: step.color }}
                          />
                        </div>
                        <div
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center z-20"
                        >
                          {i + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <SpotlightCard className="flex-1">
                        <h3 className="font-[family-name:var(--font-cabinet)] font-bold text-lg mb-2">
                          {t(`prep.${i}.title`)}
                        </h3>
                        <p className="text-sm text-muted leading-relaxed mb-3">
                          {t(`prep.${i}.description`)}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-accent">
                          <CheckCircle2 size={14} />
                          {t(`prep.${i}.tip`)}
                        </div>
                      </SpotlightCard>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — Application etape par etape
          ═══════════════════════════════════════════ */}
      <section id="guide-section-1" className="py-24 md:py-32 relative scroll-mt-24">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, #C9A84C 0%, transparent 50%)",
          }}
        />

        <Container>
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-medium mb-4">
                {t("section2Badge")}
              </div>
              <h2 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] leading-tight bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]">
                {t("section2Title")}
              </h2>
              <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">
                {t("section2Subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {appSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <div className="relative text-center h-full">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center z-10">
                      {i + 1}
                    </div>

                    <SpotlightCard className="pt-8 h-full">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{
                          background: `linear-gradient(135deg, ${step.color}22, ${step.color}11)`,
                          border: `1px solid ${step.color}33`,
                        }}
                      >
                        <Icon size={26} style={{ color: step.color }} />
                      </div>
                      <h3 className="font-[family-name:var(--font-cabinet)] font-bold text-lg mb-2">
                        {t(`app.${i}.title`)}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed mb-3">
                        {t(`app.${i}.description`)}
                      </p>
                      <div className="space-y-1.5">
                        {[0, 1].map((j) => (
                          <div
                            key={j}
                            className="flex items-start gap-2 text-xs text-foreground/70 text-left"
                          >
                            <CheckCircle2
                              size={13}
                              className="text-accent shrink-0 mt-0.5"
                            />
                            <span>{t(`app.${i}.details.${j}`)}</span>
                          </div>
                        ))}
                      </div>
                    </SpotlightCard>

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

      {/* ═══════════════════════════════════════════
          SECTION 3 — Cure time comparison table
          ═══════════════════════════════════════════ */}
      <section id="guide-section-2" className="py-24 md:py-32 scroll-mt-24">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-medium mb-4">
                <Clock size={14} />
                {t("section3Badge")}
              </div>
              <h2 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] leading-tight bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]">
                {t("section3Title")}
              </h2>
              <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">
                {t("section3Subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <AnimatedSection delay={0.15}>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[700px] px-4 sm:px-0">
                {/* Table header */}
                <div className="grid grid-cols-[minmax(180px,2fr)_1fr_1fr_1fr_1fr] gap-px bg-white/[0.05] rounded-t-xl overflow-hidden">
                  <div className="bg-accent/10 px-4 py-3 text-xs font-bold text-accent uppercase tracking-wider">
                    {t("tableHeaders.system")}
                  </div>
                  <div className="bg-accent/10 px-4 py-3 text-xs font-bold text-accent uppercase tracking-wider text-center">
                    {t("tableHeaders.thickness")}
                  </div>
                  <div className="bg-accent/10 px-4 py-3 text-xs font-bold text-accent uppercase tracking-wider text-center">
                    {t("tableHeaders.cureTime")}
                  </div>
                  <div className="bg-accent/10 px-4 py-3 text-xs font-bold text-accent uppercase tracking-wider text-center">
                    {t("tableHeaders.trafficReady")}
                  </div>
                  <div className="bg-accent/10 px-4 py-3 text-xs font-bold text-accent uppercase tracking-wider text-center">
                    {t("tableHeaders.price")}
                  </div>
                </div>

                {/* Table body */}
                <div className="rounded-b-xl overflow-hidden border border-white/[0.08] border-t-0">
                  {cureRows.map((row, i) => {
                    const pricing = pricePerSqFt[row.slug];
                    return (
                      <div
                        key={row.slug}
                        className={cn(
                          "grid grid-cols-[minmax(180px,2fr)_1fr_1fr_1fr_1fr] gap-px transition-colors duration-200",
                          i % 2 === 0
                            ? "bg-white/[0.02]"
                            : "bg-white/[0.04]",
                          "hover:bg-accent/[0.06]"
                        )}
                      >
                        {/* System name */}
                        <div className="px-4 py-3 flex items-center gap-3">
                          <div
                            className="w-2 h-8 rounded-full shrink-0"
                            style={{ backgroundColor: row.color }}
                          />
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {row.sciCode}
                            </p>
                            <p className="text-xs text-muted">
                              {row.chemistry}
                            </p>
                          </div>
                        </div>

                        {/* Thickness */}
                        <div className="px-4 py-3 flex items-center justify-center">
                          <span className="text-sm text-foreground/80">
                            {row.thickness}
                          </span>
                        </div>

                        {/* Cure time */}
                        <div className="px-4 py-3 flex items-center justify-center">
                          <span
                            className={cn(
                              "text-sm font-medium px-2 py-0.5 rounded-full",
                              row.cureTime.includes("2-4")
                                ? "bg-green-500/10 text-green-400"
                                : row.cureTime.includes("8-12")
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-blue-500/10 text-blue-400"
                            )}
                          >
                            {row.cureTime}
                          </span>
                        </div>

                        {/* Traffic ready */}
                        <div className="px-4 py-3 flex items-center justify-center">
                          <span className="text-sm text-foreground/80">
                            {row.trafficReady}
                          </span>
                        </div>

                        {/* Price per sqft */}
                        <div className="px-4 py-3 flex items-center justify-center">
                          {pricing ? (
                            <span className="text-sm font-semibold text-accent">
                              ${pricing.min.toFixed(2)}–${pricing.max.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-sm text-muted">—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-muted mt-4">
              {t("tableDisclaimer")}
            </p>
          </AnimatedSection>

          {/* Fast cure highlight */}
          <AnimatedSection delay={0.3}>
            <div className="mt-10 max-w-3xl mx-auto">
              <SpotlightCard glowIntensity="strong">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                    <Sparkles size={28} className="text-green-400" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-[family-name:var(--font-cabinet)] font-bold text-lg mb-1">
                      {t("fastCureTitle")}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {t("fastCureDescription")}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 — Conditions optimales
          ═══════════════════════════════════════════ */}
      <section id="guide-section-3" className="py-24 md:py-32 relative scroll-mt-24">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, #C9A84C 0%, transparent 50%)",
          }}
        />

        <Container>
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-medium mb-4">
                <ThermometerSun size={14} />
                {t("section4Badge")}
              </div>
              <h2 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] leading-tight bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]">
                {t("section4Title")}
              </h2>
              <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">
                {t("section4Subtitle")}
              </p>
            </div>
          </ScrollReveal>

          {/* Condition cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            {conditionIcons.map((Icon, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <SpotlightCard className="text-center h-full">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${conditionColors[i]}22, ${conditionColors[i]}11)`,
                      border: `1px solid ${conditionColors[i]}33`,
                    }}
                  >
                    <Icon size={26} style={{ color: conditionColors[i] }} />
                  </div>
                  <h3 className="font-[family-name:var(--font-cabinet)] font-bold text-lg mb-1">
                    {t(`conditions.${i}.title`)}
                  </h3>
                  <p className="text-2xl font-bold text-accent mb-2">
                    {t(`conditions.${i}.value`)}
                  </p>
                  <p className="text-sm text-muted leading-relaxed">
                    {t(`conditions.${i}.description`)}
                  </p>
                </SpotlightCard>
              </AnimatedSection>
            ))}
          </div>

          {/* Do / Don't grid */}
          <AnimatedSection delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
              {/* Do */}
              <SpotlightCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 size={18} className="text-green-400" />
                  </div>
                  <h3 className="font-[family-name:var(--font-cabinet)] font-bold text-lg text-green-400">
                    {t("conditionsDo")}
                  </h3>
                </div>
                <div className="space-y-2">
                  {[0, 1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="flex items-start gap-2 text-sm text-foreground/70"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-green-400 shrink-0 mt-0.5"
                      />
                      <span>{t(`conditionsDoList.${j}`)}</span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>

              {/* Don't */}
              <SpotlightCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <XCircle size={18} className="text-red-400" />
                  </div>
                  <h3 className="font-[family-name:var(--font-cabinet)] font-bold text-lg text-red-400">
                    {t("conditionsDont")}
                  </h3>
                </div>
                <div className="space-y-2">
                  {[0, 1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="flex items-start gap-2 text-sm text-foreground/70"
                    >
                      <XCircle
                        size={14}
                        className="text-red-400 shrink-0 mt-0.5"
                      />
                      <span>{t(`conditionsDontList.${j}`)}</span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          </AnimatedSection>

          {/* CTA to curing conditions widget */}
          <AnimatedSection delay={0.4}>
            <div className="text-center">
              <Button href="/calculateur" variant="secondary" size="lg">
                <ThermometerSun size={16} />
                {t("conditionsCta")}
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 — Erreurs a eviter
          ═══════════════════════════════════════════ */}
      <section id="guide-section-4" className="py-24 md:py-32 scroll-mt-24">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-medium mb-4">
                <AlertTriangle size={14} />
                {t("section5Badge")}
              </div>
              <h2 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] leading-tight bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]">
                {t("section5Title")}
              </h2>
              <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">
                {t("section5Subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {mistakeIcons.map((Icon, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <SpotlightCard className="h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${mistakeColors[i]}22, ${mistakeColors[i]}11)`,
                        border: `1px solid ${mistakeColors[i]}33`,
                      }}
                    >
                      <Icon size={20} style={{ color: mistakeColors[i] }} />
                    </div>
                    <div className="text-xs font-bold text-muted uppercase tracking-wider">
                      {t("mistakeLabel")} #{i + 1}
                    </div>
                  </div>

                  <h3 className="font-[family-name:var(--font-cabinet)] font-bold text-lg mb-2">
                    {t(`mistakes.${i}.title`)}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-3">
                    {t(`mistakes.${i}.description`)}
                  </p>
                  <div className="flex items-start gap-2 text-xs text-accent bg-accent/5 p-3 rounded-xl border border-accent/10">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                    <span>{t(`mistakes.${i}.solution`)}</span>
                  </div>
                </SpotlightCard>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════
          PRODUCT RECOMMENDATIONS
          ═══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, #C9A84C 0%, transparent 50%)",
          }}
        />

        <Container>
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] leading-tight bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]">
                {t("recsTitle")}
              </h2>
              <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">
                {t("recsSubtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(["sci-flake-system", "sci-polyurea-flake-system", "sci-metallic-system"] as const).map(
              (slug, i) => {
                const product = products.find((p) => p.slug === slug);
                const pricing = pricePerSqFt[slug];
                if (!product || !pricing) return null;
                const catColor = CHEMISTRY_COLORS[product.category] ?? "#C9A84C";

                return (
                  <AnimatedSection key={slug} delay={i * 0.1}>
                    <SpotlightCard className="h-full flex flex-col">
                      <div
                        className="h-1 rounded-full mb-5"
                        style={{
                          background: `linear-gradient(90deg, ${catColor}, ${catColor}88)`,
                        }}
                      />
                      <h3 className="font-[family-name:var(--font-cabinet)] font-bold text-lg mb-1">
                        {t(`recs.${i}.name`)}
                      </h3>
                      <p className="text-xs text-muted mb-3">
                        {product.sciCode}
                      </p>
                      <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
                        {t(`recs.${i}.description`)}
                      </p>
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-xl font-bold text-accent">
                          ${pricing.min.toFixed(2)}–${pricing.max.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted">{t("perSqFt")}</span>
                      </div>
                      <Button
                        href={{ pathname: "/produits/[slug]", params: { slug } }}
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        {t("viewProduct")}
                        <ArrowRight size={14} />
                      </Button>
                    </SpotlightCard>
                  </AnimatedSection>
                );
              }
            )}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — Faites appel a un pro
          ═══════════════════════════════════════════ */}
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
                  <span className="relative z-10">{t("ctaButton")}</span>
                  <ArrowRight size={18} />
                </Button>
              </MagneticButton>
              <a
                href="tel:5813072678"
                className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 cursor-pointer whitespace-nowrap hover:scale-[1.02] active:scale-[0.98] bg-white/[0.06] backdrop-blur-xl text-foreground border border-white/[0.12] hover:border-white/[0.25] hover:bg-white/[0.10] px-9 py-4 text-base"
              >
                <Phone size={16} />
                {t("ctaPhone")}
              </a>
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
