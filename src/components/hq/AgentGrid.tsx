"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AgentRuntime {
  state: "idle" | "running" | "success" | "error";
  lastRun: string | null;
  lastDuration: number | null;
  lastResult: string | null;
  runsTotal: number;
  errorsTotal: number;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  script: string;
  command: string;
  schedule: string;
  ai_model: string | null;
  status: string;
  runtime: AgentRuntime;
  outputStats: Record<string, number>;
}

interface AgentsData {
  agents: Agent[];
  config: { totalAgents: number; runningCount: number; readyCount: number };
}

const STATE_COLORS: Record<string, string> = {
  idle: "#71717a",
  running: "#C5A45D",
  success: "#22c55e",
  error: "#ef4444",
};

const STATE_LABELS: Record<string, string> = {
  idle: "EN ATTENTE",
  running: "EN COURS",
  success: "TERMINÉ",
  error: "ERREUR",
};

const AGENT_ICONS: Record<string, string> = {
  atlas: "\u{1F30D}",     // globe
  viper: "\u{1F50D}",     // magnifier
  hawk: "\u{1F3D7}",      // construction
  prism: "\u{1F4A0}",     // diamond
  nexus: "\u{1F9E0}",     // brain
  forge: "\u{1F525}",     // fire
  phantom: "\u{1F47B}",   // ghost
  sentinel: "\u{1F6E1}",  // shield
  cipher: "\u{1F5C3}",    // file cabinet
  commander: "\u{2694}",  // swords
};

