"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfiniteMovingCards } from "@/components/ui/InfiniteMovingCards";

const TESTIMONIAL_COUNT = 5;

export function Testimonials() {
  const t = useTranslations("testimonials");

  const items = Array.from({ length: TESTIMONIAL_COUNT }, (_, i) => ({
    quote: t(`item${i + 1}.quote`),
    name: t(`item${i + 1}.name`),
    title: t(`item${i + 1}.role`),
  }));

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle radial gold glow — background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 900,
          height: 900,
          background:
            "radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 70%)",
        }}
      />

      <Container className="relative z-10">
        {/* Glass badge pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-5"
        >
          <span className="inline-flex items-center backdrop-blur-xl bg-white/[0.06] border border-white/[0.10] rounded-full px-3 py-1 text-xs text-foreground/70">
            {t("badge")}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)", y: 25 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <SectionHeader title={t("title")} subtitle={t("subtitle")} />
        </motion.div>
      </Container>

      <motion.div
        initial={{ opacity: 0, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 mt-14"
      >
        <InfiniteMovingCards items={items} direction="left" speed="slow" />
      </motion.div>
    </section>
  );
}
