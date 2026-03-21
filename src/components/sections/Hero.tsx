"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/* ─────────────────────────────────────────────
   ANIMATED COUNTER (self-contained, Framer Motion)
   ───────────────────────────────────────────── */
function Counter({
  end,
  suffix = "",
  duration = 2.4,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionVal, end, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [isInView, end, duration, motionVal]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return unsub;
  }, [rounded]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────
   STATS DATA
   ───────────────────────────────────────────── */
const stats = [
  { end: 13, suffix: "", key: "products" },
  { end: 25, suffix: "+", key: "years" },
  { end: 100, suffix: "%", key: "coverage" },
  { end: 24, suffix: "h", key: "satisfaction" },
];

/* ─────────────────────────────────────────────
   PARTICLES (pure CSS, generated once)
   ───────────────────────────────────────────── */
function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${(i * 3.57 + 7) % 100}%`,
      size: 1.5 + (i % 4) * 0.8,
      animDuration: `${14 + (i % 10) * 2.5}s`,
      animDelay: `${(i * 0.7) % 12}s`,
      opacity: 0.08 + (i % 5) * 0.05,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {particles.map((p) => (
        <span
          key={p.id}
          className="hero-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: p.animDuration,
            animationDelay: p.animDelay,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FRAMER VARIANTS
   ───────────────────────────────────────────── */
const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const blurUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const statCardVariant = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)", scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

/* ─────────────────────────────────────────────
   KEYFRAMES (injected via <style>)
   ───────────────────────────────────────────── */
const heroStyles = `
/* ── Aurora blobs ── */
@keyframes aurora-drift-1 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  25% { transform: translate(15%, -20%) scale(1.15); }
  50% { transform: translate(-10%, 10%) scale(0.9); }
  75% { transform: translate(20%, 5%) scale(1.1); }
}
@keyframes aurora-drift-2 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  25% { transform: translate(-20%, 15%) scale(1.2); }
  50% { transform: translate(15%, -10%) scale(0.85); }
  75% { transform: translate(-5%, 20%) scale(1.05); }
}
@keyframes aurora-drift-3 {
  0%, 100% { transform: translate(0%, 0%) scale(1.05); }
  33% { transform: translate(25%, -15%) scale(0.9); }
  66% { transform: translate(-15%, 20%) scale(1.15); }
}
@keyframes aurora-drift-4 {
  0%, 100% { transform: translate(0%, 0%) scale(0.95); }
  30% { transform: translate(-25%, -10%) scale(1.1); }
  60% { transform: translate(10%, 25%) scale(1); }
}
@keyframes aurora-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

/* ── Chrome shimmer ── */
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* ── Glow pulse on the NOVUS word ── */
@keyframes glow-pulse {
  0%, 100% { text-shadow: 0 0 20px rgba(37,99,235,0.0), 0 0 60px rgba(37,99,235,0.0); }
  50% { text-shadow: 0 0 30px rgba(37,99,235,0.3), 0 0 80px rgba(124,58,237,0.15); }
}

/* ── Particle float ── */
@keyframes particle-float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: var(--particle-opacity, 0.15);
  }
  90% {
    opacity: var(--particle-opacity, 0.15);
  }
  100% {
    transform: translateY(-10vh) rotate(360deg);
    opacity: 0;
  }
}

.hero-particle {
  position: absolute;
  bottom: -10px;
  border-radius: 50%;
  background: white;
  animation: particle-float linear infinite;
}

/* ── Scroll indicator bounce ── */
@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

/* ── Horizontal line draw ── */
@keyframes line-draw {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

/* ── Badge glow ring ── */
@keyframes badge-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(37,99,235,0.15), inset 0 0 8px rgba(37,99,235,0.05); }
  50% { box-shadow: 0 0 20px rgba(37,99,235,0.3), inset 0 0 12px rgba(37,99,235,0.1); }
}

