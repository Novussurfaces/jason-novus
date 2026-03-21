"use client";

import { useTranslations } from "next-intl";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderHandle,
} from "react-compare-slider";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const comparisons = [
  {
    id: "garage",
    before: "/images/before-garage.jpg",
    after: "/images/after-garage.jpg",
    labelKey: "garage",
  },
  {
    id: "commercial",
    before: "/images/before-commercial.jpg",
    after: "/images/after-commercial.jpg",
    labelKey: "commercial",
  },
];

export function BeforeAfter() {
  const t = useTranslations("beforeAfter");

  return (
    <section className="py-24 md:py-32 bg-surface">
      <Container>
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {comparisons.map((comp, i) => (
            <AnimatedSection key={comp.id} delay={i * 0.15}>
              <div className="rounded-2xl overflow-hidden border border-border bg-card">
                <ReactCompareSlider
                  itemOne={
                    <ReactCompareSliderImage
                      src={comp.before}
                      alt={`Before - ${comp.labelKey}`}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage
                      src={comp.after}
                      alt={`After - ${comp.labelKey}`}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  }
                  handle={
                    <ReactCompareSliderHandle
                      buttonStyle={{
                        backdropFilter: "none",
                        background: "#2563eb",
                        border: "2px solid white",
                        color: "white",
                        width: 36,
                        height: 36,
                      }}
                      linesStyle={{
                        width: 2,
                        background: "#2563eb",
                      }}
                    />
                  }
                  defaultPosition={50}
                  style={{ height: "400px" }}
                  className="rounded-2xl"
                />
                <div className="p-4 flex justify-between text-sm">
                  <span className="text-muted">
                    {t("before")}
                  </span>
                  <span className="font-medium text-accent">
                    {t(`labels.${comp.labelKey}`)}
                  </span>
                  <span className="text-muted">
                    {t("after")}
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
