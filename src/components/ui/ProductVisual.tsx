"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ProductVisualProps {
  sciCode: string;
  chemistry: string;
  className?: string;
}

const chemistryColors: Record<string, { from: string; to: string; glow: string; accent: string }> = {
  Epoxy: { from: "#2563eb", to: "#1d4ed8", glow: "rgba(37, 99, 235, 0.3)", accent: "#3b82f6" },
  "100% Solid Epoxy": { from: "#2563eb", to: "#1d4ed8", glow: "rgba(37, 99, 235, 0.3)", accent: "#3b82f6" },
  Polyurea: { from: "#7c3aed", to: "#5b21b6", glow: "rgba(124, 58, 237, 0.3)", accent: "#8b5cf6" },
  "Polyurea-Polyaspartic": { from: "#7c3aed", to: "#4f46e5", glow: "rgba(124, 58, 237, 0.3)", accent: "#a78bfa" },
  Polyaspartic: { from: "#6366f1", to: "#4338ca", glow: "rgba(99, 102, 241, 0.3)", accent: "#818cf8" },
  "Epoxy-Quartz": { from: "#0891b2", to: "#0e7490", glow: "rgba(8, 145, 178, 0.3)", accent: "#22d3ee" },
  "Epoxy-Metallic": { from: "#d97706", to: "#b45309", glow: "rgba(217, 119, 6, 0.3)", accent: "#fbbf24" },
  "Epoxy-Flake": { from: "#059669", to: "#047857", glow: "rgba(5, 150, 105, 0.3)", accent: "#34d399" },
};

function getColors(chemistry: string) {
  // Try exact match first, then partial match
  if (chemistryColors[chemistry]) return chemistryColors[chemistry];
  const key = Object.keys(chemistryColors).find((k) =>
    chemistry.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(chemistry.toLowerCase())
  );
  return key ? chemistryColors[key] : chemistryColors.Epoxy;
}

// Generate deterministic pseudo-random numbers from a string seed
function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return (index: number) => {
    const x = Math.sin(hash + index) * 10000;
    return x - Math.floor(x);
  };
}

export function ProductVisual({ sciCode, chemistry, className = "" }: ProductVisualProps) {
  const colors = getColors(chemistry);
  const rand = useMemo(() => seededRandom(sciCode), [sciCode]);

  // Generate unique particle positions based on product code
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        x: 10 + rand(i * 3) * 80,
        y: 10 + rand(i * 3 + 1) * 80,
        size: 1 + rand(i * 3 + 2) * 3,
        delay: rand(i * 5) * 3,
        duration: 3 + rand(i * 7) * 4,
      })),
    [rand]
  );

  // Generate flowing lines
  const lines = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        x1: rand(i * 10 + 50) * 100,
        y1: 20 + rand(i * 10 + 51) * 60,
        x2: rand(i * 10 + 52) * 100,
        y2: 20 + rand(i * 10 + 53) * 60,
        delay: i * 0.5,
      })),
    [rand]
  );

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-surface group ${className}`}>
      {/* Multi-layer gradient background */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, ${colors.glow} 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, ${colors.glow.replace("0.3", "0.15")} 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, ${colors.glow.replace("0.3", "0.05")} 0%, transparent 70%)
          `,
        }}
      />

      {/* Animated mesh gradient on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
        style={{
          background: `
            conic-gradient(from 0deg at 30% 40%, transparent 0deg, ${colors.glow.replace("0.3", "0.08")} 60deg, transparent 120deg),
            conic-gradient(from 180deg at 70% 60%, transparent 0deg, ${colors.glow.replace("0.3", "0.06")} 60deg, transparent 120deg)
          `,
        }}
      />

      {/* Precision grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${colors.from}0d 1px, transparent 1px),
            linear-gradient(90deg, ${colors.from}0d 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Diagonal accent lines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 80px,
            ${colors.from} 80px,
            ${colors.from} 81px
          )`,
        }}
      />

      {/* Primary animated orb */}
      <motion.div
        className="absolute w-40 h-40 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          left: "20%",
          top: "20%",
          filter: "blur(40px)",
        }}
        animate={{
          x: [0, 40, -30, 10, 0],
          y: [0, -30, 20, -10, 0],
          scale: [1, 1.3, 0.8, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary orb */}
      <motion.div
        className="absolute w-24 h-24 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.glow.replace("0.3", "0.2")} 0%, transparent 70%)`,
          right: "15%",
          bottom: "25%",
          filter: "blur(30px)",
        }}
        animate={{
          x: [0, -20, 30, 0],
          y: [0, 20, -15, 0],
          scale: [0.8, 1.2, 1, 0.8],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Flowing connection lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {lines.map((line, i) => (
          <motion.line
            key={i}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke={colors.from}
            strokeOpacity={0.06}
            strokeWidth={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: line.delay, ease: "easeOut" }}
          />
        ))}
      </svg>

      {/* SCI code — premium typography */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[280px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          {/* Glow behind text */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ filter: "blur(40px)" }}
          >
            <div
              className="text-6xl md:text-7xl font-bold font-[family-name:var(--font-cabinet)]"
              style={{ color: colors.from, opacity: 0.15 }}
            >
              {sciCode}
            </div>
          </div>

          <div
            className="text-6xl md:text-7xl font-bold font-[family-name:var(--font-cabinet)] tracking-tight relative"
            style={{
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.from} 40%, ${colors.to} 70%, rgba(255,255,255,0.9) 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {sciCode}
          </div>

          {/* Chemistry label with line accents */}
          <div className="flex items-center gap-3 mt-3 justify-center">
            <div className="h-px w-8" style={{ background: `linear-gradient(to right, transparent, ${colors.from}40)` }} />
            <div
              className="text-[11px] font-semibold tracking-[0.25em] uppercase"
              style={{ color: colors.accent }}
            >
              {chemistry}
            </div>
            <div className="h-px w-8" style={{ background: `linear-gradient(to left, transparent, ${colors.from}40)` }} />
          </div>
        </motion.div>

        {/* Animated particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: i % 3 === 0 ? colors.accent : colors.from,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -15, 5, -8, 0],
              x: [0, 5, -8, 3, 0],
              opacity: [0.15, 0.6, 0.2, 0.5, 0.15],
              scale: [1, 1.5, 0.8, 1.2, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-surface via-surface/50 to-transparent" />

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-24 h-24"
        style={{
          background: `linear-gradient(225deg, ${colors.from}08 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}
