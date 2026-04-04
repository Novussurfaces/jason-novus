"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { useCurrency, type Currency } from "@/lib/currency";

/* ── Currency option config ── */
const CURRENCIES: { code: Currency; flag: string }[] = [
  { code: "CAD", flag: "🇨🇦" },
  { code: "USD", flag: "🇺🇸" },
  { code: "EUR", flag: "🇪🇺" },
  { code: "GBP", flag: "🇬🇧" },
];

/* ── Dropdown animation variants ── */
const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -4,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.03 * i, duration: 0.15 },
  }),
};

type CurrencySelectorProps = {
  className?: string;
  compact?: boolean;
};

export function CurrencySelector({ className, compact = false }: CurrencySelectorProps) {
  const t = useTranslations("currency");
  const { selectedCurrency, setSelectedCurrency, loading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Close on click outside */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Close on Escape */
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const current = CURRENCIES.find((c) => c.code === selectedCurrency) ?? CURRENCIES[0];

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* ── Trigger Button ── */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5",
          "text-sm font-medium transition-all duration-200 cursor-pointer",
          "hover:border-muted-foreground hover:bg-card",
          isOpen && "border-accent/40 bg-card",
          loading && "opacity-60 pointer-events-none"
        )}
        whileTap={{ scale: 0.97 }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t("label")}
      >
        <span className="text-xs leading-none">{current.flag}</span>
        <span className="text-muted">{compact ? current.code : t(current.code)}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-muted-foreground" />
        </motion.span>
      </motion.button>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={cn(
              "absolute right-0 top-full mt-1.5 z-50 w-44",
              "rounded-xl border border-border bg-card/95 backdrop-blur-xl",
              "shadow-xl shadow-black/30 overflow-hidden"
            )}
            role="listbox"
            aria-label={t("label")}
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-border">
              <p className="text-xs font-medium text-muted-foreground">{t("title")}</p>
            </div>

            {/* Options */}
            <div className="py-1">
              {CURRENCIES.map((currency, i) => {
                const isActive = currency.code === selectedCurrency;
                return (
                  <motion.button
                    key={currency.code}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      setSelectedCurrency(currency.code);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-150 cursor-pointer",
                      isActive
                        ? "bg-accent/10 text-foreground"
                        : "text-muted hover:text-foreground hover:bg-card-hover"
                    )}
                  >
                    {/* Active indicator */}
                    <span
                      className={cn(
                        "w-1 h-1 rounded-full transition-colors duration-150",
                        isActive ? "bg-accent" : "bg-transparent"
                      )}
                    />
                    <span className="text-xs leading-none">{currency.flag}</span>
                    <span className="flex-1 text-left font-medium">{currency.code}</span>
                    <span className="text-xs text-muted-foreground">
                      {t(currency.code)}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Footer hint */}
            <div className="px-3 py-1.5 border-t border-border">
              <p className="text-[10px] text-muted-foreground leading-tight">
                {t("hint")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
