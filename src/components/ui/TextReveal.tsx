"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";

type TextRevealProps = {
  text: string;
  className?: string;
};

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);

  return (
    <motion.span
      className="mr-[0.25em] inline-block"
      style={{ opacity }}
    >
      {word}
    </motion.span>
  );
}

export function TextReveal({ text, className }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.3"],
  });

  const words = text.split(" ");

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <p className="flex flex-wrap text-inherit">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = (i + 1) / words.length;
          return (
            <Word
              key={`${word}-${i}`}
              word={word}
              range={[start, end]}
              progress={scrollYProgress}
            />
          );
        })}
      </p>
    </div>
  );
}
