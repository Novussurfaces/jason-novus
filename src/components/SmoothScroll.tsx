"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";

type SmoothScrollProps = {
  children: ReactNode;
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
