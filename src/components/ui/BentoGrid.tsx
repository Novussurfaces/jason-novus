"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoGridItemProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function BentoGridItem({
  title,
  description,
  icon,
  className,
  children,
}: BentoGridItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "row-span-1 rounded-2xl group/bento hover:shadow-xl transition duration-200",
        "border border-border/50 bg-card p-6",
        "justify-between flex flex-col space-y-4",
        className
      )}
    >
      {children && (
        <div className="relative w-full min-h-[120px] rounded-xl overflow-hidden bg-surface">
          {children}
        </div>
      )}
      <div className="transition duration-200">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
            {icon}
          </div>
        )}
        <h3 className="font-semibold text-foreground mb-1 text-lg tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
