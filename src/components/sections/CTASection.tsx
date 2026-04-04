"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function CTASection() {
  const t = useTranslations("cta");

  return (
    <section className="py-24 md:py-32">
      <Container>
        {/* Subtle radial gold glow behind the panel */}
        <div className="relative max-w-4xl mx-auto">
          <div
            className="pointer-events-none absolute inset-0 -inset-x-16 -inset-y-12"
            aria-hidden="true"
          >
            <div className="h-full w-full rounded-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.05)_0%,_transparent_70%)]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden backdrop-blur-2xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.12] transition-colors duration-500 rounded-3xl p-14 md:p-20"
          >
            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="inline-block rounded-full border border-white/[0.10] bg-white/[0.06] px-3 py-1 text-xs text-foreground/48">
                  {t("badge")}
                </span>
              </motion.div>

              {/* Headline — accent gold gradient for impact */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-[clamp(2rem,4vw,2.8rem)] font-bold leading-tight tracking-tight text-gradient-accent font-[family-name:var(--font-cabinet)] max-w-2xl mx-auto"
              >
                {t("title")}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-4 text-foreground/60 text-base max-w-lg mx-auto"
              >
                {t("subtitle")}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex flex-col items-center gap-3"
              >
                <MagneticButton>
                  <Button href="/soumission" size="lg" variant="primary">
                    {t("button")}
                    <ArrowRight size={18} />
                  </Button>
                </MagneticButton>

                <span className="text-sm text-foreground/50">
                  {t("phone")}
                </span>
              </motion.div>

              {/* Trust line */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 pt-6 border-t border-white/[0.06] text-xs text-foreground/24"
              >
                {t("trust")}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
