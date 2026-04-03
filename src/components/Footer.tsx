"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { products } from "@/lib/products";

const featuredSlugs = [
  "sci-flake-system",
  "sci-metallic-system",
  "sci-polyurea-flake-system",
  "sci-100-coating-system",
  "sci-quartz-broadcast-system",
  "sci-membrane-system",
];

const companyLinks = [
  { href: "/a-propos" as const, key: "nav.about" },
  { href: "/realisations" as const, key: "nav.portfolio" },
  { href: "/soumission" as const, key: "nav.quote" },
  { href: "/contact" as const, key: "nav.contact" },
] as const;

export function Footer() {
  const t = useTranslations();
  const locale = useLocale() as "fr" | "en";
  const year = new Date().getFullYear();

  const footerProducts = featuredSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-white/[0.06]"
    >
      <Container className="py-16 md:py-20">
        {/* 4-column grid: 1col mobile → 2x2 sm → 4col lg */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1 — Brand */}
          <div>
            <span className="font-[family-name:var(--font-cabinet)] text-xl font-bold tracking-tight">
              Novus<span className="text-accent ml-0.5">Surfaces</span>
            </span>
            <p className="mt-3 text-sm text-foreground/50 leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Col 2 — Products */}
          <div>
            <h3 className="text-[11px] text-foreground/24 uppercase tracking-[0.2em] mb-5">
              {t("footer.products")}
            </h3>
            <ul className="space-y-2.5">
              {footerProducts.map((product) =>
                product ? (
                  <li key={product.slug}>
                    <Link
                      href={{ pathname: "/produits/[slug]", params: { slug: product.slug } }}
                      className="text-sm text-foreground/50 hover:text-foreground/70 transition-colors"
                    >
                      {product.name[locale]}
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div>
            <h3 className="text-[11px] text-foreground/24 uppercase tracking-[0.2em] mb-5">
              {t("footer.company")}
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/50 hover:text-foreground/70 transition-colors"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h3 className="text-[11px] text-foreground/24 uppercase tracking-[0.2em] mb-5">
              {t("footer.contactHeading")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-foreground/50">
                <Phone size={14} className="shrink-0 text-accent/60" />
                <a href="tel:+15149077722" className="hover:text-foreground/70 transition-colors">
                  {t("footer.phone")}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground/50">
                <Mail size={14} className="shrink-0 text-accent/60" />
                <a href="mailto:info@novusepoxy.ca" className="hover:text-foreground/70 transition-colors">
                  {t("footer.email")}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-foreground/50">
                <MapPin size={14} className="shrink-0 mt-0.5 text-accent/60" />
                <span>{t("footer.address")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-foreground/20">
            {t("footer.copyright", { year })}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/a-propos" className="text-xs text-foreground/20 hover:text-foreground/40 transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link href="/a-propos" className="text-xs text-foreground/20 hover:text-foreground/40 transition-colors">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </Container>
    </motion.footer>
  );
}
