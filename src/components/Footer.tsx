"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, Mail, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-[family-name:var(--font-cabinet)] text-xl font-bold tracking-tight">
                Novus<span className="text-accent ml-0.5">Surfaces</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              {t("footer.products")}
            </h3>
            <ul className="space-y-2.5">
              {[
                "Époxy 100% solide",
                "Flocons décoratifs",
                "Métallique",
                "Quartz",
                "Polyuréa",
                "Membrane",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/produits"
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              {t("footer.company")}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/a-propos"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/realisations"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  {t("nav.portfolio")}
                </Link>
              </li>
              <li>
                <Link
                  href="/soumission"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  {t("nav.quote")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              {t("nav.contact")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted">
                <Mail size={16} className="text-accent shrink-0" />
                <a
                  href="mailto:info@novussurfaces.com"
                  className="hover:text-foreground transition-colors"
                >
                  info@novussurfaces.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted">
                <MapPin size={16} className="text-accent shrink-0" />
                {t("contact.info.coverage")}
              </li>
              <li className="flex items-center gap-2 text-sm text-muted">
                <Clock size={16} className="text-accent shrink-0" />
                {t("contact.info.hours")}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright", { year })}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            🍁 {t("footer.madeIn")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
