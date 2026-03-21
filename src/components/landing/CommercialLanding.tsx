"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Factory,
  Warehouse,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/cn";

const inputClasses =
  "w-full rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all duration-300";

const sectors = [
  { icon: Warehouse, key: "sectorWarehouse" },
  { icon: Building2, key: "sectorCommercial" },
  { icon: Factory, key: "sectorIndustrial" },
  { icon: UtensilsCrossed, key: "sectorFood" },
] as const;

const valueProps = [
  { icon: ShieldCheck, key: "vp1" },
  { icon: TrendingUp, key: "vp2" },
  { icon: Clock, key: "vp3" },
  { icon: Building2, key: "vp4" },
] as const;

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

export function CommercialLanding() {
  const t = useTranslations("lpCommercial");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "",
    surfaceArea: "", projectType: "", message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        body: JSON.stringify({ ...formData, source: "lp-commercial" }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setFormData({ name: "", email: "", phone: "", company: "", surfaceArea: "", projectType: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.08] via-background to-background" />
          <div
            className="absolute top-0 left-1/3 w-[700px] h-[500px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(ellipse, #2563eb 0%, transparent 70%)", filter: "blur(80px)" }}
          />
          <div
            className="absolute top-[30%] right-0 w-[500px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #059669 0%, transparent 70%)", filter: "blur(60px)" }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-20 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-12">
            <Image src="/logo-icon.svg" alt="Novus Surfaces" width={36} height={36} className="rounded-xl" />
            <span className="font-[family-name:var(--font-cabinet)] text-xl font-bold">
              Novus<span className="text-accent ml-0.5">Surfaces</span>
            </span>
            <span className="ml-2 rounded-full bg-accent/10 border border-accent/20 px-3 py-0.5 text-xs font-medium text-accent">
              {t("b2b")}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left — Copy */}
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.h1 variants={blurUp} className="font-[family-name:var(--font-cabinet)] text-4xl font-bold tracking-tight sm:text-5xl leading-tight">
                {t("title")}{" "}
                <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                  {t("titleHighlight")}
                </span>
              </motion.h1>

              <motion.p variants={blurUp} className="mt-6 text-lg text-muted leading-relaxed">
                {t("subtitle")}
              </motion.p>

              {/* Sectors */}
              <motion.div variants={blurUp} className="mt-8 grid grid-cols-4 gap-3">
                {sectors.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.key} className="text-center rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4 transition-all duration-300 hover:border-accent/20 hover:bg-white/[0.04]">
                      <Icon size={24} className="text-accent mx-auto mb-2" />
                      <span className="text-xs font-medium text-muted/60">{t(s.key)}</span>
                    </div>
                  );
                })}
              </motion.div>

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
            </motion.div>

            {/* Right — Form */}
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
                    <h2 className="text-xl font-semibold text-center mb-1">{t("formTitle")}</h2>
                    <p className="text-sm text-muted/60 text-center mb-4">{t("formSubtitle")}</p>

                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" name="name" required placeholder={t("formName")} value={formData.name} onChange={handleChange} className={inputClasses} />
                      <input type="text" name="company" required placeholder={t("formCompany")} value={formData.company} onChange={handleChange} className={inputClasses} />
                    </div>
                    <input type="email" name="email" required placeholder={t("formEmail")} value={formData.email} onChange={handleChange} className={inputClasses} />
                    <input type="tel" name="phone" required placeholder={t("formPhone")} value={formData.phone} onChange={handleChange} className={inputClasses} />
                    <div className="grid grid-cols-2 gap-3">
                      <select name="projectType" required value={formData.projectType} onChange={handleChange} className={cn(inputClasses, "appearance-none")}>
                        <option value="">{t("formProjectType")}</option>
                        <option value="commercial">{t("typeCommercial")}</option>
                        <option value="industrial">{t("typeIndustrial")}</option>
                        <option value="food">{t("typeFood")}</option>
                        <option value="warehouse">{t("typeWarehouse")}</option>
                        <option value="institutional">{t("typeInstitutional")}</option>
                      </select>
                      <input type="text" name="surfaceArea" placeholder={t("formArea")} value={formData.surfaceArea} onChange={handleChange} className={inputClasses} />
                    </div>
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

      {/* Footer */}
      <section className="py-10 text-center border-t border-white/[0.04]">
        <div className="h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-8" />
        <p className="text-xs text-muted-foreground/40">{t("footerText")}</p>
      </section>
    </div>
  );
}
