"use client";

import { useState, useCallback, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Send, Mail, MapPin, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { validateEmail } from "@/lib/email-validation";

const inputClasses =
  "w-full rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all duration-300";

const contactCards = [
  { key: "email" as const, icon: Mail, gradient: "from-amber-500/20 to-amber-600/5" },
  { key: "coverage" as const, icon: MapPin, gradient: "from-emerald-500/20 to-emerald-600/5" },
  { key: "hours" as const, icon: Clock, gradient: "from-violet-500/20 to-violet-600/5" },
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export function ContactContent() {
  const locale = useLocale();
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, locale }),
      });
      setStatus(response.ok ? "success" : "error");
      if (response.ok) setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="relative pt-16 pb-24 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-40 right-0 w-[500px] h-[500px] rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <Container className="relative z-10">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Contact Info Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-1 space-y-4"
          >
            {contactCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.key} variants={cardVariants}>
                  <SpotlightCard className="group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center border border-white/[0.06] transition-all duration-300 group-hover:scale-110`}>
                        <Icon size={20} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-0.5">{t(`info.${card.key}Label`)}</h3>
                        {card.key === "email" ? (
                          <a href="mailto:info@novusepoxy.ca" className="text-sm text-accent hover:underline">
                            {t("info.email")}
                          </a>
                        ) : (
                          <p className="text-sm text-muted/70">{t(`info.${card.key}`)}</p>
                        )}
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2"
          >
            {status === "success" ? (
              <div className="rounded-2xl border border-success/30 bg-success/5 p-10 text-center backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={32} className="text-success" />
                </div>
                <p className="text-lg font-medium">{t("form.success")}</p>
              </div>
            ) : (
              <SpotlightCard className="p-0">
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
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
                      <label className="block text-sm font-medium mb-2 text-muted/80">{t("form.phone")}</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted/80">{t("form.subject")} *</label>
                      <input type="text" name="subject" required value={formData.subject} onChange={handleChange} className={inputClasses} />
                    </div>
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
                    <Send size={18} className="transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </form>
              </SpotlightCard>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
