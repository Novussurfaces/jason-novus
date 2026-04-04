"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

// ────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────
export interface HQData {
  stats: {
    totalLeads: number;
    agiLeads: number;
    huntedLeads: number;
    permitsLeads: number;
    megaPipeline: number;
    emailsSent: number;
    emailsBounced: number;
    emailsSkipped: number;
    bounceRate: number;
    deliveryRate: number;
  };
  engine: {
    runs: number;
    leadsFound: number;
    deadDomains: number;
    knownDomains: number;
    lastRun: string | null;
  } | null;
  campaigns: Record<
    string,
    { runs: number; leads: number; emails: number; bounces: number }
  >;
  cities: Record<string, { leads: number; quality_avg: number }>;
  leadsByType: Record<string, number>;
  recentEmails: Array<{
    timestamp: string;
    email: string;
    company: string;
    status: string;
  }>;
  tools: Array<{ name: string; version: string; status: string }>;
}

// ────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────
const GOLD = "#C5A45D";
const GOLD_GLOW = "0 0 20px rgba(197,164,93,0.5)";
const GOLD_GLOW_STRONG = "0 0 30px rgba(197,164,93,0.7)";

const cardBase =
  "relative overflow-hidden rounded-xl border border-[#27272a] bg-[#18181b] p-5";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 },
  },
};

// ────────────────────────────────────────────────────────
// Animated counter component
// ────────────────────────────────────────────────────────
function AnimatedNumber({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString()
  );
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.6,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, motionVal]);

  useEffect(() => {
    const unsub = display.on("change", (v) => {
      if (ref.current) ref.current.textContent = v + suffix;
    });
    return unsub;
  }, [display, suffix]);

  return (
    <span
      ref={ref}
      className="text-4xl font-black tracking-tight text-[#fafafa]"
      style={{ textShadow: GOLD_GLOW }}
    >
      0{suffix}
    </span>
  );
}

// ────────────────────────────────────────────────────────
// Stat card
// ────────────────────────────────────────────────────────
function StatCard({
  icon,
  value,
  label,
  suffix,
  decimals,
}: {
  icon: string;
  value: number;
  label: string;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.03, boxShadow: GOLD_GLOW_STRONG }}
      className={`${cardBase} flex flex-col items-center justify-center gap-2 text-center cursor-default`}
    >
      {/* scanline shimmer */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(197,164,93,0.03)] to-transparent" />
      <span className="text-3xl">{icon}</span>
      <AnimatedNumber value={value} suffix={suffix} decimals={decimals} />
      <span className="text-sm font-medium tracking-wide uppercase text-[#a1a1aa]">
        {label}
      </span>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────
