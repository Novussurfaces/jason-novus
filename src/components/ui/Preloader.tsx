"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

/* ──────────────────────────────────────────────
   NOVUS SURFACES — Simple Preloader
   Dark screen, centered text, counter, progress bar, fade out.
   ────────────────────────────────────────────── */

const SESSION_KEY = "novus-preloader-seen";
const MAX_DURATION = 1500; // 1.5s max
const COUNTER_DURATION = 1200; // counter animation duration

export function Preloader() {
  const [shouldShow, setShouldShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "fading" | "done">("loading");
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (!seen) {
      setShouldShow(true);
      sessionStorage.setItem(SESSION_KEY, "1");
      document.body.style.overflow = "hidden";
    }
  }, []);

  // Animate counter 0→100
  const animateCounter = useCallback(() => {
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed / COUNTER_DURATION, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(eased * 100);
      setProgress(value);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Start counter + set max timeout
  useEffect(() => {
    if (!shouldShow) return;

    animateCounter();

    const maxTimer = setTimeout(() => {
      setProgress(100);
    }, MAX_DURATION);

    return () => {
      clearTimeout(maxTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldShow, animateCounter]);

  // When progress hits 100, trigger fade out
  useEffect(() => {
    if (progress === 100 && phase === "loading") {
      const fadeTimer = setTimeout(() => {
        setPhase("fading");
        document.body.style.overflow = "";
      }, 200);

      return () => clearTimeout(fadeTimer);
    }
  }, [progress, phase]);

  // After fade animation, remove from DOM
  useEffect(() => {
    if (phase === "fading") {
      const doneTimer = setTimeout(() => {
        setPhase("done");
      }, 600);
      return () => clearTimeout(doneTimer);
    }
  }, [phase]);

  if (!shouldShow || phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="preloader"
        className={cn(
          "fixed inset-0 z-[9999] flex items-center justify-center bg-[#09090b]",
          "pointer-events-auto"
        )}
        initial={{ opacity: 1 }}
        animate={phase === "fading" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        aria-hidden="true"
      >
        {/* ── Center content ── */}
        <div className="flex flex-col items-center gap-8">
          {/* NOVUS SURFACES — shown from start */}
          <span
            className={cn(
              "font-[family-name:var(--font-cabinet)] font-bold tracking-[0.35em]",
              "text-sm sm:text-base md:text-lg uppercase",
              "text-white/80"
            )}
          >
            NOVUS SURFACES
          </span>

          {/* Progress section */}
          <div className="flex flex-col items-center gap-4 w-[200px] sm:w-[260px] md:w-[300px]">
            {/* Progress counter */}
            <motion.span
              className={cn(
                "font-[family-name:var(--font-cabinet)] font-bold tabular-nums",
                "text-[28px] sm:text-[32px] md:text-[36px] leading-none",
                "text-foreground/30"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {progress}
              <span className="text-[20px] sm:text-[24px] text-accent/50">%</span>
            </motion.span>

            {/* Progress bar container */}
            <motion.div
              className="relative w-full h-[2px] bg-white/[0.06] rounded-full overflow-hidden"
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
            >
              {/* Progress bar fill */}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent/60 to-accent"
                style={{ width: `${progress}%` }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
