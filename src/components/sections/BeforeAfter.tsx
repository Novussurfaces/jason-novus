"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useRef } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/cn";

const comparisons = [
  {
    id: "garage",
    before: "/images/before-garage.svg",
    after: "/images/after-garage.svg",
    labelKey: "garage",
    badge: "badgeGarage",
  },
  {
    id: "commercial",
    before: "/images/before-commercial.svg",
    after: "/images/after-commercial.svg",
    labelKey: "commercial",
    badge: "badgeCommercial",
  },
  {
    id: "patio",
    before: "/images/before-patio.svg",
    after: "/images/after-patio.svg",
    labelKey: "patio",
    badge: "badgePatio",
  },
];

/* ------------------------------------------------------------------ */
/*  Custom handle with breathing animation                              */
/* ------------------------------------------------------------------ */
function PremiumHandle({
  isDragging,
}: {
  isDragging: boolean;
}) {
  return (
    <div className="ba-handle-wrapper" data-dragging={isDragging}>
      {/* Vertical line */}
      <div className="ba-handle-line" />

      {/* Glow behind the line */}
      <div className="ba-handle-glow" />

      {/* Central knob */}
      <div className={cn("ba-handle-knob", isDragging && "ba-handle-knob--active")}>
        {/* Left arrow */}
        <svg
          width="10"
          height="14"
          viewBox="0 0 10 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-90"
        >
          <path
            d="M8 1L2 7L8 13"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Right arrow */}
        <svg
          width="10"
          height="14"
          viewBox="0 0 10 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-90"
        >
          <path
            d="M2 1L8 7L2 13"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Single comparison card                                             */
/* ------------------------------------------------------------------ */
function ComparisonCard({
  comp,
  index,
}: {
  comp: (typeof comparisons)[number];
  index: number;
}) {
  const t = useTranslations("beforeAfter");
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handlePositionChange = useCallback((pos: number) => {
    setPosition(pos);
  }, []);

  // Label opacity: AVANT fades in as slider moves right (revealing before image)
  const avantOpacity = Math.min(1, position / 50);
  const apresOpacity = Math.min(1, (100 - position) / 50);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 30 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <SpotlightCard
        className="p-0 overflow-hidden rounded-2xl border border-white/[0.08]"
        glowIntensity="strong"
      >
        {/* Compare slider */}
        <div className="relative">
          <ReactCompareSlider
            itemOne={
              <ReactCompareSliderImage
                src={comp.before}
                alt={`${t("before")} - ${t(`labels.${comp.labelKey}`)}`}
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
                alt={`${t("after")} - ${t(`labels.${comp.labelKey}`)}`}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            }
            handle={<PremiumHandle isDragging={isDragging} />}
            defaultPosition={50}
            onPositionChange={handlePositionChange}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            style={{ height: "420px" }}
            className="rounded-t-2xl"
          />

          {/* Badge — top-right to avoid overlap with before/after labels */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 border border-[#C9A84C]/30 px-3 py-1 text-[10px] font-semibold text-[#C9A84C] backdrop-blur-md uppercase tracking-wider shadow-[0_2px_12px_rgba(201,168,76,0.15)]">
              {t(`badges.${comp.badge}`)}
            </span>
          </div>

          {/* Before/After labels — top-left area, no overlap with badge */}
          <div className="absolute inset-x-0 top-4 z-20 flex justify-between px-4 pointer-events-none">
            <motion.span
              className="font-[family-name:var(--font-cabinet)] text-sm font-semibold uppercase tracking-[0.15em] text-white bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              animate={{ opacity: avantOpacity }}
              transition={{ duration: 0.15 }}
            >
              {t("labelAvant")}
            </motion.span>
            <motion.span
              className="font-[family-name:var(--font-cabinet)] text-sm font-semibold uppercase tracking-[0.15em] text-white bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.4)] mr-28"
              animate={{ opacity: apresOpacity }}
              transition={{ duration: 0.15 }}
            >
              {t("labelApres")}
            </motion.span>
          </div>

          {/* Bottom gradient fade for polish */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10 rounded-b-none" />
        </div>

        {/* Bottom info bar */}
        <div className="relative z-10 px-5 py-4 flex items-center justify-between border-t border-white/[0.08] bg-[#18181b]/90 backdrop-blur-md">
          <span className="text-xs font-medium text-white/50 uppercase tracking-[0.15em] font-[family-name:var(--font-cabinet)]">
            {t("before")}
          </span>
          <span className="text-sm font-bold text-[#C9A84C] font-[family-name:var(--font-cabinet)] tracking-wide">
            {t(`labels.${comp.labelKey}`)}
          </span>
          <span className="text-xs font-medium text-white/50 uppercase tracking-[0.15em] font-[family-name:var(--font-cabinet)]">
            {t("after")}
          </span>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */
export function BeforeAfter() {
  const t = useTranslations("beforeAfter");

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <Container className="relative z-10">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} className="mb-14 md:mb-20" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {comparisons.map((comp, i) => (
            <ComparisonCard key={comp.id} comp={comp} index={i} />
          ))}
        </div>
      </Container>

      {/* CSS for BeforeAfter handle effects */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* ---- Handle breathing animation ---- */
            @keyframes ba-breathe {
              0%, 100% { transform: translate(-50%, -50%) scale(1); }
              50% { transform: translate(-50%, -50%) scale(1.08); }
            }

            @keyframes ba-glow-pulse {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 0.7; }
            }

            /* ---- Handle styles ---- */
            .ba-handle-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              position: relative;
            }

            .ba-handle-line {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 50%;
              width: 2px;
              transform: translateX(-50%);
              background: linear-gradient(
                180deg,
                transparent 0%,
                #C9A84C 10%,
                #D4B75E 50%,
                #C9A84C 90%,
                transparent 100%
              );
              box-shadow: 0 0 8px rgba(201,168,76,0.4), 0 0 20px rgba(201,168,76,0.15);
            }

            .ba-handle-glow {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 50%;
              width: 30px;
              transform: translateX(-50%);
              background: linear-gradient(
                180deg,
                transparent 0%,
                rgba(201,168,76,0.06) 20%,
                rgba(201,168,76,0.1) 50%,
                rgba(201,168,76,0.06) 80%,
                transparent 100%
              );
              animation: ba-glow-pulse 3s ease-in-out infinite;
              pointer-events: none;
            }

            .ba-handle-knob {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) scale(1);
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: radial-gradient(circle at 30% 30%, #27272a, #18181b);
              border: 2px solid #C9A84C;
              color: #C9A84C;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              cursor: grab;
              z-index: 10;
              animation: ba-breathe 3s ease-in-out infinite;
              transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
              box-shadow: 0 0 16px rgba(201,168,76,0.25), 0 4px 12px rgba(0,0,0,0.5);
            }

            .ba-handle-knob:hover {
              border-color: #D4B75E;
              box-shadow: 0 0 24px rgba(201,168,76,0.35), 0 4px 16px rgba(0,0,0,0.5);
            }

            .ba-handle-knob--active {
              animation: none;
              transform: translate(-50%, -50%) scale(1.12);
              border-color: #D4B75E;
              cursor: grabbing;
              box-shadow: 0 0 32px rgba(201,168,76,0.45), 0 4px 20px rgba(0,0,0,0.5);
            }
          `,
        }}
      />
    </section>
  );
}
