"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  ArrowLeft,
  Calculator as CalcIcon,
  Download,
  FileText,
  Shield,
  Award,
  Sparkles,
  Zap,
  Crown,
  Clock,
  CheckCircle2,
  Tag,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { products } from "@/lib/products";
import {
  calculateEstimate,
  formatPrice,
  isAprilPromoActive,
  applyAprilPromo,
  APRIL_PROMO_PERCENT,
  type PriceEstimate,
} from "@/lib/pricing";
import { generateEstimatePDF } from "@/lib/generate-pdf";
import { cn } from "@/lib/cn";
import { trackInitiateCheckout } from "@/lib/fb-pixel";

/* ──────────────────────────────────────────────
   CONSTANTS & TYPES
   ────────────────────────────────────────────── */
const inputClasses =
  "w-full rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all duration-300";

const projectTypes = [
  "garage",
  "basement",
  "commercial",
  "industrial",
  "restaurant",
  "warehouse",
] as const;

type Step = 1 | 2 | 3 | 4;

const STEP_LABELS = ["stepLabel1", "stepLabel2", "stepLabel3", "stepLabel4"] as const;

/* ──────────────────────────────────────────────
   PREMIUM SLUGS for badge logic
   ────────────────────────────────────────────── */
const METALLIC_SLUGS = ["sci-metallic-system"];
const POLYUREA_SLUGS = ["sci-polyurea-flake-system"];
const PREMIUM_SLUGS = [...METALLIC_SLUGS, ...POLYUREA_SLUGS];

/* smart-choice: map project types to recommended systems */
const SMART_CHOICES: Record<string, string[]> = {
  garage: ["sci-polyurea-flake-system", "sci-flake-system", "sci-100-coating-system"],
  basement: ["sci-flake-system", "sci-100-coating-system", "sci-metallic-system"],
  commercial: ["sci-metallic-system", "sci-quartz-broadcast-system", "sci-quartz-trowel-system"],
  industrial: ["sci-cementitious-polyurethane", "sci-trowel-mortar-system", "sci-slurry-system"],
  restaurant: ["sci-cementitious-polyurethane", "sci-quartz-trowel-system", "sci-slurry-system"],
  warehouse: ["sci-100-coating-system", "sci-broadcast-system", "sci-op-system"],
};

/* ──────────────────────────────────────────────
   ANIMATED PRICE COUNTER — slot-machine style
   ────────────────────────────────────────────── */
function PriceCounter({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value, motionVal, rounded]);

  return (
    <span className={className}>
      <span className="text-accent">$</span>
      {display.toLocaleString()}
    </span>
  );
}

/* ──────────────────────────────────────────────
   CELEBRATION PARTICLES (confetti-like)
   ────────────────────────────────────────────── */
function CelebrationParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.5 + Math.random() * 1.5,
        size: 4 + Math.random() * 6,
        color: [
          "#C9A84C",
          "#D4B75E",
          "#E8D08E",
          "#22c55e",
          "#f59e0b",
          "#d97706",
          "#7c3aed",
        ][Math.floor(Math.random() * 7)],
        rotation: Math.random() * 360,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-1">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 1,
            x: `${p.x}%`,
            y: "50%",
            scale: 0,
            rotate: 0,
          }}
          animate={{
            opacity: [1, 1, 0],
            y: [
              "50%",
              `${-20 - Math.random() * 40}%`,
              `${110 + Math.random() * 20}%`,
            ],
            x: [
              `${p.x}%`,
              `${p.x + (Math.random() - 0.5) * 30}%`,
              `${p.x + (Math.random() - 0.5) * 50}%`,
            ],
            scale: [0, 1, 0.3],
            rotate: [0, p.rotation, p.rotation * 2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   ACHIEVEMENT BADGE
   ────────────────────────────────────────────── */
function AchievementBadge({
  icon,
  label,
  visible,
}: {
  icon: React.ReactNode;
  label: string;
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -10 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(217,119,6,0.15), rgba(245,158,11,0.25))",
            border: "1px solid rgba(245,158,11,0.3)",
          }}
        >
          {/* Shine sweep animation */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          />
          <span className="relative z-10 text-amber-400">{icon}</span>
          <span className="relative z-10 text-amber-200">{label}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────
   PROGRESS BAR with step-completion dopamine
   ────────────────────────────────────────────── */
function ProgressBar({
  currentStep,
  labels,
}: {
  currentStep: Step;
  labels: string[];
}) {
  const progress = ((currentStep - 1) / 3) * 100;
  const [prevStep, setPrevStep] = useState<Step>(1);
  const justAdvanced = currentStep > prevStep;

  useEffect(() => {
    const timeout = setTimeout(() => setPrevStep(currentStep), 600);
    return () => clearTimeout(timeout);
  }, [currentStep]);

  return (
    <div className="max-w-2xl mx-auto mb-10">
      {/* Bar track */}
      <div className="relative h-1.5 rounded-full bg-white/[0.06] mb-4 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #C9A84C 0%, #D4B75E 60%, #E8D08E 100%)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        {/* Glow effect on the leading edge */}
        <motion.div
          className="absolute inset-y-0 w-8 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201,168,76,0.6) 0%, transparent 70%)",
            filter: "blur(4px)",
          }}
          initial={{ left: "0%" }}
          animate={{ left: `${Math.max(0, progress - 2)}%` }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex flex-col items-center gap-1.5">
            <motion.div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 relative",
                currentStep >= s
                  ? "bg-accent text-white"
                  : "bg-card border border-border text-muted"
              )}
              animate={
                justAdvanced && currentStep === s
                  ? {
                      scale: [1, 1.3, 1],
                      boxShadow: [
                        "0 0 0px rgba(201,168,76,0)",
                        "0 0 20px rgba(201,168,76,0.6)",
                        "0 0 0px rgba(201,168,76,0)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}
            >
              {currentStep > s ? (
                <CheckCircle2 size={14} />
              ) : (
                s
              )}
            </motion.div>
            <span
              className={cn(
                "text-[10px] sm:text-xs font-medium text-center leading-tight max-w-[80px]",
                currentStep >= s ? "text-foreground" : "text-muted"
              )}
            >
              {labels[s - 1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   SCARCITY CUE
   ────────────────────────────────────────────── */
function ScarcityCue({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center justify-center gap-2 text-xs text-amber-400/80 mt-3"
    >
      <Clock size={12} className="animate-pulse" />
      <span>{label}</span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN CALCULATOR SECTION
   ══════════════════════════════════════════════ */
export function CalculatorSection() {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("calculator");

  const [step, setStep] = useState<Step>(1);
  const [sqft, setSqft] = useState("");
  const [projectType, setProjectType] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  /* ── April promo check ────────────────────── */
  const promoActive = isAprilPromoActive();

  /* ── Badge logic ──────────────────────────── */
  const isPremiumSelection = PREMIUM_SLUGS.includes(selectedProduct);
  const isSmartChoice =
    !!projectType &&
    !!selectedProduct &&
    (SMART_CHOICES[projectType]?.includes(selectedProduct) ?? false);

  /* ── Live price preview ───────────────────── */
  const liveEstimate = useMemo(() => {
    if (!selectedProduct || !sqft || Number(sqft) <= 0) return null;
    return calculateEstimate(selectedProduct, Number(sqft));
  }, [selectedProduct, sqft]);

  /* ── Retail "anchor" price (1.4x markup) ──── */
  const retailMin = liveEstimate ? Math.round(liveEstimate.totalMin * 1.4) : 0;
  const retailMax = liveEstimate ? Math.round(liveEstimate.totalMax * 1.4) : 0;

  /* ── Step navigation ──────────────────────── */
  const canProceedStep1 = !!projectType;
  const canProceedStep2 = !!sqft && Number(sqft) > 0 && !!selectedProduct;
  const canProceedStep3 = !!contactInfo.name && !!contactInfo.email;

  const goToStep = useCallback((s: Step) => setStep(s), []);

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceedStep3) return;

    setSubmitting(true);

    const result = calculateEstimate(selectedProduct, Number(sqft));
    setEstimate(result);

    try {
      await fetch("/api/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contactInfo,
          sqft: Number(sqft),
          projectType,
          product: selectedProduct,
          locale,
          estimateMin: result?.totalMin,
          estimateMax: result?.totalMax,
        }),
      });
    } catch {
      // Non-blocking — lead capture failure shouldn't block price reveal
    }

    setSubmitting(false);
    setShowCelebration(true);
    goToStep(4);

    // Hide confetti after animation
    setTimeout(() => setShowCelebration(false), 3500);
  };

  const handleDownloadPDF = async () => {
    if (!estimate) return;
    await generateEstimatePDF(estimate, locale, contactInfo);
    trackInitiateCheckout({ value: estimate.totalMin });
  };

  /* ── Step labels for progress bar ─────────── */
  const stepLabels = STEP_LABELS.map((key) => t(key));

  return (
    <section className="pt-16 pb-24">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
              <CalcIcon size={16} />
              {t("tagline")}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-[family-name:var(--font-cabinet)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-muted max-w-xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* April Promo Banner */}
        {promoActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 mx-auto max-w-2xl"
          >
            <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-accent/[0.06] backdrop-blur-sm px-6 py-4 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/[0.08] to-accent/0" />
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.4) 50%, transparent 100%)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
              />
              <p className="relative flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-accent tracking-wide">
                <Tag size={16} />
                {t("promo")}
              </p>
            </div>
          </motion.div>
        )}

        {/* Progress Bar (4 steps) */}
        <ProgressBar currentStep={step} labels={stepLabels} />

        {/* Achievement badges row */}
        <div className="max-w-2xl mx-auto mb-4 flex flex-wrap items-center justify-center gap-2 min-h-[32px]">
          <AchievementBadge
            icon={<Crown size={12} />}
            label={t("badges.premium")}
            visible={isPremiumSelection}
          />
          <AchievementBadge
            icon={<Zap size={12} />}
            label={t("badges.smart")}
            visible={isSmartChoice}
          />
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto relative">
          {/* Background glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full opacity-[0.03] -z-10"
            style={{
              background:
                "radial-gradient(circle, #C9A84C 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />

          <AnimatePresence mode="wait">
            {/* ═══ STEP 1: Surface Type ═══════════ */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("projectType")} *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {projectTypes.map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => setProjectType(pt)}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-sm font-medium transition-all cursor-pointer text-left",
                          projectType === pt
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border bg-surface text-muted hover:text-foreground hover:border-muted-foreground"
                        )}
                      >
                        {t(`projectTypes.${pt}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => goToStep(2)}
                  disabled={!canProceedStep1}
                  className="w-full"
                  size="lg"
                >
                  {t("next")}
                  <ArrowRight size={18} />
                </Button>
              </motion.div>
            )}

            {/* ═══ STEP 2: Area Size + System ═════ */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 space-y-5"
              >
                {/* Surface Area */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("surfaceArea")} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                    placeholder={t("surfacePlaceholder")}
                    className={inputClasses}
                  />
                  {Number(sqft) >= 1000 && (
                    <p className="mt-1.5 text-xs text-success flex items-center gap-1">
                      <Shield size={12} />
                      {Number(sqft) >= 10000
                        ? t("discount20")
                        : Number(sqft) >= 5000
                        ? t("discount15")
                        : Number(sqft) >= 2500
                        ? t("discount10")
                        : t("discount5")}
                    </p>
                  )}
                </div>

                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("selectSystem")} *
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className={cn(inputClasses, "appearance-none")}
                  >
                    <option value="">{t("selectSystemPlaceholder")}</option>
                    {products.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name[locale]} — {p.specs.chemistry}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Live price preview */}
                <AnimatePresence>
                  {liveEstimate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-xl bg-accent/5 border border-accent/20 p-4 text-center">
                        <p className="text-xs text-muted mb-1">
                          {t("livePreview")}
                        </p>
                        {/* Retail "anchor" price — crossed out */}
                        <div className="flex items-center justify-center gap-3 mb-1">
                          <span className="text-sm text-muted-foreground line-through">
                            {t("retailValue")} {formatPrice(retailMin)} – {formatPrice(retailMax)}
                          </span>
                        </div>
                        {/* Factory direct price — shown as "before promo" if promo active */}
                        {promoActive ? (
                          <>
                            <p className="text-xs text-muted-foreground mb-0.5">
                              {t("promoBefore")}
                            </p>
                            <div className="flex items-center justify-center gap-1 mb-2">
                              <span className="text-lg text-muted-foreground line-through font-medium font-[family-name:var(--font-cabinet)]">
                                {formatPrice(liveEstimate.totalMin)} – {formatPrice(liveEstimate.totalMax)}
                              </span>
                            </div>
                            <div className="rounded-lg bg-accent/10 border border-accent/30 px-3 py-2">
                              <p className="text-xs text-accent font-semibold mb-1 flex items-center justify-center gap-1">
                                <Tag size={12} />
                                {t("promoAfter")}
                              </p>
                              <div className="flex items-center justify-center gap-1">
                                <span className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-cabinet)]">
                                  <PriceCounter
                                    value={applyAprilPromo(liveEstimate.totalMin)}
                                    className="text-accent"
                                  />
                                </span>
                                <span className="text-lg text-muted mx-1">–</span>
                                <span className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-cabinet)]">
                                  <PriceCounter
                                    value={applyAprilPromo(liveEstimate.totalMax)}
                                    className="text-accent"
                                  />
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xs text-accent font-medium mr-1">
                              {t("factoryDirect")}
                            </span>
                            <span className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-cabinet)]">
                              <PriceCounter
                                value={liveEstimate.totalMin}
                                className="text-accent"
                              />
                            </span>
                            <span className="text-lg text-muted mx-1">–</span>
                            <span className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-cabinet)]">
                              <PriceCounter
                                value={liveEstimate.totalMax}
                                className="text-accent"
                              />
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Nav */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="px-4 py-3 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <Button
                    onClick={() => goToStep(3)}
                    disabled={!canProceedStep2}
                    className="flex-1"
                    size="lg"
                  >
                    {t("next")}
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 3: Email Gate ═════════════ */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 md:p-8"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
                    <FileText size={32} className="text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">
                    {t("emailGate.title")}
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    {t("emailGate.subtitle")}
                  </p>
                </div>

                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("emailGate.name")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo.name}
                      onChange={(e) =>
                        setContactInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("emailGate.email")} *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactInfo.email}
                      onChange={(e) =>
                        setContactInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("emailGate.phone")}
                    </label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) =>
                        setContactInfo((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className={inputClasses}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="px-4 py-3 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <MagneticButton className="flex-1">
                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={submitting}
                      >
                        {submitting
                          ? t("calculating")
                          : t("emailGate.reveal")}
                        <ArrowRight size={18} />
                      </Button>
                    </MagneticButton>
                  </div>

                  {/* Scarcity cue */}
                  <ScarcityCue label={t("scarcity")} />
                </form>
              </motion.div>
            )}

            {/* ═══ STEP 4: Price Reveal + Celebration ═══ */}
            {step === 4 && estimate && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative"
              >
                {/* Celebration particles */}
                {showCelebration && <CelebrationParticles />}

                {/* "Your Quote is Ready" reveal */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-center mb-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="w-16 h-16 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto mb-4"
                  >
                    <Sparkles size={28} className="text-accent" />
                  </motion.div>
                  <h2 className="font-[family-name:var(--font-cabinet)] text-2xl sm:text-3xl font-bold">
                    {t("result.ready")}
                  </h2>
                </motion.div>

                {/* Glass morphism quote card */}
                <GlassCard className="p-6 md:p-8">
                  <h3 className="font-[family-name:var(--font-cabinet)] text-lg font-semibold mb-6 text-center">
                    {t("result.title")}
                  </h3>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-sm text-muted">
                        {t("result.system")}
                      </span>
                      <span className="text-sm font-medium">
                        {estimate.product.name[locale]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-sm text-muted">
                        {t("result.area")}
                      </span>
                      <span className="text-sm font-medium">
                        {estimate.sqft.toLocaleString()} {t("result.sqft")}
                      </span>
                    </div>
                    {estimate.discount.percent > 0 && (
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-sm text-muted">
                          {t("result.discount")}
                        </span>
                        <span className="text-sm font-medium text-success">
                          -{estimate.discount.label}
                        </span>
                      </div>
                    )}
                    {promoActive && (
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-sm text-muted flex items-center gap-1">
                          <Tag size={12} className="text-accent" />
                          {t("promoLabel")}
                        </span>
                        <span className="text-sm font-medium text-accent">
                          -{APRIL_PROMO_PERCENT}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Anchoring: Retail vs Factory Direct */}
                  <div className="rounded-xl bg-accent/5 border border-accent/20 p-6 text-center mb-2">
                    {/* Crossed-out retail price */}
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground line-through">
                        {t("retailValue")} {formatPrice(Math.round(estimate.totalMin * 1.4))} – {formatPrice(Math.round(estimate.totalMax * 1.4))}
                      </span>
                    </div>
                    {promoActive ? (
                      <>
                        <p className="text-xs text-muted-foreground mb-1">
                          {t("promoBefore")}
                        </p>
                        <p className="text-lg text-muted-foreground line-through font-medium font-[family-name:var(--font-cabinet)] mb-2">
                          {formatPrice(estimate.totalMin)} – {formatPrice(estimate.totalMax)}
                        </p>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="rounded-lg bg-accent/10 border border-accent/30 px-4 py-3"
                        >
                          <p className="text-xs text-accent font-semibold mb-1 flex items-center justify-center gap-1">
                            <Tag size={12} />
                            {t("promoAfter")}
                          </p>
                          <p className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-cabinet)] text-accent">
                            {formatPrice(applyAprilPromo(estimate.totalMin))} –{" "}
                            {formatPrice(applyAprilPromo(estimate.totalMax))}
                          </p>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-accent font-medium mb-2">
                          {t("factoryDirect")}
                        </p>
                        <motion.p
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-cabinet)] text-accent"
                        >
                          {formatPrice(estimate.totalMin)} –{" "}
                          {formatPrice(estimate.totalMax)}
                        </motion.p>
                      </>
                    )}
                  </div>

                  {/* Savings callout */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col items-center gap-1.5 mb-6"
                  >
                    <div className="flex items-center gap-1.5">
                      <Award size={14} className="text-success" />
                      <span className="text-xs font-medium text-success">
                        {t("result.savings")}
                      </span>
                    </div>
                    {promoActive && (
                      <div className="flex items-center gap-1.5">
                        <Tag size={14} className="text-accent" />
                        <span className="text-xs font-semibold text-accent">
                          {t("promoSavings", {
                            amount: formatPrice(
                              estimate.totalMin -
                                applyAprilPromo(estimate.totalMin)
                            ),
                          })}
                        </span>
                      </div>
                    )}
                  </motion.div>

                  {/* Note */}
                  <p className="text-xs text-muted-foreground mb-8">
                    {t("result.note")}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleDownloadPDF}
                      variant="secondary"
                      className="flex-1"
                    >
                      <Download size={18} />
                      {t("result.downloadPdf")}
                    </Button>
                    <MagneticButton className="flex-1">
                      <Button href="/soumission" className="w-full">
                        {t("result.requestQuote")}
                        <ArrowRight size={18} />
                      </Button>
                    </MagneticButton>
                  </div>

                  {/* Priority processing badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-center gap-2 mt-4 text-xs text-amber-400/70"
                  >
                    <Zap size={12} />
                    <span>{t("result.priority")}</span>
                  </motion.div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
