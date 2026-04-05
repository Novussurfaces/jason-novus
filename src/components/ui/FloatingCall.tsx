"use client";

import { useState } from "react";
import { Phone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

export function FloatingCall() {
  const t = useTranslations("floatingCall");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2"
          >
            {/* Jason */}
            <a
              href="tel:5813072678"
              className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3 shadow-lg hover:bg-card-hover transition-colors group"
            >
              <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Phone size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t("jason")}</p>
                <p className="text-xs text-muted">581-307-2678</p>
              </div>
            </a>

            {/* Luca */}
            <a
              href="tel:5813075983"
              className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3 shadow-lg hover:bg-card-hover transition-colors group"
            >
              <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Phone size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t("luca")}</p>
                <p className="text-xs text-muted">581-307-5983</p>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg shadow-accent/30 flex items-center justify-center transition-colors cursor-pointer",
          isOpen
            ? "bg-card border border-border text-foreground hover:bg-card-hover"
            : "bg-accent text-white hover:bg-accent-hover"
        )}
        aria-label={t("label")}
      >
        {isOpen ? <X size={22} /> : <Phone size={22} />}
      </motion.button>
    </div>
  );
}
