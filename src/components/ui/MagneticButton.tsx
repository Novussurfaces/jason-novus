"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
} from "framer-motion";

type MagneticButtonProps = {
  children: React.ReactNode;
  className?: string;
  maxDistance?: number;
};

const SPRING: SpringOptions = { stiffness: 150, damping: 15, mass: 0.1 };

export function MagneticButton({
  children,
  className,
  maxDistance = 10,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Raw distance values from center, range roughly [-1, 1]
  const ratioX = useMotionValue(0);
  const ratioY = useMotionValue(0);

  // Transform ratio into pixel offset capped at maxDistance
  const rawX = useTransform(ratioX, [-1, 1], [-maxDistance, maxDistance]);
  const rawY = useTransform(ratioY, [-1, 1], [-maxDistance, maxDistance]);

  // Apply spring physics for smooth movement
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Ratio from center, clamped to [-1, 1]
    const rx = Math.max(-1, Math.min(1, (e.clientX - centerX) / (width / 2)));
    const ry = Math.max(-1, Math.min(1, (e.clientY - centerY) / (height / 2)));

    ratioX.set(rx);
    ratioY.set(ry);
  };

  const handleMouseLeave = () => {
    ratioX.set(0);
    ratioY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
