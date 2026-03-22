"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift } from "lucide-react";
import { useTranslations } from "next-intl";

export function ExitIntent() {
  const t = useTranslations("exitIntent");
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("novus_exit_shown")) return;

    const timer = setTimeout(() => {
      const handler = (e: MouseEvent) => {
        if (e.clientY < 10 && !triggered.current) {
          triggered.current = true;
          sessionStorage.setItem("novus_exit_shown", "1");
          setShow(true);
        }
      };
      document.addEventListener("mouseout", handler);
      return () => document.removeEventListener("mouseout", handler);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => setShow(false), 2500);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-card border border-border overflow-hidden"
          >
            {/* Top gradient bar */}
            <div className="h-1 bg-gradient-to-r from-accent via-blue-400 to-accent" />

            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-5">
                <Gift size={28} className="text-accent" />
              </div>

              {!submitted ? (
                <>
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-cabinet)]">
                    {t("title")}
                  </h3>
                  <p className="mt-3 text-muted text-sm">{t("subtitle")}</p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("placeholder")}
                      required
                      className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-6 transition-colors cursor-pointer"
                    >
                      {t("cta")}
                    </button>
                  </form>

                  <button
                    onClick={() => setShow(false)}
                    className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {t("dismiss")}
                  </button>
                </>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-success">{t("success")}</h3>
                  <p className="mt-2 text-sm text-muted">{t("successSub")}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
