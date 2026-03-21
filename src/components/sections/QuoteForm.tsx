"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Send, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/products";
import { cn } from "@/lib/cn";

const inputClasses =
  "w-full rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all duration-300";

export function QuoteForm() {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("quote");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    surfaceArea: "",
    product: "",
    message: "",
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
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, locale }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "", email: "", phone: "", company: "",
          projectType: "", surfaceArea: "", product: "", message: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(ellipse at center, #2563eb 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <Container className="relative z-10">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <div className="max-w-2xl mx-auto">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-success/30 bg-success/5 p-10 text-center backdrop-blur-sm"
            >
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} className="text-success" />
              </div>
              <p className="text-lg font-medium">{t("form.success")}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SpotlightCard className="p-0">
                <form
                  onSubmit={handleSubmit}
                  className="p-6 md:p-8 space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted/80">{t("form.name")} *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted/80">{t("form.email")} *</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClasses} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted/80">{t("form.phone")} *</label>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted/80">{t("form.company")}</label>
                      <input type="text" name="company" value={formData.company} onChange={handleChange} className={inputClasses} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted/80">{t("form.projectType")} *</label>
                      <select name="projectType" required value={formData.projectType} onChange={handleChange} className={cn(inputClasses, "appearance-none")}>
                        <option value="">—</option>
                        <option value="residential">{t("form.projectTypes.residential")}</option>
                        <option value="commercial">{t("form.projectTypes.commercial")}</option>
                        <option value="industrial">{t("form.projectTypes.industrial")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted/80">{t("form.surfaceArea")}</label>
                      <input type="text" name="surfaceArea" value={formData.surfaceArea} onChange={handleChange} className={inputClasses} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted/80">{t("form.product")}</label>
                    <select name="product" value={formData.product} onChange={handleChange} className={cn(inputClasses, "appearance-none")}>
                      <option value="">{t("form.selectProduct")}</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.slug}>{p.name[locale]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted/80">{t("form.message")} *</label>
                    <textarea name="message" required rows={5} value={formData.message} onChange={handleChange} className={cn(inputClasses, "resize-none")} />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-sm text-red-400">
                      <AlertCircle size={16} />
                      {t("form.error")}
                    </div>
                  )}

                  <Button type="submit" size="lg" className="w-full group" disabled={status === "sending"}>
                    {status === "sending" ? t("form.sending") : t("form.submit")}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              </SpotlightCard>
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}
