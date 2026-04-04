"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface PipelineProps {
  recentEmails: Array<{
    timestamp: string;
    email: string;
    company: string;
    status: string;
  }>;
  stats: {
    totalLeads: number;
    emailsSent: number;
    emailsBounced: number;
    deliveryRate: number;
  };
  leadsByType: Record<string, number>;
  cities: Record<string, { leads: number; quality_avg: number }>;
}

// ── Funnel stage config ──────────────────────────────────────────
interface FunnelStage {
  label: string;
  count: number;
  widthPct: number; // visual width as % of container
}

function buildFunnelStages(stats: PipelineProps["stats"]): FunnelStage[] {
  const delivered = stats.emailsSent - stats.emailsBounced;
  const interested = Math.round(delivered * 0.1);
  const converted = Math.round(delivered * 0.02);

  return [
    { label: "DISCOVERED", count: stats.totalLeads, widthPct: 100 },
    { label: "CONTACTED", count: stats.emailsSent, widthPct: 82 },
    { label: "DELIVERED", count: delivered, widthPct: 64 },
    { label: "INTERESTED", count: interested, widthPct: 40 },
    { label: "CONVERTED", count: converted, widthPct: 22 },
  ];
}

// ── Reusable section header ──────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="mb-4 text-xs font-bold uppercase tracking-[0.25em]"
      style={{ color: "#C5A45D" }}
    >
      {children}
    </h3>
  );
}

