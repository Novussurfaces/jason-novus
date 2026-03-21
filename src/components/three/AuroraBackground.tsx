"use client";

import { motion } from "framer-motion";

export function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Primary aurora */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 40, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0.05) 40%, transparent 70%)",
        }}
      />
      {/* Secondary aurora */}
      <motion.div
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1/3 -right-1/4 w-[120%] h-[120%] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.2) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)",
        }}
      />
      {/* Accent glow */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -30, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 60%)",
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
