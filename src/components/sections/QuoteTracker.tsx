"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Package, Clock, CheckCircle, Send, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Meteors } from "@/components/ui/Meteors";

type QuoteStatus = "received" | "processing" | "sent" | "followup";

interface QuoteData {
  id: string;
  status: QuoteStatus;
  date: string;
  products: string[];
  estimatedResponse: string;
  clientName: string;
}

const steps: { key: QuoteStatus; icon: typeof Package }[] = [
  { key: "received", icon: Package },
  { key: "processing", icon: Clock },
  { key: "sent", icon: Send },
  { key: "followup", icon: CheckCircle },
];

export function QuoteTracker() {
  const t = useTranslations("tracking");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/track?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.found) {
        setQuote(data.quote);
      } else {
        setQuote(null);
      }
    } catch {
      setQuote(null);
    }

    setSearched(true);
    setLoading(false);
  };

  const getStepIndex = (status: QuoteStatus) =>
    steps.findIndex((s) => s.key === status);

  return (
    <section className="pt-32 pb-24 relative overflow-hidden min-h-screen">
      <Meteors number={10} />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-[family-name:var(--font-cabinet)] text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Search form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto mb-16"
        >
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                required
                className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3.5 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {loading ? t("searching") : t("search")}
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.form>

        {/* Results */}
        <AnimatePresence mode="wait">
          {searched && quote && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <SpotlightCard className="p-8">
                {/* Quote header */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-muted">{t("quoteNumber")}</p>
                    <p className="text-2xl font-bold font-[family-name:var(--font-cabinet)]">
                      {quote.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted">{t("submittedOn")}</p>
                    <p className="font-medium">{quote.date}</p>
                  </div>
                </div>

                {/* Status steps */}
                <div className="relative mb-10">
                  <div className="flex justify-between items-center">
                    {steps.map((step, i) => {
                      const Icon = step.icon;
                      const active = i <= getStepIndex(quote.status);
                      const current = i === getStepIndex(quote.status);
                      return (
                        <motion.div
                          key={step.key}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + i * 0.15 }}
                          className="flex flex-col items-center relative z-10"
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                              current
                                ? "bg-accent border-accent text-white shadow-lg shadow-accent/30"
                                : active
                                  ? "bg-accent/20 border-accent/50 text-accent"
                                  : "bg-surface border-border text-muted-foreground"
                            }`}
                          >
                            <Icon size={20} />
                          </div>
                          <span
                            className={`mt-2 text-xs font-medium ${
                              active ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {t(`steps.${step.key}`)}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Connecting line */}
                  <div className="absolute top-6 left-6 right-6 h-0.5 bg-border -z-0">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: getStepIndex(quote.status) / (steps.length - 1),
                      }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="h-full bg-accent origin-left"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-surface border border-border/60 p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      {t("productsRequested")}
                    </p>
                    <p className="font-medium">{quote.products.join(", ")}</p>
                  </div>
                  <div className="rounded-xl bg-surface border border-border/60 p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      {t("estimatedResponse")}
                    </p>
                    <p className="font-medium">{quote.estimatedResponse}</p>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          )}

          {searched && !quote && (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-lg text-muted">{t("notFound")}</p>
              <p className="text-sm text-muted-foreground mt-2">{t("notFoundSub")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
