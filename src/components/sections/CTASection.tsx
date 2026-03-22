"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TextReveal } from "@/components/ui/TextReveal";
import { LampEffect } from "@/components/ui/LampEffect";
import { Meteors } from "@/components/ui/Meteors";

/* ------------------------------------------------------------------ */
/*  Floating accent dots                                              */
/* ------------------------------------------------------------------ */
const DOTS = [
  { top: "12%", left: "8%", size: 6, delay: 0 },
  { top: "22%", right: "12%", size: 4, delay: 1.2 },
  { top: "65%", left: "5%", size: 5, delay: 0.6 },
  { top: "78%", right: "9%", size: 7, delay: 1.8 },
  { top: "40%", left: "92%", size: 4, delay: 2.4 },
  { top: "88%", left: "50%", size: 5, delay: 0.9 },
];

export function CTASection() {
  const t = useTranslations("cta");

  return (
    <section className="relative overflow-hidden bg-[#09090b]">
      {/* ---------- Meteors layer ---------- */}
      <div className="absolute inset-0 z-0">
        <Meteors number={15} />
      </div>

      {/* ---------- Floating accent dots ---------- */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {DOTS.map((dot, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#2563eb]/40"
            style={{
              top: dot.top,
              left: dot.left,
              right: (dot as { right?: string }).right,
              width: dot.size,
              height: dot.size,
              animation: `ctaFloat 6s ease-in-out ${dot.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* ---------- Lamp spotlight ---------- */}
      <LampEffect className="min-h-[600px] md:min-h-[650px] bg-[#09090b]">
        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* ---- Chrome / metallic gradient title ---- */}
            <div
              className="font-[family-name:var(--font-cabinet)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 0%, #2563eb 50%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <TextReveal text={t("title")} className="" />
            </div>

            {/* ---- Subtitle ---- */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-zinc-400"
            >
              {t("subtitle")}
            </motion.p>

            {/* ---- Secondary tagline with typing reveal ---- */}
            <motion.p
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
              className="mt-3 text-sm font-medium tracking-wide text-[#2563eb]/80 overflow-hidden whitespace-nowrap mx-auto inline-block border-r-2 border-[#2563eb]/60"
              style={{
                animation: "ctaBlink 0.75s step-end infinite",
              }}
            >
              {t("tagline")}
            </motion.p>

            {/* ---- CTA button with pulsing glow rings ---- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 inline-block relative"
            >
              {/* Concentric pulsing glow rings */}
              <span className="absolute inset-0 -m-3 rounded-2xl bg-[#2563eb]/20 animate-[ctaPulseRing1_2.5s_ease-out_infinite]" />
              <span className="absolute inset-0 -m-5 rounded-2xl bg-[#2563eb]/10 animate-[ctaPulseRing2_2.5s_ease-out_0.4s_infinite]" />
              <span className="absolute inset-0 -m-7 rounded-2xl bg-[#2563eb]/5 animate-[ctaPulseRing3_2.5s_ease-out_0.8s_infinite]" />

              <MagneticButton>
                <Button href="/soumission" size="lg" className="relative z-10">
                  {t("button")}
                  <ArrowRight size={20} />
                </Button>
              </MagneticButton>
            </motion.div>
          </div>
        </Container>
      </LampEffect>

      {/* ---------- Inline keyframes ---------- */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes ctaFloat {
              0%   { transform: translateY(0px)  scale(1);   opacity: 0.4; }
              100% { transform: translateY(-18px) scale(1.3); opacity: 0.8; }
            }
            @keyframes ctaBlink {
              50% { border-color: transparent; }
            }
            @keyframes ctaPulseRing1 {
              0%   { transform: scale(1);   opacity: 0.5; }
              100% { transform: scale(1.35); opacity: 0;   }
            }
            @keyframes ctaPulseRing2 {
              0%   { transform: scale(1);   opacity: 0.35; }
              100% { transform: scale(1.45); opacity: 0;    }
            }
            @keyframes ctaPulseRing3 {
              0%   { transform: scale(1);   opacity: 0.2; }
              100% { transform: scale(1.55); opacity: 0;   }
            }
          `,
        }}
      />
    </section>
  );
}
