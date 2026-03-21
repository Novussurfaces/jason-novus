"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface InfiniteMovingCardsProps {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  className?: string;
}

export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "normal",
  className,
}: InfiniteMovingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current?.appendChild(duplicatedItem);
      });

      const directionValue = direction === "left" ? "forwards" : "reverse";
      containerRef.current.style.setProperty("--animation-direction", directionValue);

      const speedValue = speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
      containerRef.current.style.setProperty("--animation-duration", speedValue);

      setStart(true);
    }
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll"
        )}
        style={
          start
            ? {
                animation: `scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite`,
              }
            : undefined
        }
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="w-[350px] max-w-full relative rounded-2xl border border-border/50 flex-shrink-0 px-8 py-6 md:w-[450px]"
            style={{
              background: "linear-gradient(180deg, var(--color-card) 0%, var(--color-surface) 100%)",
            }}
          >
            <blockquote>
              <p className="text-sm leading-relaxed text-muted">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-accent">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.title}</p>
                </div>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes scroll {
              to { transform: translateX(calc(-50% - 0.5rem)); }
            }
          `,
        }}
      />
    </div>
  );
}
