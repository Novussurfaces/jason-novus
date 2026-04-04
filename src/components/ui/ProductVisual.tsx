"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ProductVisualProps {
  sciCode: string;
  chemistry: string;
  className?: string;
}

const chemistryColors: Record<string, { from: string; to: string; glow: string; accent: string; mid: string }> = {
  Epoxy: { from: "#C9A84C", to: "#8A6F2E", mid: "#B89840", glow: "rgba(201, 168, 76, 0.3)", accent: "#E0C06A" },
  "100% Solid Epoxy": { from: "#D4B05A", to: "#8A6F2E", mid: "#BFA048", glow: "rgba(212, 176, 90, 0.3)", accent: "#E8CC78" },
  Polyurea: { from: "#8B5CF6", to: "#4C1D95", mid: "#6D28D9", glow: "rgba(139, 92, 246, 0.3)", accent: "#A78BFA" },
  "Polyurea-Polyaspartic": { from: "#8B5CF6", to: "#3730A3", mid: "#6366F1", glow: "rgba(139, 92, 246, 0.28)", accent: "#C4B5FD" },
  Polyaspartic: { from: "#818CF8", to: "#3730A3", mid: "#6366F1", glow: "rgba(129, 140, 248, 0.3)", accent: "#A5B4FC" },
  "Epoxy-Quartz": { from: "#06B6D4", to: "#0E4F5C", mid: "#0891B2", glow: "rgba(6, 182, 212, 0.28)", accent: "#67E8F9" },
  "Epoxy-Metallic": { from: "#F59E0B", to: "#92400E", mid: "#D97706", glow: "rgba(245, 158, 11, 0.3)", accent: "#FCD34D" },
  "Epoxy-Flake": { from: "#10B981", to: "#064E3B", mid: "#059669", glow: "rgba(16, 185, 129, 0.28)", accent: "#6EE7B7" },
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
      {/* Multi-layer gradient background — deeper, richer */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: `
            radial-gradient(ellipse at 15% 25%, ${colors.glow} 0%, transparent 45%),
            radial-gradient(ellipse at 85% 75%, ${colors.glow.replace("0.3", "0.18")} 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, ${colors.glow.replace("0.3", "0.06")} 0%, transparent 65%),
            radial-gradient(ellipse at 70% 20%, ${colors.glow.replace("0.3", "0.08")} 0%, transparent 40%)
          `,
        }}
      />

      {/* Animated mesh gradient on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
        style={{
          background: `
            conic-gradient(from 0deg at 30% 40%, transparent 0deg, ${colors.glow.replace("0.3", "0.1")} 60deg, transparent 120deg),
            conic-gradient(from 180deg at 70% 60%, transparent 0deg, ${colors.glow.replace("0.3", "0.08")} 60deg, transparent 120deg),
            conic-gradient(from 90deg at 50% 80%, transparent 0deg, ${colors.glow.replace("0.3", "0.05")} 40deg, transparent 80deg)
          `,
        }}
      />

      {/* SVG noise texture overlay for premium feel */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035]" aria-hidden="true">
        <filter id={`noise-${sciCode}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#noise-${sciCode})`} />
      </svg>

      {/* Precision grid — finer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${colors.from}0a 1px, transparent 1px),
            linear-gradient(90deg, ${colors.from}0a 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Diagonal accent lines */}
      <div
        className="absolute inset-0 opacity-[0.025]"
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

      {/* Secondary cross-hatch for depth */}
      <div
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 120px,
            ${colors.mid} 120px,
            ${colors.mid} 121px
          )`,
        }}
      />

      {/* Primary animated orb — larger, richer gradient */}
      <motion.div
        className="absolute w-48 h-48 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, ${colors.glow.replace("0.3", "0.1")} 40%, transparent 70%)`,
          left: "15%",
          top: "15%",
          filter: "blur(45px)",
        }}
        animate={{
          x: [0, 45, -35, 15, 0],
          y: [0, -35, 25, -12, 0],
          scale: [1, 1.35, 0.75, 1.15, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary orb */}
      <motion.div
        className="absolute w-28 h-28 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.glow.replace("0.3", "0.22")} 0%, transparent 70%)`,
          right: "12%",
          bottom: "20%",
          filter: "blur(35px)",
        }}
        animate={{
          x: [0, -25, 35, 0],
          y: [0, 25, -18, 0],
          scale: [0.8, 1.25, 0.95, 0.8],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Tertiary accent orb — subtle color shift */}
      <motion.div
        className="absolute w-20 h-20 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.accent}30 0%, transparent 70%)`,
          left: "55%",
          top: "60%",
          filter: "blur(28px)",
        }}
        animate={{
          x: [0, 15, -20, 10, 0],
          y: [0, -18, 10, -5, 0],
          scale: [0.9, 1.3, 0.85, 1.1, 0.9],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
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
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.from} 30%, ${colors.mid} 55%, ${colors.to} 75%, rgba(255,255,255,0.85) 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {sciCode}
          </div>

          {/* Shimmer line under SCI code */}
          <div
            className="mt-2 h-[1px] w-16 mx-auto rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${colors.accent}60 30%, ${colors.from}80 50%, ${colors.accent}60 70%, transparent 100%)`,
            }}
          />

          {/* Chemistry label with line accents */}
          <div className="flex items-center gap-3 mt-3 justify-center">
            <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${colors.from}50)` }} />
            <div
              className="text-[11px] font-semibold tracking-[0.25em] uppercase"
              style={{ color: colors.accent }}
            >
              {chemistry}
            </div>
            <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${colors.from}50)` }} />
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
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface via-surface/60 to-transparent" />

      {/* Corner accent — top right */}
      <div
        className="absolute top-0 right-0 w-32 h-32"
        style={{
          background: `linear-gradient(225deg, ${colors.from}0c 0%, ${colors.accent}04 30%, transparent 60%)`,
        }}
      />

      {/* Corner accent — bottom left */}
      <div
        className="absolute bottom-0 left-0 w-28 h-28"
        style={{
          background: `linear-gradient(45deg, ${colors.to}08 0%, transparent 60%)`,
        }}
      />

      {/* Top edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 10%, ${colors.from}15 30%, ${colors.accent}20 50%, ${colors.from}15 70%, transparent 90%)`,
        }}
      />
    </div>
  );
}
