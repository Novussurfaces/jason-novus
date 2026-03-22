"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  ArrowLeft,
  Calculator as CalcIcon,
  Download,
  FileText,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/products";
import { calculateEstimate, formatPrice, type PriceEstimate } from "@/lib/pricing";
import { generateEstimatePDF } from "@/lib/generate-pdf";
import { cn } from "@/lib/cn";

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

type Step = 1 | 2 | 3;

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

  const canProceedStep1 = sqft && projectType && selectedProduct;

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.name || !contactInfo.email) return;

    setSubmitting(true);

    const result = calculateEstimate(selectedProduct, Number(sqft));
    setEstimate(result);

    // Send to API for lead capture
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
    setStep(3);
  };

  const handleDownloadPDF = () => {
    if (!estimate) return;
    generateEstimatePDF(estimate, locale, contactInfo);
  };

  return (
    <section className="pt-32 pb-24">
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

        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    step >= s
                      ? "bg-accent text-white"
                      : "bg-card border border-border text-muted"
                  )}
                >
                  {s}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium hidden sm:inline",
                    step >= s ? "text-foreground" : "text-muted"
                  )}
                >
                  {t(`step${s}`)}
                </span>
                {s < 3 && (
                  <div
                    className={cn(
                      "w-12 h-0.5 mx-2",
                      step > s ? "bg-accent" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto relative">
          {/* Background glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full opacity-[0.03] -z-10"
            style={{ background: "radial-gradient(circle, #2563eb 0%, transparent 70%)", filter: "blur(80px)" }}
          />
          <AnimatePresence mode="wait">
            {/* STEP 1: Project Details */}
            {step === 1 && (
              <motion.div
                key="step1"
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

                {/* Project Type */}
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

                {/* Next button */}
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="w-full"
                  size="lg"
                >
                  {t("next")}
                  <ArrowRight size={18} />
                </Button>
              </motion.div>
            )}

            {/* STEP 2: Email Gate */}
            {step === 2 && (
              <motion.div
                key="step2"
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
                  <h2 className="text-xl font-semibold">{t("emailGate.title")}</h2>
                  <p className="mt-2 text-sm text-muted">{t("emailGate.subtitle")}</p>
                </div>

                <form onSubmit={handleStep2Submit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("emailGate.name")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo.name}
                      onChange={(e) =>
                        setContactInfo((prev) => ({ ...prev, name: e.target.value }))
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
                        setContactInfo((prev) => ({ ...prev, email: e.target.value }))
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
                        setContactInfo((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className={inputClasses}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <Button
                      type="submit"
                      className="flex-1"
                      size="lg"
                      disabled={submitting}
                    >
                      {submitting
                        ? t("calculating")
                        : t("emailGate.reveal")}
                      <ArrowRight size={18} />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3: Price Reveal */}
            {step === 3 && estimate && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 md:p-8"
              >
                <div className="text-center mb-8">
                  <h2 className="font-[family-name:var(--font-cabinet)] text-2xl font-bold">
                    {t("result.title")}
                  </h2>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-sm text-muted">{t("result.system")}</span>
                    <span className="text-sm font-medium">
                      {estimate.product.name[locale]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-sm text-muted">{t("result.area")}</span>
                    <span className="text-sm font-medium">
                      {estimate.sqft.toLocaleString()} {t("result.sqft")}
                    </span>
                  </div>
                  {estimate.discount.percent > 0 && (
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-sm text-muted">{t("result.discount")}</span>
                      <span className="text-sm font-medium text-success">
                        -{estimate.discount.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Price box */}
                <div className="rounded-xl bg-accent/5 border border-accent/20 p-6 text-center mb-6">
                  <p className="text-sm text-muted mb-2">{t("result.priceRange")}</p>
                  <p className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-cabinet)] text-accent">
                    {formatPrice(estimate.totalMin)} – {formatPrice(estimate.totalMax)}
                  </p>
                </div>

                {/* Note */}
                <p className="text-xs text-muted-foreground mb-8">{t("result.note")}</p>

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
                  <Button href="/soumission" className="flex-1">
                    {t("result.requestQuote")}
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
