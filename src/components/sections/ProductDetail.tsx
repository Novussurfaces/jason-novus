"use client";

import { useRef, useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Layers,
  Clock,
  Ruler,
  Zap,
  Package,
  Truck,
  Tag,
  Percent,
  Shield,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { trackViewContent } from "@/lib/fb-pixel";
import { Meteors } from "@/components/ui/Meteors";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { type Product, getRelatedProducts } from "@/lib/products";
import {
  getPailPricing,
  getPalletSavings,
  formatPriceDecimal,
  pricePerSqFt,
  formatPrice,
  type PailSize,
} from "@/lib/pricing";

/* ── Spec icon + label maps ── */
const specIcons: Record<string, typeof Layers> = {
  chemistry: Layers,
  thickness: Ruler,
  cureTime: Clock,
  trafficReady: Zap,
};

const specLabels: Record<string, { fr: string; en: string }> = {
  chemistry: { fr: "Chimie", en: "Chemistry" },
  thickness: { fr: "Épaisseur", en: "Thickness" },
  cureTime: { fr: "Temps de cure", en: "Cure Time" },
  trafficReady: { fr: "Prêt au traffic", en: "Traffic Ready" },
};

/* ── Stagger helpers ── */
const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  },
  item: {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
  },
};

/* ══════════════════════════════════════════════
   Floating CTA Bar
   ══════════════════════════════════════════════ */
function FloatingCTA({ product }: { product: Product }) {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("products");
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0.08, 0.12], [0, 1]);
  const y = useTransform(scrollYProgress, [0.08, 0.12], [80, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
    >
      <div className="pointer-events-auto">
        <div
          className="border-t border-white/[0.06]"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "rgba(9,9,11,0.85)",
          }}
        >
          <Container>
            <div className="flex items-center justify-between py-3 gap-4">
              <div className="hidden sm:block min-w-0">
                <p className="text-sm font-semibold truncate">
                  {product.name[locale]}
                </p>
                <p className="text-xs text-muted">{t("floatingCtaSub")}</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  href="/soumission"
                  size="sm"
                  className="relative overflow-hidden flex-1 sm:flex-none"
                >
                  <span className="absolute inset-0 pointer-events-none">
                    <span
                      className="absolute inset-0 -translate-x-full animate-shimmer"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                      }}
                    />
                  </span>
                  <span className="relative z-10 flex items-center gap-2">
                    {t("floatingCta")}
                    <ArrowRight size={16} />
                  </span>
                </Button>
                <Button
                  href="/calculateur"
                  variant="secondary"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  {t("calculatePrice")}
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   Pricing Section — 3-tier glass card
   ══════════════════════════════════════════════ */
