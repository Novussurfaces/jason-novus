"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, CheckCircle, Layers, Clock, Ruler, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Meteors } from "@/components/ui/Meteors";
import { Link } from "@/i18n/navigation";
import { type Product, getRelatedProducts } from "@/lib/products";

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
                  {locale === "fr" ? "Calculer le prix" : "Calculate Price"}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Features section */}
      <section className="py-20 bg-surface/50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Features list */}
            <AnimatedSection>
              <h2 className="font-[family-name:var(--font-cabinet)] text-2xl font-bold mb-6">
                {locale === "fr" ? "Caractéristiques" : "Features"}
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