export default function AgentGrid() {
  const [data, setData] = useState<AgentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch("/api/agents", { cache: "no-store" });
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
    fetchAgents();
    const interval = setInterval(fetchAgents, 5000);
    return () => clearInterval(interval);
  }, [fetchAgents]);

  const triggerAgent = async (agentId: string, action: "run" | "test" | "stop") => {
    setActionLoading(`${agentId}-${action}`);
    try {
      await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, agentId }),
      });
      setTimeout(fetchAgents, 1000);
    } catch {
      /* silent */
    } finally {
      setActionLoading(null);
    }
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

  const running = data.agents.filter((a) => a.runtime.state === "running").length;
  const ready = data.agents.filter((a) => a.status === "ready").length;
  const errors = data.agents.filter((a) => a.runtime.state === "error").length;

  return (
    <div>
      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "AGENTS", value: data.agents.length, color: "#C5A45D" },
          { label: "ACTIFS", value: running, color: "#C5A45D" },
          { label: "PR\u00CATS", value: ready, color: "#22c55e" },
          { label: "ERREURS", value: errors, color: errors > 0 ? "#ef4444" : "#22c55e" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 text-center"
          >
            <p className="text-3xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs text-[#71717a] tracking-widest mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Run All / Stop All */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => data.agents.forEach((a) => triggerAgent(a.id, "run"))}
          className="px-6 py-2.5 bg-[#C5A45D] text-black font-bold text-sm tracking-wider rounded-lg hover:bg-[#D4B75E] transition-all"
        >
          LANCER TOUS LES AGENTS
        </button>
        <button
          onClick={() => data.agents.forEach((a) => triggerAgent(a.id, "test"))}
          className="px-6 py-2.5 border border-[#C5A45D]/40 text-[#C5A45D] font-bold text-sm tracking-wider rounded-lg hover:bg-[#C5A45D]/10 transition-all"
        >
          TEST DRY-RUN
        </button>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {data.agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden hover:border-[#C5A45D]/30 transition-all"
            >
              {/* Agent Header */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpanded(expanded === agent.id ? null : agent.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{AGENT_ICONS[agent.id] || "\u{1F916}"}</span>
                    <div>
                      <h3 className="text-lg font-black tracking-wider text-white">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-[#C5A45D] font-semibold tracking-wide">
                        {agent.role}
                      </p>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={
                        agent.runtime.state === "running"
                          ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }
                          : {}
                      }
                      transition={
                        agent.runtime.state === "running"
                          ? { duration: 1.5, repeat: Infinity }
                          : {}
                      }
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: STATE_COLORS[agent.runtime.state] }}
                    />
                    <span
                      className="text-xs font-bold tracking-wider"
                      style={{ color: STATE_COLORS[agent.runtime.state] }}
                    >
                      {STATE_LABELS[agent.runtime.state]}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#a1a1aa] leading-relaxed">{agent.description}</p>

                {/* Quick stats */}
                <div className="flex gap-4 mt-3">
                  {agent.ai_model && (
                    <span className="text-xs px-2 py-1 rounded bg-[#5C4A1E]/30 text-[#C5A45D] font-mono">
                      {agent.ai_model}
                    </span>
                  )}
                  <span className="text-xs text-[#71717a]">
                    {agent.runtime.runsTotal} runs
                  </span>
                  {agent.runtime.lastDuration !== null && (
                    <span className="text-xs text-[#71717a]">
                      {agent.runtime.lastDuration}s
                    </span>
                  )}
                  {agent.schedule && (
                    <span className="text-xs text-[#71717a] font-mono">{agent.schedule}</span>
                  )}
                </div>
              </div>

              {/* Expanded panel */}
              <AnimatePresence>
                {expanded === agent.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-[#27272a] overflow-hidden"
                  >
                    <div className="p-5 space-y-4">
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => triggerAgent(agent.id, "run")}
                          disabled={
                            actionLoading === `${agent.id}-run` ||
                            agent.runtime.state === "running"
                          }
                          className="px-4 py-2 bg-[#C5A45D] text-black text-xs font-bold tracking-wider rounded-lg hover:bg-[#D4B75E] disabled:opacity-50 transition-all"
                        >
                          {actionLoading === `${agent.id}-run` ? "LANCEMENT..." : "LANCER"}
                        </button>
                        <button
                          onClick={() => triggerAgent(agent.id, "test")}
                          disabled={actionLoading === `${agent.id}-test`}
                          className="px-4 py-2 border border-[#C5A45D]/40 text-[#C5A45D] text-xs font-bold tracking-wider rounded-lg hover:bg-[#C5A45D]/10 disabled:opacity-50 transition-all"
                        >
                          {actionLoading === `${agent.id}-test` ? "TEST..." : "DRY-RUN"}
                        </button>
                        {agent.runtime.state === "running" && (
                          <button
                            onClick={() => triggerAgent(agent.id, "stop")}
                            className="px-4 py-2 border border-red-500/40 text-red-400 text-xs font-bold tracking-wider rounded-lg hover:bg-red-500/10 transition-all"
                          >
                            STOP
                          </button>
                        )}
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-[#71717a] mb-1">Script</p>
                          <p className="text-white font-mono">{agent.script}</p>
                        </div>
                        <div>
                          <p className="text-[#71717a] mb-1">Commande</p>
                          <p className="text-white font-mono text-[10px] break-all">
                            {agent.command}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#71717a] mb-1">Dernier run</p>
                          <p className="text-white">
                            {agent.runtime.lastRun
                              ? new Date(agent.runtime.lastRun).toLocaleString("fr-CA")
                              : "Jamais"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#71717a] mb-1">Erreurs</p>
                          <p
                            style={{
                              color: agent.runtime.errorsTotal > 0 ? "#ef4444" : "#22c55e",
                            }}
                          >
                            {agent.runtime.errorsTotal}
                          </p>
                        </div>
                      </div>

                      {/* Output files */}
                      {Object.keys(agent.outputStats).length > 0 && (
                        <div>
                          <p className="text-xs text-[#71717a] mb-2">Outputs</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(agent.outputStats).map(([file, count]) => (
                              <span
                                key={file}
                                className="text-[10px] px-2 py-1 rounded bg-[#27272a] text-[#a1a1aa] font-mono"
                              >
                                {file}: {count} rows
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Last result */}
                      {agent.runtime.lastResult && (
                        <div>
                          <p className="text-xs text-[#71717a] mb-1">Dernier r\u00e9sultat</p>
                          <pre className="text-[10px] text-[#a1a1aa] bg-[#0a0a0a] rounded-lg p-3 overflow-x-auto max-h-32 overflow-y-auto font-mono">
                            {agent.runtime.lastResult}
                          </pre>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
