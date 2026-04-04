"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  /** Render the title with a premium white-to-muted gradient */
  gradient?: boolean;
};

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className,
  gradient = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={cn(centered && "text-center", "mb-12 md:mb-16", className)}
    >
      <h2
        className={cn(
          "font-[family-name:var(--font-cabinet)] text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] leading-tight",
          gradient &&
            "bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(201,168,76,0.15)]"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-4 text-lg text-foreground/60 max-w-2xl", centered && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