function PricingSection({ product }: { product: Product }) {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("products.pricing");
  const pail = getPailPricing(product.slug);
  const range = pricePerSqFt[product.slug];

  if (!pail || !range) return null;

  const palletData5 = getPalletSavings(product.slug, "5gal");

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.03] -z-10"
        style={{
          background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <Container>
        <AnimatedSection>
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
              <Tag size={16} />
              {t("sectionLabel")}
            </span>
            <h2 className="font-[family-name:var(--font-cabinet)] text-3xl md:text-4xl font-bold tracking-tight">
              {t("title")}
            </h2>
            <p className="text-sm text-muted mt-2">{t("subtitle")}</p>
          </div>
        </AnimatedSection>

        {/* ── 3-tier pricing card ── */}
        <AnimatedSection delay={0.1}>
          <div className="max-w-5xl mx-auto mb-8">
            <div
              className="rounded-2xl border border-white/[0.08] p-1"
              style={{
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
                {/* ── Per sq ft column ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0 }}
                  className="p-6 md:p-8 text-center flex flex-col items-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                    <Ruler size={20} className="text-accent" />
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-1">
                    {t("perSqFt")}
                  </h3>
                  <div className="mt-3">
                    <span className="text-gradient-accent font-[family-name:var(--font-cabinet)] text-3xl md:text-4xl font-bold">
                      {formatPriceDecimal(range.min)}
                    </span>
                    <span className="text-gradient-accent font-[family-name:var(--font-cabinet)] text-xl md:text-2xl font-bold mx-1">
                      –
                    </span>
                    <span className="text-gradient-accent font-[family-name:var(--font-cabinet)] text-3xl md:text-4xl font-bold">
                      {formatPriceDecimal(range.max)}
                    </span>
                  </div>
                  <span className="text-xs text-muted mt-1">
                    {t("sqftUnit")}
                  </span>
                  <p className="text-xs text-muted/60 mt-3">
                    {t("coverageRange", {
                      min: pail.coverage.min,
                      max: pail.coverage.max,
                    })}
                  </p>
                </motion.div>

                {/* ── Per unit column ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="p-6 md:p-8 text-center flex flex-col items-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                    <Package size={20} className="text-accent" />
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-1">
                    {t("perUnit")}
                  </h3>
                  <div className="mt-3 space-y-2">
                    <div>
                      <span className="text-gradient-accent font-[family-name:var(--font-cabinet)] text-2xl md:text-3xl font-bold">
                        {formatPriceDecimal(pail.unitPrice["5gal"])}
                      </span>
                      <p className="text-xs text-muted mt-0.5">{t("fivegallon")}</p>
                    </div>
                    <div className="pt-2 border-t border-white/[0.06]">
                      <span className="text-accent font-[family-name:var(--font-cabinet)] text-lg font-bold">
                        {formatPriceDecimal(pail.unitPrice["1gal"])}
                      </span>
                      <p className="text-xs text-muted mt-0.5">{t("onegallon")}</p>
                    </div>
                  </div>
                </motion.div>

                {/* ── Per pallet column ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-6 md:p-8 text-center flex flex-col items-center relative"
                >
                  {palletData5 && palletData5.savingsPercent > 0 && (
                    <div className="absolute top-3 right-3 rounded-full bg-success px-3 py-0.5 text-[10px] font-bold text-white">
                      {t("bestValue")}
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                    <Truck size={20} className="text-accent" />
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-1">
                    {t("perPallet")}
                  </h3>
                  <div className="mt-3 space-y-2">
                    <div>
                      <span className="text-gradient-accent font-[family-name:var(--font-cabinet)] text-2xl md:text-3xl font-bold">
                        {formatPrice(pail.palletPrice["5gal"])}
                      </span>
                      <p className="text-xs text-muted mt-0.5">
                        {t("palletQty", { qty: pail.palletQty["5gal"] })} &middot; {t("fivegallon")}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-white/[0.06]">
                      <span className="text-accent font-[family-name:var(--font-cabinet)] text-lg font-bold">
                        {formatPrice(pail.palletPrice["1gal"])}
                      </span>
                      <p className="text-xs text-muted mt-0.5">
                        {t("palletQty", { qty: pail.palletQty["1gal"] })} &middot; {t("onegallon")}
                      </p>
                    </div>
                  </div>
                  {palletData5 && palletData5.savings > 0 && (
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-accent/10">
                      <Percent size={12} className="text-success" />
                      <span className="text-xs font-medium text-success">
                        {t("savingsAmount", {
                          amount: formatPriceDecimal(palletData5.savings),
                        })}
                      </span>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ── Installation note ── */}
        <AnimatedSection delay={0.2}>
          <p className="text-center text-sm text-muted/70 mb-10 italic">
            {t("installationNote")}
          </p>
        </AnimatedSection>

        {/* ── CTA row ── */}
        <AnimatedSection delay={0.25}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Button href="/soumission" size="md">
              {t("orderPallet")}
              <ArrowRight size={16} />
            </Button>
            <Button href="/calculateur" variant="secondary" size="md">
              {t("orderUnit")}
            </Button>
          </div>
        </AnimatedSection>

        {/* ── Volume discounts ── */}
        <AnimatedSection delay={0.3}>
          <div className="max-w-2xl mx-auto">
            <SpotlightCard>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
                  <Percent size={20} className="text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">{t("volumeDiscounts")}</h3>
                  <p className="text-xs text-muted">{t("volumeNote")}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(["tier1", "tier2", "tier3", "tier4"] as const).map(
                  (tier, i) => (
                    <motion.div
                      key={tier}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                      className="flex items-center gap-2 rounded-lg bg-surface/60 px-3 py-2.5 border border-border/40"
                    >
                      <CheckCircle size={14} className="text-success shrink-0" />
                      <span className="text-sm text-muted">{t(tier)}</span>
                    </motion.div>
                  )
                )}
              </div>
            </SpotlightCard>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Feature Tabs (Oura-style)
   ══════════════════════════════════════════════ */
const featureTabs = [
  { key: "performance" as const, icon: Zap },
  { key: "application" as const, icon: Layers },
  { key: "warranty" as const, icon: Shield },
];

function FeatureTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const t = useTranslations("products.tabs");

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full opacity-[0.03] -z-10"
        style={{
          background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <Container>
        <motion.div
          initial={{ opacity: 0, filter: "blur(6px)", y: 20 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-[family-name:var(--font-cabinet)] text-3xl md:text-4xl font-bold tracking-tight">
            {t("sectionTitle")}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, filter: "blur(6px)", y: 20 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center gap-1 mb-10 border-b border-border/60"
        >
          {featureTabs.map((tab, i) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === i;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors duration-300",
                  isActive
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                )}
              >
                <TabIcon size={18} />
                {t(tab.key)}
                {isActive && (
                  <motion.div
                    layoutId="product-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.35 }}
          >
            <SpotlightCard className="max-w-3xl mx-auto">
              <div className="flex items-start gap-4 p-2">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  {(() => {
                    const Icon = featureTabs[activeTab].icon;
                    return <Icon size={22} className="text-accent" />;
                  })()}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-cabinet)] text-xl font-bold mb-2">
                    {t(featureTabs[activeTab].key)}
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {t(`${featureTabs[activeTab].key}Desc`)}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {([1, 2, 3] as const).map((n) => (
                      <motion.li
                        key={n}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: n * 0.08 }}
                        className="flex items-center gap-2 text-sm text-muted"
                      >
                        <div className="w-4 h-4 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                          <CheckCircle size={10} className="text-success" />
                        </div>
                        {t(`${featureTabs[activeTab].key}Bullet${n}`)}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Main ProductDetail Component
   ══════════════════════════════════════════════ */
export function ProductDetail({ product }: { product: Product }) {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("products");
  const related = getRelatedProducts(product);
  const range = pricePerSqFt[product.slug];

  useEffect(() => {
    trackViewContent({
      content_name: product.name[locale],
      content_category: product.category,
      value: range ? range.min : undefined,
    });
  }, [product.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Parallax hero refs ── */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6]);

  return (
    <>
      {/* ═══ Hero banner with parallax ═══ */}
      <section ref={heroRef} className="relative pt-8 pb-20 md:pb-28 overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-background to-background" />
        {/* Subtle gold radial glow behind product */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.04] -z-[1]"
          style={{
            background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />
        <Meteors number={12} />

        <Container className="relative z-10">
          {/* ── Back link ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="mb-10"
          >
            <Link
              href="/produits"
              className="group inline-flex items-center gap-2.5 text-sm text-muted hover:text-accent transition-colors duration-300"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] group-hover:border-accent/30 group-hover:bg-accent/10 transition-all duration-300">
                <ArrowLeft size={14} />
              </span>
              {t("backToProducts")}
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* ── Product visual — parallax scale ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
              className="overflow-hidden rounded-3xl border border-white/[0.06]"
            >
              <motion.div
                style={{
                  scale: heroScale,
                  y: heroY,
                  opacity: heroOpacity,
                }}
              >
                <ProductVisual
                  sciCode={product.sciCode}
                  chemistry={product.specs.chemistry}
                  className="aspect-[4/3] w-full"
                />
              </motion.div>
            </motion.div>

            {/* ── Product info column ── */}
            <motion.div
              variants={stagger.container}
              initial="hidden"
              animate="show"
              className="flex flex-col"
            >
              {/* Chemistry badge — glass pill */}
              <motion.div variants={stagger.item}>
                <span
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-accent mb-6"
                  style={{
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    background: "rgba(201,168,76,0.08)",
                    border: "1px solid rgba(201,168,76,0.2)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {product.specs.chemistry}
                </span>
              </motion.div>

              {/* Product name — large gradient text */}
              <motion.h1
                variants={stagger.item}
                className="text-gradient font-[family-name:var(--font-cabinet)] text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]"
              >
                {product.name[locale]}
              </motion.h1>

              {/* Price range — gold accent with clear label */}
              {range && (
                <motion.div variants={stagger.item} className="mt-4">
                  <span className="text-gradient-accent font-[family-name:var(--font-cabinet)] text-xl md:text-2xl font-bold">
                    {formatPriceDecimal(range.min)} – {formatPriceDecimal(range.max)}
                  </span>
                  <span className="text-muted text-sm ml-2">
                    / {locale === "fr" ? "pi²" : "sq ft"}
                  </span>
                  <span className="block text-xs text-muted/70 mt-1">
                    {t("pricing.sectionLabel")}
                  </span>
                </motion.div>
              )}

              {/* Description — readable */}
              <motion.p
                variants={stagger.item}
                className="mt-5 text-foreground/70 text-lg leading-relaxed"
              >
                {product.description[locale]}
              </motion.p>

              {/* Specs grid — glass cards with icons */}
              <motion.div
                variants={stagger.item}
                className="mt-8 grid grid-cols-2 gap-3"
              >
                {Object.entries(product.specs).map(([key, value], i) => {
                  const Icon = specIcons[key] || Layers;
                  const label = specLabels[key]?.[locale] || key;
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.4 + i * 0.08,
                        ease: [0.25, 0.4, 0.25, 1],
                      }}
                    >
                      <GlassCard className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                            <Icon size={14} className="text-accent" />
                          </div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            {label}
                          </span>
                        </div>
                        <div className="text-sm font-semibold pl-[38px]">
                          {value}
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* CTAs — gold primary + secondary */}
              <motion.div
                variants={stagger.item}
                className="mt-8 flex flex-col sm:flex-row gap-3"
              >
                <Button href="/soumission" size="lg">
                  {t("requestQuote")}
                  <ArrowRight size={18} />
                </Button>
                <Button href="/calculateur" variant="secondary" size="lg">
                  {t("calculatePrice")}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ═══ Pricing section ═══ */}
      <PricingSection product={product} />

      {/* ═══ Features + Applications ═══ */}
      <section className="py-24 md:py-32 bg-surface/50 relative overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Features list */}
            <AnimatedSection>
              <h2 className="font-[family-name:var(--font-cabinet)] text-2xl md:text-3xl font-bold mb-8">
                {t("features")}
              </h2>
              <ul className="space-y-3">
                {product.features[locale].map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.06,
                      ease: [0.25, 0.4, 0.25, 1],
                    }}
                    className="flex items-start gap-3 text-foreground/70"
                  >
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                      <CheckCircle size={14} className="text-success" />
                    </div>
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </AnimatedSection>

            {/* Applications */}
            <AnimatedSection delay={0.1}>
              <h2 className="font-[family-name:var(--font-cabinet)] text-2xl md:text-3xl font-bold mb-8">
                {t("applications")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.applications[locale].map((app, i) => (
                  <motion.span
                    key={app}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="rounded-full bg-card border border-border/60 px-4 py-2 text-sm text-muted hover:border-accent/40 hover:text-foreground transition-all duration-300 cursor-default"
                  >
                    {app}
                  </motion.span>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* ═══ Related products ═══ */}
      {related.length > 0 && (
        <section className="py-24 md:py-32">
          <Container>
            <AnimatedSection>
              <h2 className="font-[family-name:var(--font-cabinet)] text-2xl md:text-3xl font-bold mb-10">
                {t("relatedProducts")}
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rp, i) => (
                <AnimatedSection key={rp.id} delay={i * 0.1}>
                  <Link
                    href={{
                      pathname: "/produits/[slug]",
                      params: { slug: rp.slug },
                    }}
                    className="group block"
                  >
                    <SpotlightCard className="transition-all duration-300 hover:border-accent/50">
                      <ProductVisual
                        sciCode={rp.sciCode}
                        chemistry={rp.specs.chemistry}
                        className="aspect-[3/2] mb-4 rounded-xl overflow-hidden"
                      />
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-accent mb-2"
                        style={{
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          background: "rgba(201,168,76,0.08)",
                          border: "1px solid rgba(201,168,76,0.2)",
                        }}
                      >
                        {rp.specs.chemistry}
                      </span>
                      <h3 className="text-sm font-semibold group-hover:text-accent transition-colors duration-300">
                        {rp.name[locale]}
                      </h3>
                    </SpotlightCard>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ═══ Floating CTA bar ═══ */}
      <FloatingCTA product={product} />
    </>
  );
}
