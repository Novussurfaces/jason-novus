"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, Mail, Clock, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { products } from "@/lib/products";

/* Top 6 products for footer — the most popular/representative */
const featuredSlugs = [
  "sci-flake-system",
  "sci-metallic-system",
  "sci-polyurea-flake-system",
  "sci-100-coating-system",
  "sci-quartz-broadcast-system",
  "sci-membrane-system",
];

export function Footer() {
  const t = useTranslations();
  const locale = useLocale() as "fr" | "en";
  const year = new Date().getFullYear();

  const footerProducts = featuredSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <footer className="relative border-t border-white/[0.06] overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(ellipse at center, #2563eb 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <Container className="relative z-10 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand — wider column */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-shadow duration-300">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-[family-name:var(--font-cabinet)] text-xl font-bold tracking-tight">
                Novus<span className="text-accent ml-0.5">Surfaces</span>
              </span>
            </Link>
            <p className="text-sm text-muted/60 leading-relaxed max-w-xs">
              {t("footer.description")}
            </p>

            {/* Made in Canada badge */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-xs text-muted/50">
              <span className="text-base">🍁</span>
              {t("footer.madeIn")}
            </div>
          </div>

          {/* Products — dynamic from products.ts */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted/40 mb-5">
              {t("footer.products")}
            </h3>
            <ul className="space-y-3">
              {footerProducts.map((product) =>
                product ? (
                  <li key={product.slug}>
                    <Link
                      href={{
                        pathname: "/produits/[slug]",
                        params: { slug: product.slug },
                      }}
                      className="group inline-flex items-center gap-1 text-sm text-muted/60 hover:text-foreground transition-colors duration-200"
                    >
                      {product.name[locale]}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 -translate-y-0.5 translate-x-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
                      />
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted/40 mb-5">
              {t("footer.company")}
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/a-propos" as const, key: "nav.about" },
                { href: "/realisations" as const, key: "nav.portfolio" },
                { href: "/soumission" as const, key: "nav.quote" },
                { href: "/contact" as const, key: "nav.contact" },
                { href: "/calculateur" as const, key: "nav.calculator" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted/60 hover:text-foreground transition-colors duration-200"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted/40 mb-5">
              {t("nav.contact")}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted/60">
                <Mail size={15} className="text-accent/60 shrink-0 mt-0.5" />
                <a
                  href="mailto:info@novussurfaces.com"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  info@novussurfaces.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted/60">
                <MapPin size={15} className="text-accent/60 shrink-0 mt-0.5" />
                <span>{t("contact.info.coverage")}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted/60">
                <Clock size={15} className="text-accent/60 shrink-0 mt-0.5" />
                <span>{t("contact.info.hours")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with gradient divider */}
        <div className="mt-16">
          {/* Gradient divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground/50">
              {t("footer.copyright", { year })}
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/a-propos"
                className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                {t("footer.privacy")}
              </Link>
              <Link
                href="/a-propos"
                className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                {t("footer.terms")}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
