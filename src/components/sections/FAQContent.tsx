"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, ArrowRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/cn";

const FAQ_KEYS = [
  "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9",
  "q10", "q11", "q12", "q13", "q14", "q15", "q16", "q17",
] as const;

const CATEGORY_KEYS = [
  "all", "pricing", "installation", "durability", "maintenance",
  "shipping", "products", "promo", "process", "warranty", "diy",
] as const;

type CategoryKey = (typeof CATEGORY_KEYS)[number];

function FAQItem({
  questionKey,
  isOpen,
  onToggle,
  delay,
}: {
  questionKey: string;
  isOpen: boolean;
  onToggle: () => void;
  delay: number;
}) {
  const t = useTranslations("faq.items");

  return (
    <ScrollReveal delay={delay}>
      <SpotlightCard className="mb-4">
        <button
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-4 text-left cursor-pointer"
          aria-expanded={isOpen}
        >
          <span className="font-[family-name:var(--font-cabinet)] text-base sm:text-lg font-semibold leading-snug pr-2">
            {t(`${questionKey}.question`)}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mt-1 shrink-0"
          >
            <ChevronDown
              size={20}
              className={cn(
                "transition-colors duration-300",
                isOpen ? "text-[#C9A84C]" : "text-foreground/40"
              )}
            />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-white/[0.06] mt-4">
                <p className="text-foreground/60 leading-relaxed text-sm sm:text-base">
                  {t(`${questionKey}.answer`)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SpotlightCard>
    </ScrollReveal>
  );
}

export function FAQContent() {
  const t = useTranslations("faq");
  const tItems = useTranslations("faq.items");

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredKeys = useMemo(() => {
    return FAQ_KEYS.filter((key) => {
      const category = tItems(`${key}.category`);
      const matchesCategory =
        activeCategory === "all" || category === activeCategory;

      if (!searchQuery.trim()) return matchesCategory;

      const query = searchQuery.toLowerCase();
      const question = tItems(`${key}.question`).toLowerCase();
      const answer = tItems(`${key}.answer`).toLowerCase();
      return matchesCategory && (question.includes(query) || answer.includes(query));
    });
  }, [activeCategory, searchQuery, tItems]);

  function handleToggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  function handleCategoryChange(category: CategoryKey) {
    setActiveCategory(category);
    setOpenIndex(null);
    setSearchQuery("");
  }

  return (
    <>
      {/* Hero header */}
      <section className="pt-16 pb-12">
        <Container>
          <SectionHeader
            title={t("title")}
            subtitle={t("subtitle")}
            gradient
          />

          {/* Search */}
          <ScrollReveal delay={0.1}>
            <div className="max-w-xl mx-auto mb-10">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setOpenIndex(null);
                  }}
                  placeholder={t("searchPlaceholder")}
                  className="w-full rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl pl-11 pr-5 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all duration-300 focus:border-[#C9A84C]/40 focus:ring-1 focus:ring-[#C9A84C]/20"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Category filters */}
          <ScrollReveal delay={0.15}>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {CATEGORY_KEYS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer border",
                    activeCategory === cat
                      ? "bg-[#C9A84C]/15 border-[#C9A84C]/40 text-[#C9A84C]"
                      : "bg-white/[0.03] border-white/[0.08] text-foreground/50 hover:border-white/[0.15] hover:text-foreground/80"
                  )}
                >
                  {t(`categories.${cat}`)}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* FAQ items */}
      <section className="pb-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            {filteredKeys.length > 0 ? (
              filteredKeys.map((key, i) => (
                <FAQItem
                  key={key}
                  questionKey={key}
                  isOpen={openIndex === i}
                  onToggle={() => handleToggle(i)}
                  delay={Math.min(i * 0.05, 0.3)}
                />
              ))
            ) : (
              <ScrollReveal>
                <div className="text-center py-16">
                  <MessageCircle
                    size={48}
                    className="mx-auto mb-4 text-foreground/20"
                  />
                  <p className="text-foreground/50 text-lg">
                    {t("noResults")}
                  </p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </Container>
      </section>

      {/* CTA section */}
      <section className="pb-24 md:pb-32">
        <Container>
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#C9A84C]/5 via-transparent to-[#C9A84C]/5 p-8 sm:p-12 md:p-16 text-center">
              {/* Ambient glow */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_0%,rgba(201,168,76,0.08),transparent)]" />

              <div className="relative z-10">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="font-[family-name:var(--font-cabinet)] text-2xl sm:text-3xl font-bold mb-4"
                >
                  {t("ctaTitle")}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-foreground/60 max-w-lg mx-auto mb-8 text-sm sm:text-base"
                >
                  {t("ctaDescription")}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <MagneticButton>
                    <Button href="/soumission" size="lg">
                      {t("ctaQuote")}
                      <ArrowRight size={18} />
                    </Button>
                  </MagneticButton>
                  <Button href="/contact" variant="secondary" size="lg">
                    {t("ctaButton")}
                  </Button>
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
