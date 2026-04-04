"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Control the radial glow intensity on hover */
  glowIntensity?: "default" | "strong";
};

export function SpotlightCard({ children, className, glowIntensity = "default" }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const isStrong = glowIntensity === "strong";
  const glowColor = isStrong ? "rgba(201,168,76,0.30)" : "rgba(201,168,76,0.15)";
  const glowRadius = isStrong ? 500 : 400;
  const shadowClass = isStrong
    ? "border-white/[0.15] shadow-[0_0_40px_rgba(201,168,76,0.15),0_8px_32px_rgba(0,0,0,0.3)]"
    : "border-white/[0.15] shadow-[0_0_20px_rgba(201,168,76,0.08),0_8px_32px_rgba(0,0,0,0.3)]";

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300",
        isHovered && cn("-translate-y-1", shadowClass),
        className
      )}
    >
      {/* Spotlight radial gradient */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${glowRadius}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent)`,
        }}
      />
      {/* Strong glow: additional ambient edge glow */}
      {isStrong && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            boxShadow: "inset 0 0 60px rgba(201,168,76,0.08), 0 0 30px rgba(201,168,76,0.06)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
