"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const REVIEW_COUNT = 12;

type Category = "all" | "residential" | "commercial" | "industrial";

const FILTER_KEYS: { key: Category; label: string }[] = [
  { key: "all", label: "filterAll" },
  { key: "residential", label: "filterResidential" },
  { key: "commercial", label: "filterCommercial" },
  { key: "industrial", label: "filterIndustrial" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={15}
          className={cn(
            i < rating ? "text-[#C9A84C] fill-[#C9A84C]" : "text-white/20"
          )}
        />
      ))}
    </div>
  );
}

export function ReviewsContent() {
  const t = useTranslations("reviews");
  const [activeFilter, setActiveFilter] = useState<Category>("all");

  const reviews = Array.from({ length: REVIEW_COUNT }, (_, i) => ({
    quote: t(`item${i + 1}.quote`),
    name: t(`item${i + 1}.name`),
    city: t(`item${i + 1}.city`),
    category: t(`item${i + 1}.category`) as Category,
    project: t(`item${i + 1}.project`),
    rating: Number(t(`item${i + 1}.rating`)),
  }));

  const filtered =
    activeFilter === "all"
      ? reviews
      : reviews.filter((r) => r.category === activeFilter);

  return (
    <main className="relative pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 1000,
          height: 600,
          background:
            "radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 70%)",
        }}
      />

      <Container className="relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-5"
        >
          <span className="inline-flex items-center backdrop-blur-xl bg-white/[0.06] border border-white/[0.10] rounded-full px-3 py-1 text-xs text-foreground/70">
            {t("badge")}
          </span>
        </motion.div>

        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        {/* Stats Bar */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto mb-14">
            <div className="text-center rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl py-5 px-4">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star size={18} className="text-[#C9A84C] fill-[#C9A84C]" />
                <span className="text-2xl font-bold font-[family-name:var(--font-cabinet)] text-foreground">
                  <NumberTicker value={4} suffix=".9/5" delay={0.2} />
                </span>
              </div>
              <p className="text-xs text-foreground/50">{t("statsAverageLabel")}</p>
            </div>

            <div className="text-center rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl py-5 px-4">
              <span className="text-2xl font-bold font-[family-name:var(--font-cabinet)] text-foreground">
                <NumberTicker value={50} suffix="+" delay={0.4} />
              </span>
              <p className="text-xs text-foreground/50 mt-1">{t("statsCountLabel")}</p>
            </div>

            <div className="text-center rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl py-5 px-4">
              <span className="text-2xl font-bold font-[family-name:var(--font-cabinet)] text-foreground">
                <NumberTicker value={98} suffix="%" delay={0.6} />
              </span>
              <p className="text-xs text-foreground/50 mt-1">
                {t("statsSatisfactionLabel")}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Category Filters */}
        <ScrollReveal delay={0.15}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {FILTER_KEYS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer",
                  activeFilter === key
                    ? "bg-accent text-white shadow-[0_0_20px_rgba(201,168,76,0.3)]"
                    : "bg-white/[0.06] text-foreground/60 border border-white/[0.08] hover:bg-white/[0.10] hover:text-foreground"
                )}
              >
                {t(label)}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((review, i) => (
              <motion.div
                key={`${review.name}-${review.city}`}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.05,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <SpotlightCard className="h-full">
                  <div className="flex flex-col h-full">
                    {/* Star rating */}
                    <StarRating rating={review.rating} />

                    {/* Quote */}
                    <blockquote className="mt-4 flex-1">
                      <p className="text-sm leading-relaxed text-foreground/70">
                        &ldquo;{review.quote}&rdquo;
                      </p>
                    </blockquote>

                    {/* Project type badge */}
                    <div className="mt-4 mb-4">
                      <span className="inline-block text-[11px] font-medium text-accent/80 bg-accent/[0.08] border border-accent/[0.15] rounded-full px-2.5 py-0.5">
                        {review.project}
                      </span>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                      <div className="h-9 w-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-accent">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {review.name}
                        </p>
                        <p className="text-xs text-foreground/50">
                          {review.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <ScrollReveal delay={0.2} className="mt-20 md:mt-28">
          <div className="relative text-center max-w-2xl mx-auto">
            {/* Glow behind CTA */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 500,
                height: 300,
                background:
                  "radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)",
              }}
            />

            <h2 className="relative font-[family-name:var(--font-cabinet)] text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold tracking-[-0.02em] leading-tight bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
              {t("ctaTitle")}
            </h2>
            <p className="relative mt-4 text-foreground/60 text-lg">
              {t("ctaSubtitle")}
            </p>
            <div className="relative mt-8">
              <MagneticButton>
                <Button href="/soumission" size="lg">
                  {t("ctaButton")}
                  <ArrowRight size={18} />
                </Button>
              </MagneticButton>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </main>
  );
}
