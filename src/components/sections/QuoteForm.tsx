"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/products";
import { cn } from "@/lib/cn";

const inputClasses =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors";

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
      // TODO: Replace with actual n8n webhook URL
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, locale }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          projectType: "",
          surfaceArea: "",
          product: "",
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="pt-32 pb-24">
      <Container>
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <div className="max-w-2xl mx-auto">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center"
            >
              <CheckCircle size={48} className="text-success mx-auto mb-4" />
              <p className="text-lg font-medium">{t("form.success")}</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t("form.name")} *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t("form.email")} *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Phone + Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t("form.phone")} *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t("form.company")}</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Project Type + Surface Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t("form.projectType")} *</label>
                  <select
                    name="projectType"
                    required
                    value={formData.projectType}
                    onChange={handleChange}
                    className={cn(inputClasses, "appearance-none")}
                  >
                    <option value="">—</option>
                    <option value="residential">{t("form.projectTypes.residential")}</option>
                    <option value="commercial">{t("form.projectTypes.commercial")}</option>
                    <option value="industrial">{t("form.projectTypes.industrial")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t("form.surfaceArea")}</label>
                  <input
                    type="text"
                    name="surfaceArea"
                    value={formData.surfaceArea}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Product Interest */}
              <div>
                <label className="block text-sm font-medium mb-2">{t("form.product")}</label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  className={cn(inputClasses, "appearance-none")}
                >
                  <option value="">{t("form.selectProduct")}</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.name[locale]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2">{t("form.message")} *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={cn(inputClasses, "resize-none")}
                />
              </div>

              {/* Error message */}
              {status === "error" && (
                <div className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle size={16} />
                  {t("form.error")}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={status === "sending"}
              >
                {status === "sending" ? t("form.sending") : t("form.submit")}
                <Send size={18} />
              </Button>
            </motion.form>
          )}
        </div>
      </Container>
    </section>
  );
}
