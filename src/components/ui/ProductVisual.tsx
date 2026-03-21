"use client";

import { motion } from "framer-motion";

interface ProductVisualProps {
  sciCode: string;
  chemistry: string;
  className?: string;
}

const chemistryColors: Record<string, { from: string; to: string; glow: string }> = {
  Epoxy: { from: "#2563eb", to: "#1d4ed8", glow: "rgba(37, 99, 235, 0.3)" },
  Polyurea: { from: "#7c3aed", to: "#5b21b6", glow: "rgba(124, 58, 237, 0.3)" },
  "Polyurea-Polyaspartic": { from: "#7c3aed", to: "#4f46e5", glow: "rgba(124, 58, 237, 0.3)" },
  Polyaspartic: { from: "#6366f1", to: "#4338ca", glow: "rgba(99, 102, 241, 0.3)" },
  "Epoxy-Quartz": { from: "#0891b2", to: "#0e7490", glow: "rgba(8, 145, 178, 0.3)" },
  "Epoxy-Metallic": { from: "#d97706", to: "#b45309", glow: "rgba(217, 119, 6, 0.3)" },
  "Epoxy-Flake": { from: "#059669", to: "#047857", glow: "rgba(5, 150, 105, 0.3)" },
};

function getColors(chemistry: string) {
  return chemistryColors[chemistry] || chemistryColors.Epoxy;
}

export function ProductVisual({ sciCode, chemistry, className = "" }: ProductVisualProps) {
  const colors = getColors(chemistry);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-surface ${className}`}>
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${colors.glow} 0%, transparent 60%),
                       radial-gradient(ellipse at 70% 80%, ${colors.glow} 0%, transparent 50%)`,
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${colors.from}33 1px, transparent 1px), linear-gradient(90deg, ${colors.from}33 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated orb */}
      <motion.div
        className="absolute w-32 h-32 rounded-full blur-3xl"
        style={{ background: colors.glow }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 10, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* SCI code with gradient */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[280px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div
            className="text-6xl md:text-7xl font-bold font-[family-name:var(--font-cabinet)] tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 50%, #fff 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
            }}
          >
            {sciCode}
          </div>
          <div
            className="mt-2 text-sm font-medium tracking-[0.2em] uppercase"
            style={{ color: colors.from }}
          >
            {chemistry}
          </div>
        </motion.div>

        {/* Floating dots */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: colors.from,
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent" />
    </div>
  );
}
