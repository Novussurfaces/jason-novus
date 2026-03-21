"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Link } from "@/i18n/navigation";
import { type Product, getRelatedProducts } from "@/lib/products";

export function ProductDetail({ product }: { product: Product }) {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("products");
  const related = getRelatedProducts(product);

  return (
    <section className="pt-32 pb-24">
      <Container>
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            {t("backToProducts")}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-[4/3] rounded-2xl bg-card border border-border overflow-hidden flex items-center justify-center"
          >
            <div className="text-6xl font-bold text-muted-foreground/10 font-[family-name:var(--font-cabinet)]">
              {product.sciCode}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Category badge */}
            <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent mb-4">
              {product.specs.chemistry}
            </span>

            {/* Name */}
            <h1 className="font-[family-name:var(--font-cabinet)] text-3xl font-bold tracking-tight sm:text-4xl">
              {product.name[locale]}
            </h1>

            {/* Description */}
            <p className="mt-4 text-muted leading-relaxed">
              {product.description[locale]}
            </p>

            {/* Specs table */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">{t("specifications")}</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl bg-card border border-border px-4 py-3"
                  >
                    <div className="text-xs text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div className="text-sm font-medium mt-0.5">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">
                {locale === "fr" ? "Caractéristiques" : "Features"}
              </h2>
              <ul className="space-y-2.5">
                {product.features[locale].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-muted"
                  >
                    <CheckCircle
                      size={18}
                      className="text-success shrink-0 mt-0.5"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Applications */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">{t("applications")}</h2>
              <div className="flex flex-wrap gap-2">
                {product.applications[locale].map((app) => (
                  <span
                    key={app}
                    className="rounded-full bg-surface border border-border px-3 py-1.5 text-xs text-muted"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button href="/soumission" size="lg">
                {t("requestQuote")}
                <ArrowRight size={18} />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <AnimatedSection className="mt-24">
            <h2 className="font-[family-name:var(--font-cabinet)] text-2xl font-bold mb-8">
              {t("relatedProducts")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={{ pathname: "/produits/[slug]", params: { slug: rp.slug } }}
                  className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-accent/50 hover:bg-card-hover"
                >
                  <div className="aspect-[3/2] rounded-xl bg-surface mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-muted-foreground/20 font-[family-name:var(--font-cabinet)]">
                      {rp.sciCode}
                    </span>
                  </div>
                  <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent mb-2">
                    {rp.specs.chemistry}
                  </span>
                  <h3 className="text-sm font-semibold group-hover:text-accent transition-colors">
                    {rp.name[locale]}
                  </h3>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        )}
      </Container>
    </section>
  );
}
