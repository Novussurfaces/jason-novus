"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const stats = [
  { key: "systems", value: 13, suffix: "+" },
  { key: "countries", value: 25, suffix: "+" },
  { key: "projects", value: 500, suffix: "+" },
  { key: "satisfaction", value: 99, suffix: "%" },
] as const;

export function TrustBar() {
  const t = useTranslations("trust");

  return (
    <section className="py-16 border-y border-border/30 bg-surface/30">
      <Container>
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <div key={stat.key} className="text-center">
                <div className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-cabinet)] text-foreground">
                  <NumberTicker
                    value={stat.value}
                    suffix={stat.suffix}
                    delay={i * 0.15}
                  />
                </div>
                <div className="mt-2 text-sm text-muted uppercase tracking-wider">
                  {t(stat.key)}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
