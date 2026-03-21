"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { products, categories, type ProductCategory, type Product } from "@/lib/products";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

function ProductCard({ product }: { product: Product }) {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("products");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={{ pathname: "/produits/[slug]", params: { slug: product.slug } }}
        className="group block rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/50 hover:bg-card-hover hover:shadow-lg hover:shadow-accent/5 h-full"
      >
        {/* Product visual */}
        <ProductVisual
          sciCode={product.sciCode}
          chemistry={product.specs.chemistry}
          className="aspect-[4/3] mb-5"
        />

        {/* Category */}
        <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent mb-3">
          {product.specs.chemistry}
        </span>

        {/* Name */}
        <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
          {product.name[locale]}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-muted line-clamp-2">
          {product.shortDescription[locale]}
        </p>

        {/* Specs */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-surface px-3 py-2">
            <div className="text-xs text-muted-foreground">Épaisseur</div>
            <div className="text-sm font-medium">{product.specs.thickness}</div>
          </div>
          <div className="rounded-lg bg-surface px-3 py-2">
            <div className="text-xs text-muted-foreground">Cure</div>
            <div className="text-sm font-medium">{product.specs.cureTime}</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-accent">
          {t("viewProduct")}
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </div>
      </Link>
    </motion.div>
  );
}

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
    <section className="pt-32 pb-24">
      <Container>
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === "fr" ? "Rechercher un produit..." : "Search products..."}
              className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
                activeCategory === cat.id
                  ? "bg-accent text-white shadow-lg shadow-accent/25"
                  : "bg-card text-muted border border-border hover:text-foreground hover:border-muted-foreground"
              )}
            >
              {cat.label[locale]}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted text-lg">
              {locale === "fr"
                ? "Aucun produit trouvé pour cette recherche."
                : "No products found for this search."}
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
