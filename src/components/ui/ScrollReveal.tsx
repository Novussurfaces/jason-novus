"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

type Direction = "up" | "left" | "right";

type ScrollRevealProps = {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
};

function getInitialOffset(direction: Direction): { x: number; y: number } {
  switch (direction) {
    case "up":
      return { x: 0, y: 30 };
    case "left":
      return { x: -30, y: 0 };
    case "right":
      return { x: 30, y: 0 };
  }
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const offset = getInitialOffset(direction);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
