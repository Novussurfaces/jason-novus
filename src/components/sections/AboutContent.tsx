"use client";

import { useTranslations } from "next-intl";
import {
  MapPin,
  Clock,
  Award,
  Shield,
  Sparkles,
  Users,
  Gem,
  Factory,
  FlaskConical,
  Globe,
  Truck,
  ArrowRight,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const values = [
  { key: "quality", icon: Shield },
  { key: "innovation", icon: Sparkles },
  { key: "service", icon: Users },
  { key: "durability", icon: Gem },
] as const;

const teamMembers = [
  { key: "jason", initials: "JL", gradient: "from-accent/80 to-amber-700" },
  { key: "michael", initials: "M", gradient: "from-blue-500 to-indigo-700" },
  { key: "luca", initials: "L", gradient: "from-emerald-500 to-teal-700" },
] as const;

const timelineKeys = [
  "founding",
  "expansion",
  "novus",
  "international",
  "future",
] as const;

const coverageZones = [
  { key: "quebec", icon: MapPin, ring: "ring-accent/40" },
  { key: "canada", icon: Truck, ring: "ring-blue-500/40" },
  { key: "northAmerica", icon: Globe, ring: "ring-indigo-500/40" },
  { key: "worldwide", icon: Globe, ring: "ring-emerald-500/40" },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AboutContent() {
  const t = useTranslations("about");

  return (
    <>
      {/* ─── Hero / Title ───────────────────────────────────── */}
      <section className="pt-16 pb-12">
        <Container>
          <SectionHeader
            title={t("title")}
            subtitle={t("subtitle")}
            gradient
          />
        </Container>
      </section>

      {/* ─── Stats Bar ──────────────────────────────────────── */}
      <section className="py-8">
        <Container>
          <ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { value: 500, suffix: "+", label: t("stats.projects") },
                { value: 13, suffix: "", label: t("stats.systems") },
                { value: 15, suffix: "+", label: t("stats.experience") },
                { value: 0, suffix: "", label: t("stats.shipping"), isText: true },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center rounded-2xl border border-border bg-card p-6"
                >
                  {"isText" in stat && stat.isText ? (
                    <span className="font-[family-name:var(--font-cabinet)] text-3xl md:text-4xl font-bold text-accent">
                      {stat.label}
                    </span>
                  ) : (
                    <>
                      <NumberTicker
                        value={stat.value}
                        suffix={stat.suffix}
                        delay={0.2 + i * 0.1}
                        className="font-[family-name:var(--font-cabinet)] text-3xl md:text-4xl font-bold text-accent"
                      />
                      <p className="mt-2 text-sm text-muted">{stat.label}</p>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ─── Company Story ──────────────────────────────────── */}
      <section className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <SpotlightCard className="p-8 md:p-12">
                <h2 className="font-[family-name:var(--font-cabinet)] text-2xl font-bold mb-6">
                  {t("story.title")}
                </h2>
                <p className="text-muted leading-relaxed mb-4">
                  {t("story.p1")}
                </p>
                <p className="text-muted leading-relaxed mb-4">
                  {t("story.p2")}
                </p>
                <p className="text-muted leading-relaxed">{t("story.p3")}</p>
              </SpotlightCard>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* ─── Manufacturing Partnership ──────────────────────── */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <SectionHeader
                title={t("partnership.title")}
                subtitle={t("partnership.subtitle")}
              />
            </ScrollReveal>

            <AnimatedSection delay={0.1}>
              <SpotlightCard
                className="p-8 md:p-12 border-accent/20"
                glowIntensity="strong"
              >
                <p className="text-muted leading-relaxed mb-4">
                  {t("partnership.description")}
                </p>
                <p className="text-muted leading-relaxed mb-8">
                  {t("partnership.description2")}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { icon: MapPin, label: t("partnership.location") },
                    { icon: Clock, label: t("partnership.experience") },
                    { icon: Award, label: t("partnership.madeIn") },
                    { icon: Factory, label: t("partnership.factory") },
                    { icon: FlaskConical, label: t("partnership.rd") },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="flex items-center gap-3 rounded-xl bg-background/50 px-4 py-3"
                      >
                        <Icon size={18} className="text-accent shrink-0" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </SpotlightCard>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* ─── Team ───────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              title={t("team.title")}
              subtitle={t("team.subtitle")}
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member, i) => (
              <AnimatedSection key={member.key} delay={i * 0.15}>
                <SpotlightCard className="h-full text-center p-8">
                  {/* Gradient avatar */}
                  <div
                    className={cn(
                      "w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center bg-gradient-to-br shadow-lg",
                      member.gradient
                    )}
                  >
                    <span className="text-2xl font-bold text-white select-none">
                      {member.initials}
                    </span>
                  </div>

                  <h3 className="font-[family-name:var(--font-cabinet)] text-lg font-semibold">
                    {t(`team.${member.key}.name`)}
                  </h3>
                  <p className="text-sm text-accent font-medium mt-1">
                    {t(`team.${member.key}.role`)}
                  </p>
                  <p className="text-sm text-muted mt-3 leading-relaxed">
                    {t(`team.${member.key}.bio`)}
                  </p>
                </SpotlightCard>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Values ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              title={t("valuesHeading")}
              subtitle={t("valuesSubtitle")}
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <AnimatedSection key={v.key} delay={i * 0.1}>
                  <SpotlightCard className="h-full text-center p-6">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <Icon size={26} className="text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t(`values.${v.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {t(`values.${v.key}.description`)}
                    </p>
                  </SpotlightCard>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── Coverage Map ───────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              title={t("coverage.title")}
              subtitle={t("coverage.subtitle")}
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {coverageZones.map((zone, i) => {
              const Icon = zone.icon;
              const labelKey = zone.key as string;
              const descKey = `${zone.key}Desc` as string;
              return (
                <AnimatedSection key={zone.key} delay={i * 0.12}>
                  <div
                    className={cn(
                      "rounded-2xl border border-border bg-card p-6 h-full text-center ring-1",
                      zone.ring
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
                      <Icon size={22} className="text-foreground/80" />
                    </div>
                    <h3 className="font-[family-name:var(--font-cabinet)] text-lg font-semibold mb-2">
                      {t(`coverage.${labelKey}`)}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {t(`coverage.${descKey}`)}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── Timeline ───────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              title={t("timeline.title")}
              subtitle={t("timeline.subtitle")}
            />
          </ScrollReveal>

          <div className="max-w-2xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border" />

            {timelineKeys.map((key, i) => (
              <AnimatedSection key={key} delay={i * 0.12}>
                <div className="relative pl-16 md:pl-20 pb-10 last:pb-0">
                  {/* Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: i * 0.12,
                    }}
                    className="absolute left-[17px] md:left-[25px] top-1 w-4 h-4 rounded-full border-2 border-accent bg-background"
                  />

                  <span className="inline-block rounded-full bg-accent/10 text-accent text-xs font-bold px-3 py-1 mb-2">
                    {t(`timeline.items.${key}.year`)}
                  </span>
                  <h3 className="font-[family-name:var(--font-cabinet)] text-lg font-semibold">
                    {t(`timeline.items.${key}.title`)}
                  </h3>
                  <p className="text-sm text-muted mt-1 leading-relaxed">
                    {t(`timeline.items.${key}.description`)}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── About CTA ──────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="relative max-w-3xl mx-auto">
            {/* Background glow */}
            <div
              className="pointer-events-none absolute inset-0 -inset-x-16 -inset-y-12"
              aria-hidden="true"
            >
              <div className="h-full w-full rounded-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.06)_0%,_transparent_70%)]" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden backdrop-blur-2xl bg-white/[0.04] border border-white/[0.08] rounded-3xl p-12 md:p-16 text-center"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="font-[family-name:var(--font-cabinet)] text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold text-gradient-accent"
              >
                {t("aboutCta.title")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-4 text-foreground/60 max-w-md mx-auto"
              >
                {t("aboutCta.subtitle")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <MagneticButton>
                  <Button href="/soumission" size="lg" variant="primary">
                    {t("aboutCta.button")}
                    <ArrowRight size={18} />
                  </Button>
                </MagneticButton>

                <a
                  href="tel:5813072678"
                  className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors"
                >
                  <Phone size={16} />
                  {t("aboutCta.phone")}
                </a>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
}
