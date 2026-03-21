"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

type StaggerGridProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export function StaggerGrid({ children, className, stagger = 0.1 }: StaggerGridProps) {
  const variants: Variants = stagger !== 0.1
    ? {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }
    : containerVariants;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGridItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
