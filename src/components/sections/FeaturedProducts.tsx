"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { products, type Product } from "@/lib/products";
import { Link } from "@/i18n/navigation";

const featured = [
  products[4], // Flake — most popular
  products[6], // Metallic — luxury
  products[8], // Polyurea — fast cure
  products[0], // SCI-100 — industrial
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("products");

  return (
    <AnimatedSection delay={index * 0.1}>
      <Link
        href={{ pathname: "/produits/[slug]", params: { slug: product.slug } }}
        className="group block h-full"
      >
        <SpotlightCard className="h-full transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
          {/* Product visual */}
          <ProductVisual
            sciCode={product.sciCode}
            chemistry={product.specs.chemistry}
            className="aspect-[4/3] mb-5"
          />

          {/* Category badge */}
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

          {/* Specs preview */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-surface px-3 py-2">
              <div className="text-xs text-muted-foreground">{t("thickness")}</div>
              <div className="text-sm font-medium">
                {product.specs.thickness}
              </div>
            </div>
            <div className="rounded-lg bg-surface px-3 py-2">
              <div className="text-xs text-muted-foreground">{t("cure")}</div>
              <div className="text-sm font-medium">
                {product.specs.cureTime}
              </div>
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
        </SpotlightCard>
      </Link>
    </AnimatedSection>
  );
}

export function FeaturedProducts() {
  const t = useTranslations("products");

  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <AnimatedSection className="mt-12 text-center">
          <Button href="/produits" variant="secondary">
            {t("viewAll")}
            <ArrowRight size={18} />
          </Button>
        </AnimatedSection>
      </Container>
    </section>
  );
}
