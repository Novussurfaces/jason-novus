"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Shield,
  CheckCircle,
  Star,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
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

export function GarageLanding() {
  const t = useTranslations("lpGarage");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", surfaceArea: "", message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "lp-garage", projectType: "garage" }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setFormData({ name: "", email: "", phone: "", surfaceArea: "", message: "" });
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
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Aurora-style background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.08] via-background to-background" />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(ellipse, #2563eb 0%, transparent 70%)", filter: "blur(80px)" }}
          />
          <div
            className="absolute top-[20%] right-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", filter: "blur(60px)" }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-20 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-12">
            <Image src="/logo-icon.svg" alt="Novus Surfaces" width={36} height={36} className="rounded-xl" />
            <span className="font-[family-name:var(--font-cabinet)] text-xl font-bold">
              Novus<span className="text-accent ml-0.5">Surfaces</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — Copy */}
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={blurUp}>
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/[0.07] px-4 py-1.5 text-sm font-medium text-accent mb-6 backdrop-blur-sm">
                  <Shield size={16} />
                  {t("badge")}
                </span>
              </motion.div>

              <motion.h1 variants={blurUp} className="font-[family-name:var(--font-cabinet)] text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
                {t("title")}{" "}
                <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
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

              {/* Quick stats */}
              <motion.div variants={blurUp} className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { value: "3$", label: t("statPrice") },
                  { value: "1", label: t("statDay") },
                  { value: "15+", label: t("statYears") },
                ].map((stat) => (
                  <div key={stat.label} className="text-center rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-3">
                    <div className="text-2xl font-bold font-[family-name:var(--font-cabinet)]">{stat.value}</div>
                    <div className="text-xs text-muted/60">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.3 }}
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
                    <h2 className="text-xl font-semibold text-center mb-1">{t("formTitle")}</h2>
                    <p className="text-sm text-muted/60 text-center mb-4">{t("formSubtitle")}</p>

                    <input type="text" name="name" required placeholder={t("formName")} value={formData.name} onChange={handleChange} className={inputClasses} />
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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-[family-name:var(--font-cabinet)] text-2xl font-bold text-center mb-10"
          >
            {t("socialTitle")}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
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
              </motion.div>
            ))}
          </div>
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
