"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  suffix = "",
  prefix = "",
  className = "",
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(direction === "down" ? value : 0);

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      const startValue = direction === "down" ? value : 0;
      const endValue = direction === "down" ? 0 : value;
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startValue + (endValue - startValue) * eased);
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, value, direction, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}
