"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { NumberTicker } from "@/components/ui/NumberTicker";

const stats = [
  { key: "systems", value: 13, suffix: "+", gradient: "from-blue-500 to-cyan-400" },
  { key: "countries", value: 25, suffix: "+", gradient: "from-violet-500 to-purple-400" },
  { key: "projects", value: 500, suffix: "+", gradient: "from-emerald-500 to-green-400" },
  { key: "satisfaction", value: 99, suffix: "%", gradient: "from-amber-500 to-orange-400" },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function TrustBar() {
  const t = useTranslations("trust");

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background: subtle radial glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.03] to-transparent" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(ellipse at center, #2563eb 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <Container className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.key}
              variants={itemVariants}
              className="group relative text-center"
            >
              {/* Card with glass effect */}
              <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm px-6 py-8 transition-all duration-500 hover:border-accent/20 hover:bg-white/[0.04] overflow-hidden">
                {/* Top accent line */}
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-12 bg-gradient-to-r ${stat.gradient} rounded-full opacity-60 group-hover:w-20 group-hover:opacity-100 transition-all duration-500`}
                />

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.08) 0%, transparent 60%)",
                  }}
                />

                {/* Number */}
                <div className="relative z-10">
                  <div
                    className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold font-[family-name:var(--font-cabinet)] tracking-tight leading-none"
                    style={{
                      background: "linear-gradient(180deg, #ffffff 0%, #a1a1aa 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    <NumberTicker
                      value={stat.value}
                      suffix={stat.suffix}
                      delay={i * 0.15}
                    />
                  </div>

                  {/* Label */}
                  <div className="mt-3 text-xs sm:text-sm text-muted/60 uppercase tracking-[0.2em] font-medium">
                    {t(stat.key)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
