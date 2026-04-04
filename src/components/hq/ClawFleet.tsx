"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────
interface ClawSkill {
  id: string;
  name: string;
  enabled: boolean;
}

interface ClawStatus {
  state: "offline" | "deploying" | "running" | "error" | "stopped";
  lastActivity: string | null;
  leadsGenerated: number;
  costUsd: number;
  uptime: number;
  logs: string[];
}

interface ClawAgent {
  id: string;
  name: string;
  icon: string;
  role: string;
  description: string;
  model: string;
  schedule: string;
  port: number;
  skills: ClawSkill[];
  output: string;
  target: string;
  feeds_into: string;
  status: ClawStatus;
}

interface PowerMode {
  label: string;
  description: string;
  models: Record<string, string>;
  cost_per_hour: number;
}

interface ClawData {
  agents: ClawAgent[];
  meta: { budget?: number; total_agents?: number };
  power_modes: Record<string, PowerMode>;
  deployment: { vps_host?: string; ports?: Record<string, number> };
}

// ─── Constants ──────────────────────────────────────────────────
const STATE_CONFIG: Record<string, { color: string; label: string; glow: string }> = {
  offline: { color: "#52525b", label: "OFFLINE", glow: "none" },
  deploying: { color: "#f59e0b", label: "DEPLOYING", glow: "0 0 12px rgba(245,158,11,0.4)" },
  running: { color: "#22c55e", label: "RUNNING", glow: "0 0 12px rgba(34,197,94,0.4)" },
  error: { color: "#ef4444", label: "ERREUR", glow: "0 0 12px rgba(239,68,68,0.4)" },
  stopped: { color: "#71717a", label: "STOPPED", glow: "none" },
};

const ICON_MAP: Record<string, string> = {
  radar: "\u{1F4E1}",
  crosshair: "\u{1F3AF}",
  building: "\u{1F3D7}",
  sparkles: "\u{2728}",
  eye: "\u{1F441}",
  brain: "\u{1F9E0}",
};

