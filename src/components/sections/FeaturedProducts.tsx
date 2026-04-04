"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/products";
import { pricePerSqFt } from "@/lib/pricing";
import { Link } from "@/i18n/navigation";

const featured = [
  products[4],
  products[6],
  products[8],
  products[0],
];

export function FeaturedProducts() {
  const t = useTranslations("products");
  const locale = useLocale() as "fr" | "en";

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle radial glow behind section */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 1000,
          height: 1000,
          background:
            "radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 70%)",
        }}
      />

      <Container>
        {/* Glass badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-block rounded-full border border-white/[0.10] bg-white/[0.06] px-3 py-1 text-xs text-foreground/48 backdrop-blur-xl">
            {t("badge")}
          </span>
        </motion.div>

        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {featured.map((product, i) => {
            const price = pricePerSqFt[product.slug];

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={{
                    pathname: "/produits/[slug]",
                    params: { slug: product.slug },
                  }}
                  className="group block h-full"
                >
                  <SpotlightCard className="h-full">
                    <div className="relative">
                      <ProductVisual
                        sciCode={product.sciCode}
                        chemistry={product.specs.chemistry}
                        className="aspect-[4/3] mb-5"
                      />
                      {/* Chemistry type glass badge */}
                      <span className="absolute left-3 top-3 inline-block rounded-full border border-white/[0.12] bg-white/[0.08] px-2 py-0.5 text-[10px] text-foreground/60 backdrop-blur-sm">
                        {product.specs.chemistry}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                      {product.name[locale]}
                    </h3>

                    {/* Price indicator — clear product-only label */}
                    {price && (
                      <p className="mt-1 text-xs text-accent/70">
                        {t("fromPrice")} ${price.min.toFixed(2)}/{locale === "fr" ? "pi²" : "sq ft"}{" "}
                        <span className="text-foreground/40">{t("pricing.productOnly")}</span>
                      </p>
                    )}

                    <p className="mt-2 text-sm text-foreground/60 line-clamp-2 leading-relaxed">
                      {product.shortDescription[locale]}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-accent/70 group-hover:text-accent transition-colors">
                      {t("learnMore")}
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </SpotlightCard>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Glass-style "View all" CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <Button href="/produits" variant="secondary" size="md" className="group/btn">
            {t("viewAll")}
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover/btn:translate-x-1"
            />
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
