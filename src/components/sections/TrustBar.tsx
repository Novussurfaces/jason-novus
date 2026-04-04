"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { NumberTicker } from "@/components/ui/NumberTicker";

const stats = [
  { key: "systems", value: 13, suffix: "+", delay: 0 },
  { key: "experience", value: 25, suffix: "+", delay: 0.15 },
  { key: "projects", value: 500, suffix: "+", delay: 0.3 },
  { key: "countries", value: 50, suffix: "+", delay: 0.45 },
] as const;

export function TrustBar() {
  const t = useTranslations("trust");

  return (
    <section className="relative backdrop-blur-xl bg-white/[0.03] border-y border-white/[0.06] py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto"
        >
        {stats.map((stat, i) => (
          <div
            key={stat.key}
            className={`flex flex-col items-center justify-center text-center py-4 ${
              i < stats.length - 1 ? "border-r border-white/[0.06]" : ""
            }`}
          >
            <NumberTicker
              value={stat.value}
              suffix={stat.suffix}
              delay={stat.delay}
              className="font-[family-name:var(--font-cabinet)] text-3xl md:text-4xl font-bold text-foreground"
            />
            <span className="text-[11px] uppercase tracking-[0.15em] text-foreground/40 mt-1.5">
              {t(stat.key)}
            </span>
          </div>
        ))}
      </motion.div>
      </Container>
    </section>
  );
}
