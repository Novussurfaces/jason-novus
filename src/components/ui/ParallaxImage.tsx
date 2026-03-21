"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image, { type StaticImageData } from "next/image";

type ParallaxImageProps = {
  src: string | StaticImageData;
  alt: string;
  speed?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function ParallaxImage({
  src,
  alt,
  speed = 0.3,
  className,
  priority = false,
  sizes = "100vw",
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);

  return (
    <div ref={ref} style={{ overflow: "hidden", position: "relative" }} className={className}>
      <motion.div style={{ y, position: "relative", width: "100%", height: "100%" }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          style={{ objectFit: "cover", scale: 1.2 }}
        />
      </motion.div>
    </div>
  );
}
