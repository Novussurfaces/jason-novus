"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface AgiEngineProps {
  engine: {
    runs: number;
    leadsFound: number;
    deadDomains: number;
    knownDomains: number;
    scoringWeights: Record<string, number>;
    lastRun: string | null;
    lastOptimization: { timestamp: string; changes: string[] } | null;
  } | null;
  campaigns: Record<
    string,
    { runs: number; leads: number; emails: number; bounces: number }
  >;
  tools: Array<{ name: string; version: string; status: string }>;
}

const AGENTS = [
  { name: "SCOUT", emoji: "\uD83D\uDD0D" },
  { name: "HUNTER", emoji: "\uD83C\uDFAF" },
  { name: "ENRICHER", emoji: "\u2728" },
  { name: "PERMITS", emoji: "\uD83C\uDFE2" },
  { name: "VALIDATOR", emoji: "\uD83D\uDEE1\uFE0F" },
  { name: "SCORER", emoji: "\u2B50" },
  { name: "WRITER", emoji: "\u270F\uFE0F" },
  { name: "SENDER", emoji: "\uD83D\uDE80" },
  { name: "TRACKER", emoji: "\uD83D\uDD14" },
  { name: "MASTER", emoji: "\uD83E\uDDE0" },
  { name: "MEMORY", emoji: "\uD83D\uDDC4\uFE0F" },
  { name: "OPTIMIZER", emoji: "\uD83D\uDCC8" },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

const pulseKeyframes = {
  boxShadow: [
    "0 0 4px 1px rgba(197,164,93,0.15)",
    "0 0 12px 3px rgba(197,164,93,0.35)",
    "0 0 4px 1px rgba(197,164,93,0.15)",
  ],
};

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A45D] mb-3 flex items-center gap-2">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A45D]" />
      {children}
    </h3>
  );
}

function PanelCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className={`rounded-xl border border-[#27272a] bg-[#18181b]/80 backdrop-blur-sm p-4 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ---------- AGENT GRID ---------- */
function AgentGrid() {
  return (
    <PanelCard>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-100">
          12-Agent System Status
        </h2>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2"
      >
        {AGENTS.map((agent, i) => (
          <motion.div
            key={agent.name}
            variants={itemVariants}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 18px 4px rgba(197,164,93,0.3)",
            }}
            animate={pulseKeyframes}
            transition={{
              boxShadow: {
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.18,
              },
            }}
            className="relative flex flex-col items-center justify-center gap-1.5 rounded-lg border border-[#27272a] bg-[#09090b] p-3 cursor-default select-none"
          >
            {/* status light */}
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.6)]" />
            <span className="text-xl leading-none">{agent.emoji}</span>
            <span className="text-[10px] font-semibold tracking-widest text-zinc-400">
              {agent.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </PanelCard>
  );
}

/* ---------- SCORING WEIGHTS ---------- */
function ScoringWeights({
  weights,
}: {
  weights: Record<string, number> | undefined;
}) {
  const entries = weights
    ? Object.entries(weights).sort(([, a], [, b]) => b - a)
    : [];

  return (
    <PanelCard className="flex flex-col h-full">
      <SectionHeader>Scoring Weights</SectionHeader>

      {entries.length === 0 ? (
        <p className="text-xs text-zinc-500 italic">No weights configured.</p>
      ) : (
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 max-h-72 custom-scrollbar">
          {entries.map(([label, value], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[11px] font-medium text-zinc-300 capitalize">
                  {label.replace(/_/g, " ")}
                </span>
                <span className="text-[11px] font-bold text-[#C5A45D] tabular-nums">
                  {value}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#09090b] overflow-hidden border border-[#27272a]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((value / 30) * 100, 100)}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4 + i * 0.06,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #8B7332, #C5A45D, #E8D48B)",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </PanelCard>
  );
}

/* ---------- CAMPAIGN ROI ---------- */
function CampaignROI({
  campaigns,
}: {
  campaigns: AgiEngineProps["campaigns"];
}) {
  const rows = Object.entries(campaigns)
    .map(([name, c]) => ({
      name,
      ...c,
      efficiency: c.runs > 0 ? c.leads / c.runs : 0,
      bounceRate: c.emails > 0 ? c.bounces / c.emails : 0,
    }))
    .sort((a, b) => b.efficiency - a.efficiency);

  return (
    <PanelCard className="flex flex-col h-full">
      <SectionHeader>Campaign ROI</SectionHeader>

      {rows.length === 0 ? (
        <p className="text-xs text-zinc-500 italic">No campaigns yet.</p>
      ) : (
        <div className="overflow-x-auto flex-1 max-h-72 custom-scrollbar">
          <table className="w-full text-[11px] text-left">
            <thead>
              <tr className="text-zinc-500 uppercase tracking-wider border-b border-[#27272a]">
                <th className="py-1.5 pr-2 font-semibold">Campaign</th>
                <th className="py-1.5 px-2 font-semibold text-right">Runs</th>
                <th className="py-1.5 px-2 font-semibold text-right">
                  Leads
                </th>
                <th className="py-1.5 px-2 font-semibold text-right">
                  Emails
                </th>
                <th className="py-1.5 px-2 font-semibold text-right">
                  Bounce
                </th>
                <th className="py-1.5 pl-2 font-semibold text-right">
                  Eff.
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <motion.tr
                  key={r.name}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.07 }}
                  className="border-b border-[#27272a]/50 hover:bg-[#27272a]/30 transition-colors"
                >
                  <td className="py-1.5 pr-2 text-zinc-200 font-medium truncate max-w-[120px]">
                    {r.name}
                  </td>
                  <td className="py-1.5 px-2 text-right text-zinc-400 tabular-nums">
                    {r.runs}
                  </td>
                  <td className="py-1.5 px-2 text-right text-zinc-300 tabular-nums font-medium">
                    {r.leads}
                  </td>
                  <td className="py-1.5 px-2 text-right text-zinc-400 tabular-nums">
                    {r.emails}
                  </td>
                  <td className="py-1.5 px-2 text-right tabular-nums">
                    <span
                      className={
                        r.bounceRate > 0.1
                          ? "text-red-400"
                          : "text-emerald-400"
                      }
                    >
                      {(r.bounceRate * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-1.5 pl-2 text-right text-[#C5A45D] tabular-nums font-bold">
                    {r.efficiency.toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PanelCard>
  );
}

/* ---------- OPTIMIZATION LOG ---------- */
function OptimizationLog({
  lastOptimization,
}: {
  lastOptimization: AgiEngineProps["engine"] extends infer E
    ? E extends { lastOptimization: infer O }
      ? O
      : null
    : null;
}) {
  return (
    <PanelCard>
      <SectionHeader>Optimization Log</SectionHeader>

      {lastOptimization ? (
        <>
          <p className="text-[10px] text-zinc-500 mb-2 tabular-nums">
            Last run:{" "}
            <span className="text-zinc-400">
              {new Date(lastOptimization.timestamp).toLocaleString()}
            </span>
          </p>
          <ul className="space-y-1.5">
            {lastOptimization.changes.map((change, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-start gap-2 text-[11px] text-zinc-300"
              >
                <span className="text-[#C5A45D] mt-px shrink-0">{"\u25B6"}</span>
                <span>{change}</span>
              </motion.li>
            ))}
          </ul>
        </>
      ) : (
        <div className="flex items-center gap-3 py-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 rounded-full border-2 border-[#C5A45D] border-t-transparent"
          />
          <span className="text-xs text-zinc-500 italic">
            Collecting data...
          </span>
        </div>
      )}
    </PanelCard>
  );
}

/* ---------- ARSENAL ---------- */
function Arsenal({ tools }: { tools: AgiEngineProps["tools"] }) {
  return (
    <PanelCard>
      <SectionHeader>Arsenal</SectionHeader>

      {tools.length === 0 ? (
        <p className="text-xs text-zinc-500 italic">No tools installed.</p>
      ) : (
        <div className="overflow-x-auto pb-1 custom-scrollbar">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-2 min-w-max"
          >
            {tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                variants={itemVariants}
                whileHover={{
                  scale: 1.06,
                  borderColor: "rgba(197,164,93,0.5)",
                }}
                className="flex items-center gap-2 rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-2 shrink-0"
              >
                <span className="text-[11px] font-semibold text-zinc-200">
                  {tool.name}
                </span>
                <span className="text-[9px] font-mono rounded-full px-1.5 py-0.5 bg-[#C5A45D]/15 text-[#C5A45D] border border-[#C5A45D]/30">
                  v{tool.version}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    tool.status === "active" || tool.status === "ready"
                      ? "bg-emerald-400 shadow-[0_0_4px_1px_rgba(52,211,153,0.5)]"
                      : tool.status === "error"
                        ? "bg-red-400 shadow-[0_0_4px_1px_rgba(248,113,113,0.5)]"
                        : "bg-zinc-500"
                  }`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </PanelCard>
  );
}

