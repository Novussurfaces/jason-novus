"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { products, categories, type ProductCategory, type Product } from "@/lib/products";
import { pricePerSqFt } from "@/lib/pricing";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/* ─── Stagger + blur entrance for each card ─── */
const cardVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      delay: i * 0.07,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(6px)",
    transition: { duration: 0.25 },
  },
};

/* ─── Single product card ─── */
function ProductCard({ product, index }: { product: Product; index: number }) {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("products");

  return (
    <motion.div
      layout
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full"
    >
      <Link
        href={{ pathname: "/produits/[slug]", params: { slug: product.slug } }}
        className="group block h-full"
      >
        <SpotlightCard className="h-full flex flex-col !p-0 overflow-hidden">
          {/* Product visual */}
          <ProductVisual
            sciCode={product.sciCode}
            chemistry={product.specs.chemistry}
            className="aspect-[4/3]"
          />

          {/* Card body */}
          <div className="flex flex-col flex-1 p-5 pt-4">
            {/* Chemistry badge */}
            <span className="inline-flex self-start rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent mb-3">
              {product.specs.chemistry}
            </span>

            {/* Name */}
            <h3 className="text-lg font-semibold group-hover:text-accent transition-colors leading-snug">
              {product.name[locale]}
            </h3>

            {/* Description */}
            <p className="mt-2 text-sm text-foreground/60 line-clamp-2">
              {product.shortDescription[locale]}
            </p>

            {/* Price — clear product-only label */}
            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-foreground/40">{t("fromPrice")}</span>
                <span className="text-sm font-semibold text-accent">
                  {(() => {
                    const price = pricePerSqFt[product.slug];
                    return price
                      ? `$${price.min.toFixed(2)}/${locale === "fr" ? "pi²" : "sq ft"}`
                      : product.priceRange;
                  })()}
                </span>
                <span className="text-[10px] text-foreground/30">{t("pricing.productOnly")}</span>
              </div>
            </div>

            {/* Spacer to push CTA to bottom */}
            <div className="flex-1 min-h-3" />

            {/* Divider */}
            <div className="h-px w-full bg-white/[0.06] mt-4 mb-3" />

            {/* CTA */}
            <div className="flex items-center gap-2 text-sm font-medium text-accent">
              {t("learnMore")}
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </div>
          </div>
        </SpotlightCard>
      </Link>
    </motion.div>
  );
}

/* ─── Main catalog section ─── */
export function ProductsCatalog() {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("products");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      p.name[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription[locale].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-24 md:py-32">
      <Container>
        {/* ── Header with gradient title ── */}
        <SectionHeader title={t("title")} subtitle={t("subtitle")} gradient />

        {/* ── Search bar — glass morphism ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-md mx-auto mb-10"
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search")}
              className="w-full rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] pl-11 pr-5 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* ── Category filter pills ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-14"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer",
                activeCategory === cat.id
                  ? "bg-accent/20 border border-accent/30 text-accent shadow-[0_0_16px_rgba(201,168,76,0.12)]"
                  : "bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] text-foreground/50 hover:text-foreground/80 hover:border-white/[0.2] hover:bg-white/[0.09]"
              )}
            >
              {cat.label[locale]}
            </button>
          ))}
        </motion.div>

        {/* ── Products grid ── */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="text-foreground/40 text-lg">{t("noResults")}</p>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
