"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

const NOTIFICATIONS = [
  { nameKey: "name1", cityKey: "city1", actionKey: "action1" },
  { nameKey: "name2", cityKey: "city2", actionKey: "action2" },
  { nameKey: "name3", cityKey: "city3", actionKey: "action3" },
  { nameKey: "name4", cityKey: "city4", actionKey: "action4" },
  { nameKey: "name5", cityKey: "city5", actionKey: "action5" },
  { nameKey: "name6", cityKey: "city6", actionKey: "action6" },
];

export function LiveActivity() {
  const t = useTranslations("liveActivity");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [dismissed, setDismissed] = useState(false);

  const cycle = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % NOTIFICATIONS.length);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const initial = setTimeout(cycle, 5000);
    const interval = setInterval(cycle, 8000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [dismissed, cycle]);

  if (dismissed || currentIndex < 0) return null;

  const notif = NOTIFICATIONS[currentIndex];

  return (
    <div className="fixed bottom-4 left-4 z-[60] max-w-[360px] hidden md:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: -100, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative rounded-xl border border-white/[0.08] backdrop-blur-xl p-4 shadow-2xl shadow-black/40"
          style={{
            background: "linear-gradient(135deg, rgba(24,24,27,0.85) 0%, rgba(15,15,18,0.9) 100%)",
          }}
        >
          {/* Glass shimmer accent */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none opacity-[0.04]"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
            }}
          />

          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2.5 right-2.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer z-10"
          >
            <X size={14} />
          </button>

          <div className="flex items-center gap-3 pr-4 relative z-[1]">
            {/* Avatar with live indicator */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center">
                <span className="text-sm font-bold text-accent">
                  {t(notif.nameKey).charAt(0)}
                </span>
              </div>
              {/* Green live dot */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#18181b]" />
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-zinc-200 leading-snug">
                <span className="font-semibold text-white">{t(notif.nameKey)}</span>
                <span className="text-zinc-500"> {t("from")} {t(notif.cityKey)}</span>
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {t(notif.actionKey)} · {t("timeAgo")}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
