"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
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
      {/* Subtle background glow */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(ellipse at center, #7c3aed 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(ellipse at center, #2563eb 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <Container className="relative z-10">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />
      </Container>

      <div className="relative z-10 mt-12">
        <InfiniteMovingCards items={items} direction="left" speed="slow" />
      </div>
    </section>
  );
}
