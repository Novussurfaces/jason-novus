"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TextReveal } from "@/components/ui/TextReveal";

export function CTASection() {
  const t = useTranslations("cta");

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-2xl" />
      </div>

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <TextReveal
            text={t("title")}
            className="font-[family-name:var(--font-cabinet)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-muted"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 inline-block"
          >
            <MagneticButton>
              <Button href="/soumission" size="lg">
                {t("button")}
                <ArrowRight size={20} />
              </Button>
            </MagneticButton>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
