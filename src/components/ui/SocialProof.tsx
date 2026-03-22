"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

export function SocialProof() {
  const t = useTranslations("socialProof");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [dismissed, setDismissed] = useState(false);

  const notifications = [
    { name: "Marc T.", city: "Montréal", key: "quote" },
    { name: "Sophie L.", city: "Québec", key: "order" },
    { name: "Jean-P.", city: "Laval", key: "pdf" },
    { name: "David C.", city: "Toronto", key: "pallet" },
    { name: "Marie-È.", city: "Sherbrooke", key: "viewing" },
  ];

  const cycle = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % notifications.length);
  }, [notifications.length]);

  useEffect(() => {
    if (dismissed) return;
    const initial = setTimeout(cycle, 6000);
    const interval = setInterval(cycle, 10000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [dismissed, cycle]);

  if (dismissed || currentIndex < 0) return null;

  const notif = notifications[currentIndex];

  return (
    <div className="fixed bottom-4 left-4 z-[60] max-w-[340px] hidden md:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative rounded-xl bg-card/95 border border-border/60 backdrop-blur-lg p-4 shadow-2xl shadow-black/30"
        >
          <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl bg-accent" />

          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>

          <div className="flex items-center gap-3 pr-4">
            <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-accent">
                {notif.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-foreground leading-snug">
                <span className="font-semibold">{notif.name}</span>
                <span className="text-muted"> {t("from")} {notif.city}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t(notif.key)} · {t("timeAgo")}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
