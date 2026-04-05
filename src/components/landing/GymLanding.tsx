"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Shield,
  CheckCircle,
  Star,
  AlertCircle,
  Dumbbell,
  Footprints,
  Paintbrush,
  SprayCan,
  Phone,
  Clock,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const inputClasses =
  "w-full rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all duration-300";

const blurUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const valueProps = [
  { icon: Footprints, key: "vp1" },
  { icon: Shield, key: "vp2" },
  { icon: SprayCan, key: "vp3" },
  { icon: Paintbrush, key: "vp4" },
] as const;

export function GymLanding() {
  const t = useTranslations("lpGym");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "",
    surfaceArea: "", message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "lp-gym", projectType: "gym" }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setFormData({ name: "", email: "", phone: "", company: "", surfaceArea: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const benefits = [1, 2, 3, 4, 5, 6].map((i) => t(`benefit${i}`));
  const reviews = [1, 2, 3].map((i) => ({
    text: t(`review${i}`),
    name: t(`review${i}Name`),
    city: t(`review${i}City`),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Promo Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden border-b border-accent/30 bg-accent/[0.06] backdrop-blur-sm px-4 py-3 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/[0.08] to-accent/0" />
        <p className="relative text-sm sm:text-base font-semibold text-accent tracking-wide flex items-center justify-center gap-2">
          <Flame size={16} className="animate-pulse" />
          {t("promoBanner")}
          <Flame size={16} className="animate-pulse" />
        </p>
        <p className="relative text-xs text-accent/70 mt-0.5 flex items-center justify-center gap-2">
          <Clock size={12} />
          {t("urgency")} — {t("limitedSpots")}
        </p>
      </motion.div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.08] via-background to-background" />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(ellipse, #C9A84C 0%, transparent 70%)", filter: "blur(80px)" }}
          />
          <div
            className="absolute top-[20%] right-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #059669 0%, transparent 70%)", filter: "blur(60px)" }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-12 pb-20 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <Image src="/logo-icon.svg" alt="Novus Epoxy" width={36} height={36} className="rounded-xl" />
            <span className="font-[family-name:var(--font-cabinet)] text-xl font-bold">
              Novus<span className="text-accent ml-0.5">Surfaces</span>
            </span>
            <span className="ml-2 rounded-full bg-accent/10 border border-accent/20 px-3 py-0.5 text-xs font-medium text-accent">
              <Dumbbell size={14} className="inline mr-1" />
              {t("badge")}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left -- Copy */}
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.h1 variants={blurUp} className="font-[family-name:var(--font-cabinet)] text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
                {t("title")}{" "}
                <span className="bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
                  {t("titleHighlight")}
                </span>
              </motion.h1>

              <motion.p variants={blurUp} className="mt-6 text-lg text-muted leading-relaxed">
                {t("subtitle")}
              </motion.p>

              {/* Benefits */}
              <motion.ul variants={stagger} className="mt-8 space-y-3">
                {benefits.map((b) => (
                  <motion.li key={b} variants={blurUp} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                      <CheckCircle size={14} className="text-success" />
                    </div>
                    <span className="text-muted/80">{b}</span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Value Props */}
              <motion.div variants={stagger} className="mt-10 space-y-5">
                {valueProps.map((vp) => {
                  const Icon = vp.icon;
                  return (
                    <motion.div key={vp.key} variants={blurUp} className="flex gap-4 group">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-white/[0.06] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110">
                        <Icon size={20} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{t(`${vp.key}Title`)}</h3>
                        <p className="text-sm text-muted/60 mt-0.5">{t(`${vp.key}Desc`)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Stats with NumberTicker */}
              <motion.div variants={blurUp} className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-3">
                  <div className="text-2xl font-bold font-[family-name:var(--font-cabinet)]">
                    <NumberTicker value={500} suffix="+" delay={0.2} />
                  </div>
                  <div className="text-xs text-muted/60">{t("statProjects")}</div>
                </div>
                <div className="text-center rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-3">
                  <div className="text-2xl font-bold font-[family-name:var(--font-cabinet)]">
                    <NumberTicker value={15} suffix="+" delay={0.4} />
                  </div>
                  <div className="text-xs text-muted/60">{t("statYears")}</div>
                </div>
                <div className="text-center rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-3">
                  <div className="text-2xl font-bold font-[family-name:var(--font-cabinet)]">24h</div>
                  <div className="text-xs text-muted/60">{t("statResponse")}</div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={blurUp} className="mt-8 flex flex-col sm:flex-row gap-3">
                <MagneticButton>
                  <Button href="/soumission" size="lg">
                    {t("ctaQuote")}
                    <ArrowRight size={18} />
                  </Button>
                </MagneticButton>
                <a
                  href="tel:5813072678"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-medium bg-white/[0.06] backdrop-blur-xl text-foreground border border-white/[0.12] hover:border-white/[0.25] hover:bg-white/[0.10] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Phone size={18} className="text-accent" />
                  {t("ctaPhone")}: {t("ctaPhoneNumber")}
                </a>
              </motion.div>
            </motion.div>

            {/* Right -- Form */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:sticky lg:top-8"
            >
              {status === "success" ? (
                <div className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center backdrop-blur-sm">
                  <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-success" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t("successTitle")}</h3>
                  <p className="text-muted/70">{t("successText")}</p>
                </div>
              ) : (
                <SpotlightCard className="p-0">
                  <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
                    {/* Urgency inside form */}
                    <div className="rounded-lg border border-accent/20 bg-accent/[0.04] px-3 py-2 text-center mb-2">
                      <p className="text-xs font-semibold text-accent flex items-center justify-center gap-1.5">
                        <Clock size={12} />
                        {t("urgency")} — {t("limitedSpots")}
                      </p>
                    </div>

                    <h2 className="text-xl font-semibold text-center mb-1">{t("formTitle")}</h2>
                    <p className="text-sm text-muted/60 text-center mb-4">{t("formSubtitle")}</p>

                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" name="name" required placeholder={t("formName")} value={formData.name} onChange={handleChange} className={inputClasses} />
                      <input type="text" name="company" required placeholder={t("formCompany")} value={formData.company} onChange={handleChange} className={inputClasses} />
                    </div>
                    <input type="email" name="email" required placeholder={t("formEmail")} value={formData.email} onChange={handleChange} className={inputClasses} />
                    <input type="tel" name="phone" required placeholder={t("formPhone")} value={formData.phone} onChange={handleChange} className={inputClasses} />
                    <input type="text" name="surfaceArea" placeholder={t("formArea")} value={formData.surfaceArea} onChange={handleChange} className={inputClasses} />
                    <textarea name="message" rows={3} placeholder={t("formMessage")} value={formData.message} onChange={handleChange} className={cn(inputClasses, "resize-none")} />

                    {status === "error" && (
                      <div className="flex items-center gap-2 text-sm text-red-400">
                        <AlertCircle size={16} />
                        {t("formError")}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full rounded-xl bg-accent text-white py-3.5 font-medium text-base flex items-center justify-center gap-2 hover:bg-accent-hover transition-all shadow-lg shadow-accent/25 cursor-pointer disabled:opacity-50"
                    >
                      {status === "sending" ? t("formSending") : t("formSubmit")}
                      <ArrowRight size={18} />
                    </button>

                    <a
                      href="tel:5813072678"
                      className="w-full flex items-center justify-center gap-2 text-sm text-muted/60 hover:text-accent transition-colors pt-1"
                    >
                      <Phone size={14} />
                      {t("ctaPhone")}: {t("ctaPhoneNumber")}
                    </a>
                  </form>
                </SpotlightCard>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-surface/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-cabinet)] text-2xl font-bold text-center mb-10">
              {t("socialTitle")}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <SpotlightCard>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted/70 leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                  <p className="text-sm font-medium">
                    {review.name} — <span className="text-muted/50">{review.city}</span>
                  </p>
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <div className="rounded-2xl border border-accent/20 bg-accent/[0.04] backdrop-blur-sm p-8 sm:p-10">
              <p className="text-sm font-semibold text-accent mb-3 flex items-center justify-center gap-2">
                <Flame size={14} />
                {t("urgency")}
              </p>
              <h3 className="font-[family-name:var(--font-cabinet)] text-2xl sm:text-3xl font-bold mb-4">
                {t("promoBanner")}
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <MagneticButton>
                  <Button href="/soumission" size="lg">
                    {t("ctaQuote")}
                    <ArrowRight size={18} />
                  </Button>
                </MagneticButton>
                <a
                  href="tel:5813072678"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-medium bg-white/[0.06] backdrop-blur-xl text-foreground border border-white/[0.12] hover:border-white/[0.25] hover:bg-white/[0.10] transition-all duration-300"
                >
                  <Phone size={18} className="text-accent" />
                  {t("ctaPhoneNumber")}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <section className="py-10 text-center">
        <div className="h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-8" />
        <p className="text-xs text-muted-foreground/40">{t("footerText")}</p>
      </section>
    </div>
  );
}