// ─── Component ──────────────────────────────────────────────────
export default function ClawFleet() {
  const [data, setData] = useState<ClawData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [powerMode, setPowerMode] = useState<string>("free");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [terminalAgent, setTerminalAgent] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/claw", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      setData(json);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // ── Actions
  const doAction = async (action: string, agentId?: string, extra?: Record<string, unknown>) => {
    const key = agentId ? `${agentId}-${action}` : action;
    setActionLoading(key);
    try {
      await fetch("/api/claw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, agentId, data: extra }),
      });
      setTimeout(fetchData, 500);
      setTimeout(fetchData, 2500);
    } catch {
      /* silent */
    } finally {
      setTimeout(() => setActionLoading(null), 300);
    }
  };

  const toggleSkill = async (agentId: string, skillId: string) => {
    if (!data) return;
    const agent = data.agents.find((a) => a.id === agentId);
    if (!agent) return;
    const updatedSkills = agent.skills.map((s) =>
      s.id === skillId ? { ...s, enabled: !s.enabled } : s
    );
    await doAction("update-skills", agentId, { skills: updatedSkills });
  };

  const changePowerMode = async (mode: string) => {
    setPowerMode(mode);
    await doAction("set-power", undefined, { mode });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-[#27272a] border-t-[#C5A45D] rounded-full"
        />
      </div>
    );
  }

  if (!data) return null;

  const running = data.agents.filter((a) => a.status.state === "running").length;
  const totalCost = data.agents.reduce((sum, a) => sum + (a.status.costUsd || 0), 0);
  const totalLeads = data.agents.reduce((sum, a) => sum + (a.status.leadsGenerated || 0), 0);
  const budget = data.meta.budget || 20;

  return (
    <div>
      {/* ── Header Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: "CLAWS", value: data.agents.length, color: "#C5A45D", suffix: "" },
          { label: "ACTIFS", value: running, color: running > 0 ? "#22c55e" : "#71717a", suffix: "" },
          { label: "LEADS", value: totalLeads, color: "#C5A45D", suffix: "" },
          { label: "BUDGET", value: budget - totalCost, color: totalCost > budget * 0.8 ? "#ef4444" : "#22c55e", suffix: "$" },
          { label: "SPENT", value: totalCost.toFixed(2), color: "#71717a", suffix: "$" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-[#18181b] border border-[#27272a] rounded-xl p-3 text-center"
          >
            <p className="text-2xl font-black" style={{ color: s.color }}>
              {s.suffix === "$" ? `$${s.value}` : s.value}
            </p>
            <p className="text-[10px] text-[#71717a] tracking-widest mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Power Mode + Actions ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex rounded-lg overflow-hidden border border-[#27272a]">
          {["free", "balanced", "beast"].map((mode) => (
            <button
              key={mode}
              onClick={() => changePowerMode(mode)}
              className={`px-4 py-2 text-xs font-bold tracking-wider transition-all ${
                powerMode === mode
                  ? mode === "beast"
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : mode === "balanced"
                    ? "bg-[#C5A45D]/20 text-[#C5A45D]"
                    : "bg-[#22c55e]/20 text-[#22c55e]"
                  : "text-[#71717a] hover:text-white"
              }`}
            >
              {mode === "free" ? "\u{26A1} FREE" : mode === "balanced" ? "\u{1F4A1} BALANCED" : "\u{1F525} BEAST"}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <button
          onClick={() => doAction("deploy-all")}
          disabled={actionLoading === "deploy-all"}
          className="px-5 py-2 bg-[#22c55e]/20 text-[#22c55e] text-xs font-bold tracking-wider rounded-lg border border-[#22c55e]/30 hover:bg-[#22c55e]/30 disabled:opacity-50 transition-all"
        >
          {actionLoading === "deploy-all" ? "DEPLOYING..." : "\u{1F680} DEPLOY ALL"}
        </button>
        <button
          onClick={() => doAction("stop-all")}
          disabled={actionLoading === "stop-all"}
          className="px-5 py-2 bg-red-500/10 text-red-400 text-xs font-bold tracking-wider rounded-lg border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-all"
        >
          STOP ALL
        </button>
      </div>

      {/* ── Power Mode Info ── */}
      {data.power_modes[powerMode] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6 px-4 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-[#a1a1aa]"
        >
          <span className="font-bold text-white mr-2">{data.power_modes[powerMode].label}</span>
          {data.power_modes[powerMode].description}
          <span className="ml-3 text-[#C5A45D]">
            ~${data.power_modes[powerMode].cost_per_hour}/h
          </span>
        </motion.div>
      )}

      {/* ── Agent Grid ── */}
      <div className="space-y-4">
        <AnimatePresence>
          {data.agents.map((agent, i) => {
            const stateConf = STATE_CONFIG[agent.status.state] || STATE_CONFIG.offline;
            const isOmega = agent.id === "claw-omega";
            const isExpanded = expanded === agent.id;

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-xl overflow-hidden border transition-all ${
                  isOmega
                    ? "bg-gradient-to-br from-[#18181b] to-[#1a1520] border-purple-500/30"
                    : "bg-[#18181b] border-[#27272a] hover:border-[#C5A45D]/30"
                }`}
              >
                {/* ── Agent Header ── */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : agent.id)}
                >
                  <div className="flex items-center gap-3">
                    {/* Icon + Status */}
                    <div className="relative">
                      <span className="text-2xl">{ICON_MAP[agent.icon] || "\u{1F916}"}</span>
                      <motion.div
                        animate={
                          agent.status.state === "running"
                            ? { scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }
                            : {}
                        }
                        transition={
                          agent.status.state === "running"
                            ? { duration: 1.5, repeat: Infinity }
                            : {}
                        }
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#18181b]"
                        style={{ backgroundColor: stateConf.color, boxShadow: stateConf.glow }}
                      />
                    </div>

                    {/* Name + Role */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-base font-black tracking-wider ${isOmega ? "text-purple-400" : "text-white"}`}>
                          {agent.name}
                        </h3>
                        <span
                          className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full"
                          style={{ color: stateConf.color, backgroundColor: `${stateConf.color}15` }}
                        >
                          {stateConf.label}
                        </span>
                        {isOmega && (
                          <span className="text-[10px] font-bold tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                            MEGA
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#C5A45D] font-semibold">{agent.role}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="hidden md:flex items-center gap-4 text-xs text-[#71717a]">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#27272a] text-[#a1a1aa]">
                        {agent.model.split("/").pop()?.replace(":free", "") || agent.model}
                      </span>
                      <span>:{agent.port}</span>
                      <span>{agent.target}</span>
                    </div>

                    {/* Expand arrow */}
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="text-[#71717a] text-sm"
                    >
                      &#x25BC;
                    </motion.span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">{agent.description}</p>

                  {/* Skills chips (compact) */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {agent.skills.slice(0, isExpanded ? 999 : 4).map((skill) => (
                      <span
                        key={skill.id}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-all ${
                          skill.enabled
                            ? isOmega
                              ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                              : "bg-[#C5A45D]/10 text-[#C5A45D] border border-[#C5A45D]/20"
                            : "bg-[#27272a] text-[#52525b] border border-[#27272a]"
                        }`}
                      >
                        {skill.name}
                      </span>
                    ))}
                    {!isExpanded && agent.skills.length > 4 && (
                      <span className="text-[10px] text-[#71717a]">+{agent.skills.length - 4}</span>
                    )}
                  </div>
                </div>

                {/* ── Expanded Panel ── */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-[#27272a] overflow-hidden"
                    >
                      <div className="p-4 space-y-4">
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); doAction("deploy", agent.id); }}
                            disabled={actionLoading === `${agent.id}-deploy` || agent.status.state === "running"}
                            className="px-4 py-2 bg-[#22c55e]/20 text-[#22c55e] text-xs font-bold tracking-wider rounded-lg border border-[#22c55e]/30 hover:bg-[#22c55e]/30 disabled:opacity-40 transition-all"
                          >
                            {actionLoading === `${agent.id}-deploy` ? "DEPLOYING..." : "\u{1F680} DEPLOY"}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); doAction("stop", agent.id); }}
                            disabled={agent.status.state === "offline" || agent.status.state === "stopped"}
                            className="px-4 py-2 text-red-400 text-xs font-bold tracking-wider rounded-lg border border-red-500/20 hover:bg-red-500/10 disabled:opacity-40 transition-all"
                          >
                            STOP
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setTerminalAgent(terminalAgent === agent.id ? null : agent.id); }}
                            className={`px-4 py-2 text-xs font-bold tracking-wider rounded-lg border transition-all ${
                              terminalAgent === agent.id
                                ? "bg-[#C5A45D]/20 text-[#C5A45D] border-[#C5A45D]/30"
                                : "text-[#71717a] border-[#27272a] hover:text-white"
                            }`}
                          >
                            {"\u{1F4BB}"} TERMINAL
                          </button>
                          <div className="flex-1" />
                          <span className="text-[10px] text-[#71717a] self-center font-mono">
                            \u{2192} Feeds: <span className="text-[#C5A45D]">{agent.feeds_into}</span>
                          </span>
                        </div>

                        {/* Terminal */}
                        <AnimatePresence>
                          {terminalAgent === agent.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                            >
                              <TerminalView logs={agent.status.logs} agentName={agent.name} />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Skills (toggleable) */}
                        <div>
                          <p className="text-[10px] text-[#71717a] tracking-widest mb-2">SKILLS</p>
                          <div className="flex flex-wrap gap-2">
                            {agent.skills.map((skill) => (
                              <button
                                key={skill.id}
                                onClick={(e) => { e.stopPropagation(); toggleSkill(agent.id, skill.id); }}
                                className={`text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                  skill.enabled
                                    ? isOmega
                                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30"
                                      : "bg-[#C5A45D]/15 text-[#C5A45D] border border-[#C5A45D]/30 hover:bg-[#C5A45D]/25"
                                    : "bg-[#18181b] text-[#52525b] border border-[#27272a] hover:text-[#a1a1aa] hover:border-[#52525b]"
                                }`}
                              >
                                {skill.enabled ? "\u2713 " : ""}{skill.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div>
                            <p className="text-[#71717a] mb-0.5">Model</p>
                            <p className="text-white font-mono text-[10px] break-all">{agent.model}</p>
                          </div>
                          <div>
                            <p className="text-[#71717a] mb-0.5">Schedule</p>
                            <p className="text-white font-mono">{agent.schedule}</p>
                          </div>
                          <div>
                            <p className="text-[#71717a] mb-0.5">Output</p>
                            <p className="text-white font-mono text-[10px]">{agent.output}</p>
                          </div>
                          <div>
                            <p className="text-[#71717a] mb-0.5">Port</p>
                            <p className="text-white font-mono">:{agent.port}</p>
                          </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="flex gap-6 pt-2 border-t border-[#27272a]">
                          <div className="text-center">
                            <p className="text-lg font-black text-[#C5A45D]">{agent.status.leadsGenerated}</p>
                            <p className="text-[10px] text-[#71717a] tracking-wider">LEADS</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-black text-white">${agent.status.costUsd.toFixed(2)}</p>
                            <p className="text-[10px] text-[#71717a] tracking-wider">COST</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-black text-white">{agent.status.uptime}h</p>
                            <p className="text-[10px] text-[#71717a] tracking-wider">UPTIME</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-black" style={{ color: agent.model.includes(":free") ? "#22c55e" : "#f59e0b" }}>
                              {agent.model.includes(":free") ? "FREE" : "PAID"}
                            </p>
                            <p className="text-[10px] text-[#71717a] tracking-wider">TIER</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Pipeline Flow ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 rounded-xl bg-[#18181b] border border-[#27272a] p-5"
      >
        <h3 className="text-sm font-bold tracking-widest text-[#C5A45D] mb-3">PIPELINE FLOW</h3>
        <div className="space-y-1.5 font-mono text-[11px]">
          {data.agents.filter(a => a.id !== "claw-omega").map((agent) => (
            <div key={agent.id} className="flex items-center gap-2">
              <span className="text-[#71717a] w-24">{agent.name}</span>
              <span className="text-[#52525b]">\u2192</span>
              <span className="text-[#a1a1aa]">{agent.output}</span>
              <span className="text-[#52525b]">\u2192</span>
              <span className="text-[#C5A45D] font-bold">{agent.feeds_into}</span>
              <motion.div
                className="w-2 h-2 rounded-full ml-auto"
                style={{ backgroundColor: STATE_CONFIG[agent.status.state]?.color || "#52525b" }}
                animate={agent.status.state === "running" ? { opacity: [1, 0.3, 1] } : {}}
                transition={agent.status.state === "running" ? { duration: 1.5, repeat: Infinity } : {}}
              />
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2 border-t border-[#27272a] mt-2">
            <span className="text-purple-400 w-24 font-bold">OMEGA</span>
            <span className="text-[#52525b]">\u2192</span>
            <span className="text-purple-300">repos, plugins, tools, growth hacks</span>
            <span className="text-[#52525b]">\u2192</span>
            <span className="text-purple-400 font-bold">ALL AGENTS</span>
          </div>
        </div>
      </motion.div>

      {/* ── VPS Connection Info ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 rounded-xl bg-[#0a0a0a] border border-[#27272a] p-4"
      >
        <div className="flex items-center gap-3 text-xs font-mono text-[#71717a]">
          <span className="text-[#22c55e]">\u25CF</span>
          <span>VPS: {data.deployment.vps_host || "100.83.113.25"}</span>
          <span className="text-[#27272a]">|</span>
          <span>Gateway: :18789</span>
          <span className="text-[#27272a]">|</span>
          <span>Ports: 18790-18795</span>
          <span className="text-[#27272a]">|</span>
          <span className="text-[#C5A45D]">{data.agents.length} containers</span>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Terminal Component ─────────────────────────────────────────
function TerminalView({ logs, agentName }: { logs: string[]; agentName: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="rounded-lg overflow-hidden border border-[#27272a]">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] border-b border-[#27272a]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
        </div>
        <span className="text-[10px] text-[#71717a] font-mono ml-2">
          claw-{agentName.toLowerCase()}@novus-vps ~ $
        </span>
      </div>
      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="bg-[#0a0a0a] p-3 font-mono text-[11px] leading-relaxed max-h-40 overflow-y-auto"
      >
        {logs.length === 0 ? (
          <p className="text-[#52525b]">Waiting for output...</p>
        ) : (
          logs.map((line, i) => (
            <div key={i} className="flex">
              <span className="text-[#22c55e] mr-2 select-none">&gt;</span>
              <span
                className={
                  line.includes("ERROR") || line.includes("error")
                    ? "text-red-400"
                    : line.includes("LIVE") || line.includes("started") || line.includes("success")
                    ? "text-[#22c55e]"
                    : line.includes("Deploying") || line.includes("deploy")
                    ? "text-[#f59e0b]"
                    : "text-[#a1a1aa]"
                }
              >
                {line}
              </span>
            </div>
          ))
        )}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-[#22c55e]"
        >
          _
        </motion.span>
      </div>
    </div>
  );
}