// CSS bar (horizontal)
// ────────────────────────────────────────────────────────
function Bar({
  label,
  value,
  max,
  color,
  suffix = "",
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  suffix?: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-[#fafafa] font-medium truncate mr-2">
          {label}
        </span>
        <span
          className="text-sm font-bold whitespace-nowrap"
          style={{ color, textShadow: `0 0 12px ${color}55` }}
        >
          {value.toLocaleString()}
          {suffix}
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-[#27272a] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Status dot
// ────────────────────────────────────────────────────────
function StatusDot({ status }: { status: string }) {
  const isGood =
    status.toLowerCase() === "sent" ||
    status.toLowerCase() === "delivered" ||
    status.toLowerCase() === "active" ||
    status.toLowerCase() === "success";
  const color = isGood ? "#22c55e" : "#ef4444";
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
      style={{
        backgroundColor: color,
        boxShadow: `0 0 6px ${color}`,
      }}
    />
  );
}

// ────────────────────────────────────────────────────────
// Campaign color palette
// ────────────────────────────────────────────────────────
const CAMPAIGN_COLORS = [
  "#C5A45D",
  "#5DA4C5",
  "#C55D8A",
  "#5DC58A",
  "#8A5DC5",
  "#C5815D",
  "#5DC5C5",
  "#C5C55D",
];

// ────────────────────────────────────────────────────────
// Panel header
// ────────────────────────────────────────────────────────
function PanelHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xl">{icon}</span>
      <h3
        className="text-base font-bold uppercase tracking-wider text-[#fafafa]"
        style={{ textShadow: `0 0 10px rgba(197,164,93,0.3)` }}
      >
        {title}
      </h3>
      <div className="flex-1 h-px bg-gradient-to-r from-[#C5A45D33] to-transparent ml-2" />
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────
export default function WarRoom({ data }: { data: HQData }) {
  const { stats, engine, campaigns, leadsByType, recentEmails, tools } = data;

  // Campaign max for bar scaling
  const campaignEntries = Object.entries(campaigns);
  const maxCampaignLeads = Math.max(
    ...campaignEntries.map(([, c]) => c.leads),
    1
  );

  // Lead type max
  const leadTypeEntries = Object.entries(leadsByType);
  const totalLeadsByType = leadTypeEntries.reduce((s, [, v]) => s + v, 0) || 1;
  const maxLeadType = Math.max(...leadTypeEntries.map(([, v]) => v), 1);

  // Last 10 emails
  const last10 = recentEmails.slice(0, 10);

  return (
    <div
      className="min-h-screen w-full p-4 md:p-6 lg:p-8"
      style={{
        backgroundColor: "#09090b",
        backgroundImage: `
          linear-gradient(rgba(197,164,93,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(197,164,93,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      {/* Title bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 mb-6"
      >
        <div
          className="h-3 w-3 rounded-full"
          style={{
            backgroundColor: GOLD,
            boxShadow: `0 0 10px ${GOLD}`,
          }}
        />
        <h1
          className="text-2xl md:text-3xl font-black uppercase tracking-widest text-[#fafafa]"
          style={{ textShadow: GOLD_GLOW }}
        >
          War Room
        </h1>
        <div
          className="h-3 w-3 rounded-full animate-pulse"
          style={{
            backgroundColor: "#22c55e",
            boxShadow: "0 0 10px #22c55e",
          }}
        />
        <span className="text-xs font-mono uppercase tracking-widest text-[#a1a1aa]">
          Live
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-[#C5A45D44] to-transparent" />
        {engine?.lastRun && (
          <span className="text-xs font-mono text-[#a1a1aa]">
            Last sweep:{" "}
            {new Date(engine.lastRun).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-5"
      >
        {/* ═══════════════ TOP ROW — 4 Stat Cards ═══════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="\u{1F3AF}"
            value={stats.totalLeads}
            label="Total Leads"
          />
          <StatCard
            icon="\u{1F4E8}"
            value={stats.emailsSent}
            label="Emails Sent"
          />
          <StatCard
            icon="\u{2705}"
            value={stats.deliveryRate}
            label="Delivery Rate"
            suffix="%"
            decimals={1}
          />
          <StatCard
            icon="\u{1F916}"
            value={engine?.runs ?? 0}
            label="AGI Engine Runs"
          />
        </div>

        {/* ═══════════════ MIDDLE ROW — Campaigns & Lead Dist ═══════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Campaign Performance */}
          <motion.div variants={fadeUp} className={cardBase}>
            <PanelHeader icon="\u{1F4CA}" title="Campaign Performance" />
            {campaignEntries.length === 0 ? (
              <p className="text-sm text-[#a1a1aa] italic">
                No campaigns yet.
              </p>
            ) : (
              campaignEntries.map(([name, c], i) => (
                <Bar
                  key={name}
                  label={name}
                  value={c.leads}
                  max={maxCampaignLeads}
                  color={CAMPAIGN_COLORS[i % CAMPAIGN_COLORS.length]}
                  suffix={` leads`}
                />
              ))
            )}
            {/* Campaign detail pills */}
            {campaignEntries.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {campaignEntries.map(([name, c], i) => (
                  <div
                    key={name}
                    className="flex items-center gap-1.5 rounded-full border border-[#27272a] bg-[#09090b] px-3 py-1"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor:
                          CAMPAIGN_COLORS[i % CAMPAIGN_COLORS.length],
                      }}
                    />
                    <span className="text-xs text-[#a1a1aa] font-mono">
                      {c.runs} runs &middot; {c.emails} emails &middot;{" "}
                      {c.bounces} bounced
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Lead Distribution */}
          <motion.div variants={fadeUp} className={cardBase}>
            <PanelHeader icon="\u{1F4C8}" title="Lead Distribution" />
            {leadTypeEntries.length === 0 ? (
              <p className="text-sm text-[#a1a1aa] italic">No lead data.</p>
            ) : (
              leadTypeEntries.map(([type, count]) => {
                const pct = ((count / totalLeadsByType) * 100).toFixed(1);
                return (
                  <div key={type} className="mb-3 last:mb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[#fafafa] font-medium truncate mr-2">
                        {type}
                      </span>
                      <span
                        className="text-sm font-bold whitespace-nowrap"
                        style={{ color: GOLD, textShadow: `0 0 10px ${GOLD}44` }}
                      >
                        {count.toLocaleString()}{" "}
                        <span className="text-xs text-[#a1a1aa] font-normal">
                          ({pct}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#27272a] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            (count / maxLeadType) * 100,
                            100
                          )}%`,
                        }}
                        transition={{
                          duration: 1.2,
                          ease: "easeOut",
                          delay: 0.4,
                        }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${GOLD}66, ${GOLD})`,
                          boxShadow: `0 0 8px ${GOLD}55`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        </div>

        {/* ═══════════════ BOTTOM ROW — Activity & Arsenal ═══════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Activity */}
          <motion.div
            variants={fadeUp}
            className={`${cardBase} flex flex-col`}
          >
            <PanelHeader icon="\u{26A1}" title="Recent Activity" />
            <div className="flex-1 overflow-y-auto max-h-72 pr-1 custom-scrollbar">
              {last10.length === 0 ? (
                <p className="text-sm text-[#a1a1aa] italic">
                  No recent activity.
                </p>
              ) : (
                <div className="space-y-2">
                  {last10.map((entry, i) => (
                    <motion.div
                      key={`${entry.timestamp}-${i}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.06 }}
                      className="flex items-center gap-3 rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-2"
                    >
                      <StatusDot status={entry.status} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#fafafa] truncate">
                          {entry.company}
                        </p>
                        <p className="text-xs text-[#a1a1aa] truncate font-mono">
                          {entry.email}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs uppercase font-bold tracking-wide"
                          style={{
                            color:
                              entry.status.toLowerCase() === "sent" ||
                              entry.status.toLowerCase() === "delivered"
                                ? "#22c55e"
                                : "#ef4444",
                          }}
                        >
                          {entry.status}
                        </span>
                        <p className="text-[10px] text-[#a1a1aa] font-mono">
                          {new Date(entry.timestamp).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Installed Arsenal */}
          <motion.div
            variants={fadeUp}
            className={`${cardBase} flex flex-col`}
          >
            <PanelHeader icon="\u{1F6E1}\uFE0F" title="Installed Arsenal" />
            <div className="flex-1 overflow-y-auto max-h-72 pr-1 custom-scrollbar">
              {tools.length === 0 ? (
                <p className="text-sm text-[#a1a1aa] italic">
                  No tools registered.
                </p>
              ) : (
                <div className="space-y-2">
                  {tools.map((tool, i) => (
                    <motion.div
                      key={tool.name}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.06 }}
                      className="flex items-center gap-3 rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-2.5"
                    >
                      <StatusDot status={tool.status} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#fafafa] truncate">
                          {tool.name}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-[#a1a1aa] bg-[#18181b] border border-[#27272a] rounded-md px-2 py-0.5">
                        v{tool.version}
                      </span>
                      <span
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{
                          color:
                            tool.status.toLowerCase() === "active"
                              ? "#22c55e"
                              : "#ef4444",
                          textShadow:
                            tool.status.toLowerCase() === "active"
                              ? "0 0 8px #22c55e55"
                              : "0 0 8px #ef444455",
                        }}
                      >
                        {tool.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ═══════════════ FOOTER STATS BAR ═══════════════ */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-xl border border-[#27272a] bg-[#18181b] px-5 py-3"
        >
          {[
            { label: "AGI Leads", value: stats.agiLeads },
            { label: "Hunted", value: stats.huntedLeads },
            { label: "Permits", value: stats.permitsLeads },
            { label: "Pipeline", value: stats.megaPipeline },
            { label: "Bounced", value: stats.emailsBounced },
            { label: "Skipped", value: stats.emailsSkipped },
            {
              label: "Bounce Rate",
              value: stats.bounceRate,
              suffix: "%",
              decimals: 1,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-center"
            >
              <span
                className="text-lg font-black"
                style={{ color: GOLD, textShadow: `0 0 8px ${GOLD}44` }}
              >
                {item.decimals
                  ? item.value.toFixed(item.decimals)
                  : item.value.toLocaleString()}
                {item.suffix ?? ""}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-[#a1a1aa]">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Custom scrollbar styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #09090b;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #C5A45D44;
        }
      `}</style>
    </div>
  );
}
