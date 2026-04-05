"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Send,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Phone,
  Calendar,
  ChevronDown,
  MessageSquare,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { trackContact } from "@/lib/fb-pixel";
import { trackContactSubmission } from "@/lib/gtag";

const inputClasses =
  "w-full rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all duration-300";

/* ─── FAQ Accordion Item ─────────────────────── */
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <ScrollReveal delay={index * 0.1}>
      <div className="border-b border-white/[0.06] last:border-0">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-accent"
        >
          <span className="text-sm font-semibold sm:text-base">{question}</span>
          <ChevronDown
            size={18}
            className={cn(
              "shrink-0 text-accent transition-transform duration-300",
              open && "rotate-180"
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="pb-5 text-sm leading-relaxed text-muted/70">{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollReveal>
  );
}

/* ─── Main Component ─────────────────────────── */
export function ContactContent() {
  const locale = useLocale();
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
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
      if (response.ok) {
        setStatus("success");
        trackContact();
        trackContactSubmission();
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const faqItems = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

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
      <div
        className="absolute bottom-40 left-0 w-[400px] h-[400px] rounded-full opacity-[0.02]"
        style={{
          background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <Container className="relative z-10">
        {/* ─── April Promo Banner ─────────────────── */}
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

        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        {/* ─── Response Time Promise ─────────────── */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-14">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                <Clock size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">
                  <NumberTicker value={2} delay={0.3} suffix={`h`} />
                </p>
                <p className="text-xs text-muted/60">{t("responseLabel")}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/[0.08] hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <CheckCircle size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  <NumberTicker value={500} delay={0.5} suffix="+" />
                </p>
                <p className="text-xs text-muted/60">{t("projectsLabel")}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/[0.08] hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                <Globe size={18} className="text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  <NumberTicker value={98} delay={0.7} suffix="%" />
                </p>
                <p className="text-xs text-muted/60">{t("satisfactionLabel")}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ─── 3 Contact Method Cards ────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto mb-16">
          {/* Phone */}
          <ScrollReveal delay={0}>
            <SpotlightCard className="h-full text-center" glowIntensity="strong">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
                  <Phone size={24} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">{t("methods.phoneLabel")}</h3>
                  <a
                    href="tel:5813072678"
                    className="text-xl font-bold text-accent hover:underline transition-colors block mb-1"
                  >
                    {t("methods.phoneNumber")}
                  </a>
                  <p className="text-xs text-muted/60">{t("methods.phoneDesc")}</p>
                </div>
              </div>
            </SpotlightCard>
          </ScrollReveal>

          {/* Email */}
          <ScrollReveal delay={0.1}>
            <SpotlightCard className="h-full text-center" glowIntensity="strong">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20">
                  <Mail size={24} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">{t("methods.emailLabel")}</h3>
                  <a
                    href="mailto:gestionnovusepoxy@gmail.com"
                    className="text-sm font-medium text-accent hover:underline transition-colors break-all block mb-1"
                  >
                    {t("methods.emailAddress")}
                  </a>
                  <p className="text-xs text-muted/60">{t("methods.emailDesc")}</p>
                </div>
              </div>
            </SpotlightCard>
          </ScrollReveal>

          {/* Form link */}
          <ScrollReveal delay={0.2}>
            <SpotlightCard className="h-full text-center" glowIntensity="strong">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/20">
                  <MessageSquare size={24} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">{t("methods.formLabel")}</h3>
                  <p className="text-sm text-muted/70 mb-1">{t("methods.formDesc")}</p>
                  <p className="text-xs text-muted/60">{t("responsePromise")}</p>
                </div>
              </div>
            </SpotlightCard>
          </ScrollReveal>
        </div>

        {/* ─── Form + Sidebar (Hours / Location / Map) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto mb-20">
          {/* Contact Form — 3 columns */}
          <div className="lg:col-span-3">
            <ScrollReveal>
              {status === "success" ? (
                <div className="rounded-2xl border border-success/30 bg-success/5 p-10 text-center backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={32} className="text-success" />
                  </div>
                  <p className="text-lg font-medium">{t("form.success")}</p>
                </div>
              ) : (
                <SpotlightCard className="p-0">
                  <div className="px-6 pt-6 md:px-8 md:pt-8 pb-2">
                    <h3 className="text-lg font-semibold font-[family-name:var(--font-cabinet)]">
                      {t("form.title")}
                    </h3>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6 md:p-8 pt-4 md:pt-4 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-muted/80">
                          {t("form.name")} *
                        </label>
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
                        <label className="block text-sm font-medium mb-2 text-muted/80">
                          {t("form.email")} *
                        </label>
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

                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted/80">
                        {t("form.phone")}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted/80">
                        {t("form.message")} *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t("form.messagePlaceholder")}
                        className={cn(inputClasses, "resize-none")}
                      />
                    </div>

                    {status === "error" && (
                      <div className="flex items-center gap-2 text-sm text-red-400">
                        <AlertCircle size={16} />
                        {t("form.error")}
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full group"
                      disabled={status === "sending"}
                    >
                      {status === "sending" ? t("form.sending") : t("form.submit")}
                      <Send
                        size={18}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Button>
                  </form>
                </SpotlightCard>
              )}
            </ScrollReveal>
          </div>

          {/* Sidebar — 2 columns */}
          <div className="lg:col-span-2 space-y-5">
            {/* Business Hours */}
            <ScrollReveal delay={0.1}>
              <SpotlightCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                    <Calendar size={18} className="text-violet-400" />
                  </div>
                  <h3 className="text-sm font-semibold">{t("hours.title")}</h3>
                </div>
                <div className="space-y-2 text-sm text-muted/70">
                  <p>{t("hours.weekdays")}</p>
                  <p>{t("hours.saturday")}</p>
                  <p>{t("hours.sunday")}</p>
                </div>
              </SpotlightCard>
            </ScrollReveal>

            {/* Location */}
            <ScrollReveal delay={0.2}>
              <SpotlightCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                    <MapPin size={18} className="text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-semibold">{t("location.title")}</h3>
                </div>
                <p className="text-base font-medium mb-1">{t("location.city")}</p>
                <p className="text-sm text-muted/70">{t("location.serviceArea")}</p>
              </SpotlightCard>
            </ScrollReveal>

            {/* Response time promise card */}
            <ScrollReveal delay={0.3}>
              <SpotlightCard>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                    <Clock size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-accent">{t("responsePromise")}</p>
                    <p className="text-xs text-muted/60">{t("responseLabel")}</p>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          </div>
        </div>

        {/* ─── Google Maps Embed ─────────────────── */}
        <ScrollReveal>
          <div className="max-w-6xl mx-auto mb-20">
            <h3 className="text-lg font-semibold font-[family-name:var(--font-cabinet)] mb-6 text-center">
              {t("location.mapTitle")}
            </h3>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08]">
              <div
                className="relative h-full w-full"
                style={{
                  filter:
                    "invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.85) saturate(0.3)",
                }}
              >
                <iframe
                  src="https://www.google.com/maps?q=Quebec+City,+QC,+Canada&z=11&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "350px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Novus Epoxy — Quebec City"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/[0.06]" />
            </div>
          </div>
        </ScrollReveal>

        {/* ─── FAQ Section ───────────────────────── */}
        <div className="max-w-3xl mx-auto mb-20">
          <ScrollReveal>
            <h3 className="text-center text-[clamp(1.5rem,3vw,2rem)] font-bold font-[family-name:var(--font-cabinet)] tracking-[-0.02em] mb-8">
              {t("faq.title")}
            </h3>
          </ScrollReveal>
          <SpotlightCard className="p-6 md:p-8">
            {faqItems.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} index={i} />
            ))}
          </SpotlightCard>
        </div>

        {/* ─── Bottom CTA ────────────────────────── */}
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-accent/[0.04] backdrop-blur-sm p-10">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.06] via-transparent to-accent/[0.03]" />
              <div className="relative">
                <h3 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-cabinet)] mb-3">
                  {t("cta.title")}
                </h3>
                <p className="text-sm text-muted/70 mb-6">{t("cta.subtitle")}</p>
                <Button href="/soumission" size="lg" className="group">
                  {t("cta.button")}
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