// ── Stagger container variant ────────────────────────────────────
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ── Main component ───────────────────────────────────────────────
export default function LeadPipeline({
  recentEmails,
  stats,
  leadsByType,
  cities,
}: PipelineProps) {
  const funnelStages = useMemo(() => buildFunnelStages(stats), [stats]);

  // Sorted cities by quality
  const sortedCities = useMemo(() => {
    return Object.entries(cities)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quality_avg - a.quality_avg)
      .slice(0, 10);
  }, [cities]);

  // Sorted lead types
  const sortedTypes = useMemo(() => {
    const entries = Object.entries(leadsByType).sort(([, a], [, b]) => b - a);
    const max = entries.length > 0 ? entries[0][1] : 1;
    return entries.map(([type, count]) => ({ type, count, pct: count / max }));
  }, [leadsByType]);

  // Gold shades for type bars
  const goldShades = [
    "#C5A45D",
    "#D4B75E",
    "#B8943A",
    "#E0C97A",
    "#A07E2E",
    "#C9A84C",
    "#8B6914",
    "#F0DDA0",
    "#6B5210",
    "#DFC468",
  ];

  return (
    <div
      className="w-full space-y-8 rounded-2xl p-6 md:p-8"
      style={{ background: "#09090b" }}
    >
      {/* ════════════════════════════════════════════════════════════
          PIPELINE FUNNEL
         ════════════════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={staggerContainer}
      >
        <SectionLabel>Pipeline Funnel</SectionLabel>

        <div className="space-y-2">
          {funnelStages.map((stage, i) => {
            const pctOfFirst =
              funnelStages[0].count > 0
                ? ((stage.count / funnelStages[0].count) * 100).toFixed(1)
                : "0";

            return (
              <motion.div
                key={stage.label}
                variants={fadeUp}
                className="relative flex items-center gap-4"
              >
                {/* Label */}
                <span
                  className="w-28 shrink-0 text-right text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "#a1a1aa" }}
                >
                  {stage.label}
                </span>

                {/* Trapezoid bar */}
                <div className="relative flex-1">
                  <motion.div
                    className="relative overflow-hidden rounded-md"
                    style={{
                      maxWidth: `${stage.widthPct}%`,
                      height: "38px",
                      background:
                        "linear-gradient(90deg, #5C4A1E 0%, #C5A45D 55%, #D4B75E 100%)",
                      borderTop: "1px solid rgba(197,164,93,0.35)",
                      borderBottom: "1px solid rgba(197,164,93,0.15)",
                    }}
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.12,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    {/* Inner shimmer */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                      }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "linear",
                      }}
                    />
                  </motion.div>

                  {/* Count + pct overlay */}
                  <motion.div
                    className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
                  >
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#09090b" }}
                    >
                      {stage.count.toLocaleString()}
                    </span>
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: "rgba(9,9,11,0.6)" }}
                    >
                      ({pctOfFirst}%)
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Delivery rate badge */}
        <motion.div
          variants={fadeUp}
          className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: "rgba(197,164,93,0.1)",
            border: "1px solid rgba(197,164,93,0.2)",
          }}
        >
          <span
            className="text-xs font-medium"
            style={{ color: "#a1a1aa" }}
          >
            Delivery Rate
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: "#C5A45D" }}
          >
            {stats.deliveryRate.toFixed(1)}%
          </span>
        </motion.div>
      </motion.section>

      {/* ════════════════════════════════════════════════════════════
          CITY HEATMAP
         ════════════════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={staggerContainer}
      >
        <SectionLabel>City Heatmap</SectionLabel>

        <motion.div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
          variants={staggerContainer}
        >
          {sortedCities.map((city) => {
            // Intensity 0-1 based on quality (0-10 scale assumed)
            const intensity = Math.min(city.quality_avg / 10, 1);
            const glowOpacity = 0.08 + intensity * 0.22;
            const borderOpacity = 0.15 + intensity * 0.35;

            return (
              <motion.div
                key={city.name}
                variants={fadeUp}
                whileHover={{ scale: 1.04, y: -2 }}
                className="group relative cursor-default rounded-xl p-4 transition-colors"
                style={{
                  background: "#18181b",
                  border: `1px solid rgba(197,164,93,${borderOpacity.toFixed(2)})`,
                  boxShadow: `0 0 ${Math.round(intensity * 24)}px rgba(197,164,93,${glowOpacity.toFixed(2)})`,
                }}
              >
                {/* Quality glow orb */}
                <div
                  className="pointer-events-none absolute -top-1 -right-1 h-3 w-3 rounded-full"
                  style={{
                    background: `radial-gradient(circle, rgba(197,164,93,${(0.5 + intensity * 0.5).toFixed(2)}) 0%, transparent 70%)`,
                    filter: `blur(${Math.round(2 + intensity * 4)}px)`,
                  }}
                />

                <p
                  className="truncate text-xs font-bold uppercase tracking-wider"
                  style={{ color: "#fafafa" }}
                >
                  {city.name}
                </p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span
                    className="text-lg font-bold"
                    style={{ color: "#C5A45D" }}
                  >
                    {city.leads}
                  </span>
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: "#a1a1aa" }}
                  >
                    Q {city.quality_avg.toFixed(1)}
                  </span>
                </div>

                {/* Quality bar */}
                <div
                  className="mt-2 h-1 w-full overflow-hidden rounded-full"
                  style={{ background: "rgba(197,164,93,0.1)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #5C4A1E, #C5A45D)",
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${intensity * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* ════════════════════════════════════════════════════════════
          TYPE BREAKDOWN
         ════════════════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={staggerContainer}
      >
        <SectionLabel>Lead Type Breakdown</SectionLabel>

        <div className="space-y-3">
          {sortedTypes.map((item, i) => (
            <motion.div
              key={item.type}
              variants={fadeUp}
              className="group"
            >
              <div className="mb-1 flex items-center justify-between">
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#fafafa" }}
                >
                  {item.type}
                </span>
                <span
                  className="text-xs font-bold tabular-nums"
                  style={{ color: goldShades[i % goldShades.length] }}
                >
                  {item.count.toLocaleString()}
                </span>
              </div>

              {/* Bar track */}
              <div
                className="relative h-7 w-full overflow-hidden rounded-md"
                style={{ background: "#27272a" }}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-md"
                  style={{
                    background: `linear-gradient(90deg, ${goldShades[i % goldShades.length]}44, ${goldShades[i % goldShades.length]})`,
                    border: `1px solid ${goldShades[i % goldShades.length]}55`,
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.max(item.pct * 100, 4)}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.08,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 3 + i * 0.5,
                      ease: "linear",
                    }}
                  />
                </motion.div>

                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    boxShadow: `inset 0 0 16px ${goldShades[i % goldShades.length]}33`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════════════
          RECENT ACTIVITY FEED (bonus mini-section)
         ════════════════════════════════════════════════════════════ */}
      {recentEmails.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
        >
          <SectionLabel>Recent Activity</SectionLabel>

          <div
            className="max-h-48 space-y-1.5 overflow-y-auto rounded-xl p-4"
            style={{
              background: "#18181b",
              border: "1px solid #27272a",
            }}
          >
            {recentEmails.slice(0, 15).map((entry, i) => {
              const isDelivered =
                entry.status === "delivered" || entry.status === "sent";

              return (
                <motion.div
                  key={`${entry.email}-${i}`}
                  variants={fadeUp}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
                  style={{ background: "rgba(39,39,42,0.5)" }}
                  whileHover={{
                    backgroundColor: "rgba(197,164,93,0.06)",
                  }}
                >
                  {/* Status dot */}
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      background: isDelivered ? "#22c55e" : "#ef4444",
                      boxShadow: isDelivered
                        ? "0 0 6px rgba(34,197,94,0.5)"
                        : "0 0 6px rgba(239,68,68,0.5)",
                    }}
                  />
                  <span
                    className="flex-1 truncate text-xs"
                    style={{ color: "#a1a1aa" }}
                  >
                    <span style={{ color: "#fafafa" }}>
                      {entry.company || "Unknown"}
                    </span>{" "}
                    — {entry.email}
                  </span>
                  <span
                    className="shrink-0 text-[10px] tabular-nums"
                    style={{ color: "#71717a" }}
                  >
                    {new Date(entry.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}
    </div>
  );
}