/* ========== MAIN COMPONENT ========== */
export default function AgiEngine({
  engine,
  campaigns,
  tools,
}: AgiEngineProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full min-h-screen bg-[#09090b] text-zinc-100 p-4 md:p-6 space-y-4 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C5A45D]/[0.03] blur-3xl" />
        <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.02] blur-3xl" />
      </div>

      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto space-y-4"
      >
        {/* HEADER */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-lg md:text-xl font-black uppercase tracking-[0.3em] text-zinc-100">
              AGI Engine
            </h1>
            <p className="text-[10px] text-zinc-500 tracking-widest uppercase mt-0.5">
              Autonomous Lead Generation Intelligence
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-zinc-500 tabular-nums">
            {engine && (
              <>
                <span>
                  Runs:{" "}
                  <span className="text-zinc-300 font-bold">{engine.runs}</span>
                </span>
                <span className="text-[#27272a]">|</span>
                <span>
                  Leads:{" "}
                  <span className="text-emerald-400 font-bold">
                    {engine.leadsFound}
                  </span>
                </span>
                <span className="text-[#27272a]">|</span>
                <span>
                  Domains:{" "}
                  <span className="text-zinc-300 font-bold">
                    {engine.knownDomains}
                  </span>
                </span>
              </>
            )}
          </div>
        </motion.div>

        {/* TOP: Agent Grid */}
        <AgentGrid />

        {/* MIDDLE: Scoring Weights + Campaign ROI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScoringWeights weights={engine?.scoringWeights} />
          <CampaignROI campaigns={campaigns} />
        </div>

        {/* BOTTOM: Optimization Log */}
        <OptimizationLog
          lastOptimization={engine?.lastOptimization ?? null}
        />

        {/* FOOTER: Arsenal */}
        <Arsenal tools={tools} />
      </motion.div>
    </motion.section>
  );
}
