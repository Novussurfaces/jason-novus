"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TextRevealProps = {
  children: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  start?: string;
  end?: string;
};

export function TextReveal({
  children,
  className,
  tag: Tag = "p",
  start = "top 85%",
  end = "top 35%",
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll(".word");

    gsap.fromTo(
      words,
      { opacity: 0.15 },
      {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          end,
          scrub: 1,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === containerRef.current) st.kill();
      });
    };
  }, [start, end]);

  const wordsArray = children.split(" ");

  return (
    <div ref={containerRef}>
      <Tag className={className}>
        {wordsArray.map((word, i) => (
          <span key={i} className="word inline-block mr-[0.25em]">
            {word}
          </span>
        ))}
      </Tag>
    </div>
  );
}
