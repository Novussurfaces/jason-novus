"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, CheckCircle, Layers, Clock, Ruler, Zap, Package, Truck, Tag, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Meteors } from "@/components/ui/Meteors";
import { Link } from "@/i18n/navigation";
import { type Product, getRelatedProducts } from "@/lib/products";
import { getPailPricing, getPalletSavings, formatPriceDecimal, type PailSize } from "@/lib/pricing";

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

function PricingSection({ product }: { product: Product }) {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("products.pricing");
  const pail = getPailPricing(product.slug);

  if (!pail) return null;

  const sizes: { key: PailSize; label: string }[] = [
    { key: "1gal", label: t("onegallon") },
    { key: "5gal", label: t("fivegallon") },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.03] -z-10"
        style={{ background: "radial-gradient(circle, #2563eb 0%, transparent 70%)", filter: "blur(100px)" }}
      />
      <Container>
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
              <Tag size={16} />
              {t("subtitle")}
            </span>
            <h2 className="font-[family-name:var(--font-cabinet)] text-3xl font-bold tracking-tight">
              {t("title")}
            </h2>
          </div>
        </AnimatedSection>

        {/* Pricing cards — one per pail size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {sizes.map((size, i) => {
            const palletData = getPalletSavings(product.slug, size.key);
            return (
              <AnimatedSection key={size.key} delay={i * 0.15}>
                <SpotlightCard className="h-full relative overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <Package size={20} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{size.label}</h3>
                      <p className="text-xs text-muted">
                        {t("coverageRange", { min: pail.coverage.min, max: pail.coverage.max })}
                      </p>
                    </div>
                  </div>

                  {/* Unit price */}
                  <div className="rounded-xl bg-surface/80 border border-border/60 p-4 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">{t("unitPrice")}</span>
                      <span className="text-xl font-bold font-[family-name:var(--font-cabinet)]">
                        {formatPriceDecimal(pail.unitPrice[size.key])}
                        <span className="text-sm font-normal text-muted">{t("perUnit")}</span>
                      </span>
                    </div>
                  </div>

                  {/* Pallet price — featured */}
                  <div className="rounded-xl bg-accent/5 border border-accent/20 p-4 relative">
                    {palletData && palletData.savingsPercent > 0 && (
                      <div className="absolute -top-2.5 right-4 rounded-full bg-success px-3 py-0.5 text-xs font-bold text-white">
                        {t("bestValue")}
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Truck size={16} className="text-accent" />
                        <span className="text-sm font-medium">{t("palletPrice")}</span>
                      </div>
                      <span className="text-2xl font-bold font-[family-name:var(--font-cabinet)] text-accent">
                        {formatPriceDecimal(pail.palletPrice[size.key])}
                      </span>
                    </div>
                    <p className="text-xs text-muted mb-2">
                      {t("palletQty", { qty: pail.palletQty[size.key] })}
                    </p>
                    {palletData && palletData.savings > 0 && (
                      <div className="flex items-center gap-2 pt-2 border-t border-accent/10">
                        <Percent size={14} className="text-success" />
                        <span className="text-sm font-medium text-success">
                          {t("savingsAmount", { amount: formatPriceDecimal(palletData.savings) })}
                        </span>
                        <span className="text-xs text-muted">
                          ({t("savings", { percent: palletData.savingsPercent })})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-5">
                    <Button href="/soumission" className="w-full" size="sm">
                      {t("orderPallet")}
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </SpotlightCard>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Volume discount tiers */}
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
                {(["tier1", "tier2", "tier3", "tier4"] as const).map((tier, i) => (
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
                ))}
              </div>
            </SpotlightCard>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("products");
  const related = getRelatedProducts(product);

  return (
    <>
      {/* Hero banner */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-background to-background" />
        <Meteors number={12} />

        <Container className="relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
            >
              <ArrowLeft size={16} />
              {t("backToProducts")}
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Product visual */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ProductVisual
                sciCode={product.sciCode}
                chemistry={product.specs.chemistry}
                className="aspect-[4/3]"
              />
            </motion.div>

            {/* Product info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5 text-xs font-medium text-accent mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {product.specs.chemistry}
              </span>

              <h1 className="font-[family-name:var(--font-cabinet)] text-4xl font-bold tracking-tight sm:text-5xl">
                {product.name[locale]}
              </h1>

              <p className="mt-5 text-lg text-muted leading-relaxed">
                {product.description[locale]}
              </p>

              {/* Specs grid */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {Object.entries(product.specs).map(([key, value], i) => {
                  const Icon = specIcons[key] || Layers;
                  const label = specLabels[key]?.[locale] || key;
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                      className="rounded-xl bg-card/80 border border-border/60 px-4 py-3.5 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon size={14} className="text-accent" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          {label}
                        </span>
                      </div>
                      <div className="text-sm font-semibold">{value}</div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
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

      {/* Pricing section */}
      <PricingSection product={product} />

      {/* Features section */}
      <section className="py-20 bg-surface/50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Features list */}
            <AnimatedSection>
              <h2 className="font-[family-name:var(--font-cabinet)] text-2xl font-bold mb-6">
                {t("features")}
              </h2>
              <ul className="space-y-3">
                {product.features[locale].map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="flex items-start gap-3 text-muted"
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
              <h2 className="font-[family-name:var(--font-cabinet)] text-2xl font-bold mb-6">
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
                    className="rounded-full bg-card border border-border/60 px-4 py-2 text-sm text-muted hover:border-accent/40 hover:text-foreground transition-all cursor-default"
                  >
                    {app}
                  </motion.span>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="py-20">
          <Container>
            <AnimatedSection>
              <h2 className="font-[family-name:var(--font-cabinet)] text-2xl font-bold mb-8">
                {t("relatedProducts")}
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rp, i) => (
                <AnimatedSection key={rp.id} delay={i * 0.1}>
                  <Link
                    href={{ pathname: "/produits/[slug]", params: { slug: rp.slug } }}
                    className="group block"
                  >
                    <SpotlightCard className="transition-all duration-300 hover:border-accent/50">
                      <ProductVisual
                        sciCode={rp.sciCode}
                        chemistry={rp.specs.chemistry}
                        className="aspect-[3/2] mb-4"
                      />
                      <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent mb-2">
                        {rp.specs.chemistry}
                      </span>
                      <h3 className="text-sm font-semibold group-hover:text-accent transition-colors">
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
    </>
  );
}