/* ── Stat card hover shimmer ── */
@keyframes stat-shimmer {
  0% { left: -100%; }
  100% { left: 200%; }
}
`;

/* ─────────────────────────────────────────────
   HERO COMPONENT
   ───────────────────────────────────────────── */
export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050508]">
      {/* Injected keyframes */}
      <style dangerouslySetInnerHTML={{ __html: heroStyles }} />

      {/* ═══════ A) AURORA BACKGROUND ═══════ */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#0a0a12] to-[#050508]" />

        {/* Aurora blob 1 — electric blue, top-left */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vh] rounded-full mix-blend-screen"
          style={{
            background: "radial-gradient(ellipse at center, rgba(37,99,235,0.35) 0%, rgba(37,99,235,0.08) 50%, transparent 70%)",
            filter: "blur(80px)",
            animation: "aurora-drift-1 18s ease-in-out infinite, aurora-pulse 8s ease-in-out infinite",
          }}
        />

        {/* Aurora blob 2 — deep purple, center-right */}
        <div
          className="absolute top-[10%] -right-[15%] w-[65vw] h-[65vh] rounded-full mix-blend-screen"
          style={{
            background: "radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, rgba(124,58,237,0.06) 50%, transparent 70%)",
            filter: "blur(90px)",
            animation: "aurora-drift-2 22s ease-in-out infinite, aurora-pulse 10s ease-in-out 2s infinite",
          }}
        />

        {/* Aurora blob 3 — cyan, bottom-center */}
        <div
          className="absolute -bottom-[15%] left-[20%] w-[60vw] h-[55vh] rounded-full mix-blend-screen"
          style={{
            background: "radial-gradient(ellipse at center, rgba(6,182,212,0.25) 0%, rgba(6,182,212,0.05) 50%, transparent 70%)",
            filter: "blur(100px)",
            animation: "aurora-drift-3 20s ease-in-out infinite, aurora-pulse 12s ease-in-out 4s infinite",
          }}
        />

        {/* Aurora blob 4 — blue-purple mix, center */}
        <div
          className="absolute top-[30%] left-[30%] w-[50vw] h-[50vh] rounded-full mix-blend-screen"
          style={{
            background: "radial-gradient(ellipse at center, rgba(37,99,235,0.15) 0%, rgba(124,58,237,0.1) 40%, transparent 70%)",
            filter: "blur(120px)",
            animation: "aurora-drift-4 25s ease-in-out infinite",
          }}
        />

        {/* Noise texture overlay for grain */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-transparent opacity-60" />
        {/* Bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-80" />
      </div>

      {/* ═══════ F) PARTICLE OVERLAY ═══════ */}
      <Particles />

      {/* ═══════ CONTENT ═══════ */}
      <Container className="relative z-10 pt-32 pb-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={blurUp} className="flex justify-center">
            <span
              className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/[0.07] px-5 py-2 text-sm font-medium text-accent/90 backdrop-blur-md"
              style={{ animation: "badge-glow 4s ease-in-out infinite" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              {t("badge")}
            </span>
          </motion.div>

          {/* ═══════ B) CHROME METALLIC HEADLINE ═══════ */}
          <motion.h1
            variants={blurUp}
            className="mt-8 font-[family-name:var(--font-cabinet)] text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem] 2xl:text-[6.5rem] leading-[0.95]"
          >
            <span className="block text-foreground/90">
              {t("title")}
            </span>
            <span
              className="relative inline-block mt-2"
              style={{
                background:
                  "linear-gradient(90deg, #a0a0a0, #e8e8e8, #ffffff, #e8e8e8, #a0a0a0, #ffffff, #e8e8e8)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s linear infinite, glow-pulse 4s ease-in-out infinite",
              }}
            >
              {t("titleHighlight")}
            </span>

            {/* Animated underline accent */}
            <motion.span
              className="block mx-auto mt-4 h-[3px] rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, #2563eb, #7c3aed, #06b6d4, transparent)",
                transformOrigin: "center",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={blurUp}
            className="mt-8 text-lg sm:text-xl lg:text-2xl text-muted max-w-3xl mx-auto leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={blurUp}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button href="/soumission" size="lg" className="group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                {t("cta")}
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            <Button href="/produits" variant="secondary" size="lg" className="backdrop-blur-sm">
              {t("ctaSecondary")}
            </Button>
          </motion.div>

          {/* ═══════ C) ANIMATED COUNTERS ═══════ */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.key}
                variants={statCardVariant}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm px-6 py-8 text-center transition-colors duration-500 hover:border-accent/20 hover:bg-white/[0.04]"
              >
                {/* Shimmer on hover */}
                <div
                  className="absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ animation: "stat-shimmer 2s ease-in-out infinite" }}
                />

                <div className="relative z-10">
                  <div
                    className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-cabinet)] tracking-tight"
                    style={{
                      background: "linear-gradient(180deg, #ffffff 0%, #a1a1aa 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    <Counter end={stat.end} suffix={stat.suffix} />
                  </div>
                  <div className="mt-2 text-sm text-muted/70 uppercase tracking-widest font-medium">
                    {t(`stats.${stat.key}`)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>

      {/* ═══════ E) SCROLL INDICATOR ═══════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div
          className="flex flex-col items-center gap-2"
          style={{ animation: "scroll-bounce 2.5s ease-in-out infinite" }}
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted/40 font-medium">
            Scroll
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-muted/40 to-transparent" />
          <ChevronDown size={16} className="text-muted/40" />
        </div>
      </motion.div>
    </section>
  );
}
