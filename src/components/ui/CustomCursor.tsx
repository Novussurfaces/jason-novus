"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type SpringOptions,
} from "framer-motion";

const SPRING_DOT: SpringOptions = { stiffness: 500, damping: 28, mass: 0.5 };
const SPRING_RING: SpringOptions = { stiffness: 200, damping: 20, mass: 0.6 };

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const dotX = useSpring(mouseX, SPRING_DOT);
  const dotY = useSpring(mouseY, SPRING_DOT);

  const ringX = useSpring(mouseX, SPRING_RING);
  const ringY = useSpring(mouseY, SPRING_RING);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Desktop only — detect hover-capable device
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (!canHover) return;
    setIsDesktop(true);

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const hovering =
        target.closest("[data-cursor='pointer']") !== null ||
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null;
      setIsPointer(hovering);
    };

    const enter = () => setIsVisible(true);
    const leave = () => setIsVisible(false);

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseenter", enter);
    document.addEventListener("mouseleave", leave);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseleave", leave);
    };
  }, [mouseX, mouseY]);

  if (!isDesktop || !isVisible) return null;

  const dotSize = 8;
  const ringSize = 36;
  const ringHoverSize = ringSize * 1.5; // 54px

  return (
    <>
      {/* Dot — 8px */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full mix-blend-difference"
        style={{
          width: dotSize,
          height: dotSize,
          x: dotX,
          y: dotY,
          translateX: -(dotSize / 2),
          translateY: -(dotSize / 2),
          backgroundColor: isPointer ? "#2563eb" : "white",
        }}
      />

      {/* Ring — 36px, scales to 1.5x on hover */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: -(isPointer ? ringHoverSize / 2 : ringSize / 2),
          translateY: -(isPointer ? ringHoverSize / 2 : ringSize / 2),
        }}
        animate={{
          width: isPointer ? ringHoverSize : ringSize,
          height: isPointer ? ringHoverSize : ringSize,
          borderColor: isPointer ? "#2563eb" : "rgba(255,255,255,0.4)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        initial={false}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            border: "1px solid",
            borderColor: "inherit",
          }}
        />
      </motion.div>
    </>
  );
}
