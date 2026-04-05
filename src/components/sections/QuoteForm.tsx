"use client";

import { useState, useCallback, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Send, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/products";
import { cn } from "@/lib/cn";
import { validateEmail } from "@/lib/email-validation";
import { trackLead } from "@/lib/fb-pixel";
import { trackQuoteSubmission } from "@/lib/gtag";

const inputClasses =
  "w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 backdrop-blur-sm transition-colors duration-300";

const selectClasses =
  "w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-3 text-sm text-foreground focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 backdrop-blur-sm transition-colors duration-300 appearance-none cursor-pointer [&>option]:bg-[#18181b] [&>option]:text-foreground";

const labelClasses = "block text-sm font-medium text-foreground/70 mb-2";

const errorInputClasses =
  "border-red-500/50 focus:border-red-500 focus:ring-red-500/30";

export function QuoteForm() {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("quote");
  const tEmail = useTranslations("emailValidation");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailValidating, setEmailValidating] = useState(false);
  const emailDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const checkEmail = useCallback(
    (email: string) => {
      if (emailDebounce.current) clearTimeout(emailDebounce.current);
      if (!email) {
        setEmailError(null);
        setEmailValidating(false);
        return;
      }
      setEmailValidating(true);
      emailDebounce.current = setTimeout(async () => {
        const result = await validateEmail(email);
        if (!result.valid) {
          setEmailError(
            result.reason === "DISPOSABLE"
              ? tEmail("disposable")
              : tEmail("invalidFormat")
          );
        } else {
          setEmailError(null);
        }
        setEmailValidating(false);
      }, 600);
    },
    [tEmail]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "email") {
      checkEmail(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError || emailValidating) return;
    setStatus("sending");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, locale }),
      });

      if (response.ok) {
        setStatus("success");
        trackLead({ content_name: formData.product || "quote_form" });
        trackQuoteSubmission();
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
    <section className="relative pt-16 pb-24 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(ellipse at center, #C9A84C 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <Container className="relative z-10">
        {/* PROMO AVRIL banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 mx-auto max-w-2xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-accent/[0.06] backdrop-blur-sm px-6 py-4 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/[0.08] to-accent/0" />
            <p className="relative text-sm sm:text-base font-semibold text-accent tracking-wide">
              {t("promo")}
            </p>
          </div>
        </motion.div>

        {/* Gradient title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="font-[family-name:var(--font-cabinet)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] leading-tight bg-gradient-to-r from-foreground via-accent to-foreground bg-[length:200%_auto] bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="backdrop-blur-2xl bg-white/[0.04] border border-success/30 rounded-3xl p-10 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} className="text-success" />
              </div>
              <p className="text-lg font-medium">{t("form.success")}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Glass panel form container */}
              <div className="backdrop-blur-2xl bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <label className={labelClasses}>{t("form.name")} *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                    >
                      <label className={labelClasses}>{t("form.email")} *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={cn(inputClasses, emailError && errorInputClasses)}
                      />
                      <AnimatePresence mode="wait">
                        {emailValidating && (
                          <motion.p
                            key="validating"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="mt-1.5 text-xs text-foreground/40"
                          >
                            {tEmail("validating")}
                          </motion.p>
                        )}
                        {emailError && !emailValidating && (
                          <motion.p
                            key="error"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle size={12} />
                            {emailError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Row 2: Phone + Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <label className={labelClasses}>{t("form.phone")} *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.25 }}
                    >
                      <label className={labelClasses}>{t("form.company")}</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                    </motion.div>
                  </div>

                  {/* Row 3: Project Type + Surface Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <label className={labelClasses}>{t("form.projectType")} *</label>
                      <select
                        name="projectType"
                        required
                        value={formData.projectType}
                        onChange={handleChange}
                        className={selectClasses}
                      >
                        <option value="">---</option>
                        <option value="residential">{t("form.projectTypes.residential")}</option>
                        <option value="commercial">{t("form.projectTypes.commercial")}</option>
                        <option value="industrial">{t("form.projectTypes.industrial")}</option>
                      </select>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.35 }}
                    >
                      <label className={labelClasses}>{t("form.surfaceArea")}</label>
                      <input
                        type="text"
                        name="surfaceArea"
                        value={formData.surfaceArea}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                    </motion.div>
                  </div>

                  {/* Product Select */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <label className={labelClasses}>{t("form.product")}</label>
                    <select
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      className={selectClasses}
                    >
                      <option value="">{t("form.selectProduct")}</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.slug}>{p.name[locale]}</option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Message Textarea */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.45 }}
                  >
                    <label className={labelClasses}>{t("form.message")} *</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={cn(inputClasses, "resize-none")}
                    />
                  </motion.div>

                  {/* Error state */}
                  <AnimatePresence>
                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2.5 text-sm text-red-400 bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-3"
                      >
                        <AlertCircle size={16} className="shrink-0" />
                        {t("form.error")}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit button */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full group"
                      disabled={status === "sending" || !!emailError || emailValidating}
                    >
                      {status === "sending" ? (
                        <>
                          <Send size={18} className="animate-pulse" />
                          {t("form.sending")}
                        </>
                      ) : (
                        <>
                          {t("form.submit")}
                          <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </div>

              {/* Trust line */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-center text-sm text-foreground/40 mt-6 tracking-wide"
              >
                {t("trustLine")}
              </motion.p>
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}
