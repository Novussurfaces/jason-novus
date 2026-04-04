"use client";

import { useEffect, useRef, useCallback } from "react";
import { useLenisInstance } from "@/components/SmoothScroll";

/* ─────────────────────────────────────────────
   useScrollVelocity — rAF-driven, CSS-custom-property-first

   Subscribes to Lenis scroll events (or falls back to native
   wheel/scroll events). Exposes normalized velocity (0-1),
   direction, and isScrolling — all via refs for zero re-renders.

   Sets CSS custom properties on <html> every frame:
     --scroll-velocity: 0→1 (normalized, lerped)
     --scroll-direction: 1 (down) | -1 (up)
     --scroll-is-scrolling: 0 | 1

   Mobile: all velocity values halved (less precise input).
   ───────────────────────────────────────────── */

const VELOCITY_MAX = 3000; // px/s — clamp ceiling
const LERP_SPEED = 0.08; // smoothing factor (lower = smoother)
const IDLE_TIMEOUT = 150; // ms before isScrolling → false

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export type ScrollVelocityData = {
  velocity: number; // 0→1 normalized
  rawVelocity: number; // px/s
  direction: 1 | -1;
  isScrolling: boolean;
};

export function useScrollVelocity() {
  const lenis = useLenisInstance();

  const dataRef = useRef<ScrollVelocityData>({
    velocity: 0,
    rawVelocity: 0,
    direction: 1,
    isScrolling: false,
  });

  const targetVelocity = useRef(0);
  const currentVelocity = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafId = useRef(0);
  const isMobile = useRef(false);
  const lastScrollY = useRef(0);
  const lastTime = useRef(0);

  // Detect mobile once
  useEffect(() => {
    isMobile.current = window.matchMedia("(max-width: 768px)").matches ||
      "ontouchstart" in window;
  }, []);

  // Set CSS custom properties on <html> — GPU-optimized, no React renders
  const updateCSSProperties = useCallback(() => {
    const root = document.documentElement;
    const d = dataRef.current;
    root.style.setProperty("--scroll-velocity", d.velocity.toFixed(4));
    root.style.setProperty("--scroll-direction", String(d.direction));
    root.style.setProperty("--scroll-is-scrolling", d.isScrolling ? "1" : "0");
  }, []);

  // rAF loop: lerps velocity smoothly
  const tick = useCallback(() => {
    const mobileScale = isMobile.current ? 0.5 : 1;

    currentVelocity.current = lerp(
      currentVelocity.current,
      targetVelocity.current,
      LERP_SPEED
    );

    // Snap to zero when very close
    if (Math.abs(currentVelocity.current) < 0.001) {
      currentVelocity.current = 0;
    }

    const normalized = Math.min(
      1,
      Math.abs(currentVelocity.current) / VELOCITY_MAX
    ) * mobileScale;

    dataRef.current.velocity = normalized;
    dataRef.current.rawVelocity = currentVelocity.current;

    updateCSSProperties();
    rafId.current = requestAnimationFrame(tick);
  }, [updateCSSProperties]);

  // Handle scroll from Lenis
  const handleLenisScroll = useCallback(
    (e: { velocity: number; direction: number }) => {
      targetVelocity.current = Math.abs(e.velocity) * 1000; // Lenis velocity is in px/frame, scale to px/s
      dataRef.current.direction = e.direction >= 0 ? 1 : -1;
      dataRef.current.isScrolling = true;

      // Reset idle timer
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        targetVelocity.current = 0;
        dataRef.current.isScrolling = false;
      }, IDLE_TIMEOUT);
    },
    []
  );

  // Fallback: native scroll events (when Lenis is unavailable)
  const handleNativeScroll = useCallback(() => {
    const now = performance.now();
    const dt = now - lastTime.current;
    if (dt < 1) return;

    const scrollY = window.scrollY;
    const dy = scrollY - lastScrollY.current;
    const vel = Math.abs(dy / (dt / 1000));

    targetVelocity.current = vel;
    dataRef.current.direction = dy >= 0 ? 1 : -1;
    dataRef.current.isScrolling = true;

    lastScrollY.current = scrollY;
    lastTime.current = now;

    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      targetVelocity.current = 0;
      dataRef.current.isScrolling = false;
    }, IDLE_TIMEOUT);
  }, []);

  useEffect(() => {
    // Start rAF loop
    rafId.current = requestAnimationFrame(tick);

    // Initialize CSS props
    const root = document.documentElement;
    root.style.setProperty("--scroll-velocity", "0");
    root.style.setProperty("--scroll-direction", "1");
    root.style.setProperty("--scroll-is-scrolling", "0");

    if (lenis) {
      // Subscribe to Lenis scroll
      lenis.on("scroll", handleLenisScroll);
    } else {
      // Fallback to native scroll
      lastScrollY.current = window.scrollY;
      lastTime.current = performance.now();
      window.addEventListener("scroll", handleNativeScroll, { passive: true });
    }

    return () => {
      cancelAnimationFrame(rafId.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);

      if (lenis) {
        lenis.off("scroll", handleLenisScroll);
      } else {
        window.removeEventListener("scroll", handleNativeScroll);
      }
    };
  }, [lenis, tick, handleLenisScroll, handleNativeScroll]);

  return dataRef;
}
