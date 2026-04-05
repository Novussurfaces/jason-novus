"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const WarRoom = dynamic(() => import("@/components/hq/WarRoom"), { ssr: false });
const LeadPipeline = dynamic(() => import("@/components/hq/LeadPipeline"), { ssr: false });
const AgiEngine = dynamic(() => import("@/components/hq/AgiEngine"), { ssr: false });
const AgentGrid = dynamic(() => import("@/components/hq/AgentGrid"), { ssr: false });
const ClawFleet = dynamic(() => import("@/components/hq/ClawFleet"), { ssr: false });
const Terminal = dynamic(() => import("@/components/hq/Terminal"), { ssr: false });
const QuickActions = dynamic(() => import("@/components/hq/QuickActions"), { ssr: false });

type Tab = "warroom" | "actions" | "pipeline" | "engine" | "agents" | "terminal";

interface HQData {
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
    scoringWeights: Record<string, number>;
    lastRun: string | null;
    lastOptimization: { timestamp: string; changes: string[] } | null;
  } | null;
  campaigns: Record<string, { runs: number; leads: number; emails: number; bounces: number }>;
  cities: Record<string, { leads: number; quality_avg: number }>;
  leadsByType: Record<string, number>;
  recentEmails: Array<{ timestamp: string; email: string; company: string; status: string }>;
  tools: Array<{ name: string; version: string; status: string }>;
  generatedAt: string;
}

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "warroom", label: "WAR ROOM", icon: "\u{1F3AF}" },
  { key: "actions", label: "ACTIONS", icon: "\u{26A1}" },
  { key: "pipeline", label: "PIPELINE", icon: "\u{1F4CA}" },
  { key: "engine", label: "AGI ENGINE", icon: "\u{1F9E0}" },
  { key: "agents", label: "16 AGENTS", icon: "\u{2694}" },
  { key: "terminal", label: "TERMINAL", icon: "\u{1F4BB}" },
];

export default function HQPage() {
  const [tab, setTab] = useState<Tab>("warroom");
  const [data, setData] = useState<HQData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/hq/data", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Connection error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Animated grid background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(197,164,93,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(197,164,93,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 border-b border-[#27272a] bg-[#09090b]/90 backdrop-blur-md"
      >
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#C5A45D] animate-pulse" />
              <h1
                className="text-2xl font-black tracking-[0.3em] text-[#C5A45D]"
                style={{ textShadow: "0 0 30px rgba(197,164,93,0.4)" }}
              >
                NOVUS HQ
              </h1>
            </div>
            <span className="text-xs text-[#71717a] tracking-widest uppercase">
              AGI Command Center
            </span>
          </div>

          <div className="flex items-center gap-4">
            {data && (
              <span className="text-xs text-[#71717a]">
                {new Date(data.generatedAt).toLocaleTimeString("fr-CA")}
              </span>
            )}
            <button
              onClick={fetchData}
              className="px-3 py-1.5 text-xs font-bold tracking-wider text-[#C5A45D] border border-[#C5A45D]/30 rounded-lg hover:bg-[#C5A45D]/10 transition-all"
            >
              REFRESH
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-[1600px] mx-auto px-6 flex gap-1 overflow-x-auto scrollbar-thin">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-6 py-3 text-sm font-bold tracking-wider transition-all ${
                tab === t.key
                  ? "text-[#C5A45D]"
                  : "text-[#71717a] hover:text-[#a1a1aa]"
              }`}
            >
              <span className="mr-2">{t.icon}</span>
              {t.label}
              {tab === t.key && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A45D] to-transparent"
                />
              )}
            </button>
          ))}
        </div>
      </motion.header>

      {/* Content */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-6 py-8">
        {loading ? (
          <LoadingScreen />
        ) : error ? (
          <ErrorScreen error={error} onRetry={fetchData} />
        ) : data ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tab === "warroom" && <WarRoom data={data} />}
              {tab === "actions" && <QuickActions />}
              {tab === "pipeline" && (
                <LeadPipeline
                  recentEmails={data.recentEmails}
                  stats={data.stats}
                  leadsByType={data.leadsByType}
                  cities={data.cities}
                />
              )}
              {tab === "engine" && (
                <AgiEngine
                  engine={data.engine}
                  campaigns={data.campaigns}
                  tools={data.tools}
                />
              )}
              {tab === "agents" && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-sm font-bold tracking-[0.3em] text-[#C5A45D] mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C5A45D]" />
                      NOVUS AGENTS
                    </h2>
                    <AgentGrid />
                  </div>
                  <div className="border-t border-[#27272a] pt-8">
                    <h2 className="text-sm font-bold tracking-[0.3em] text-purple-400 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      OPENCLAW FLEET
                    </h2>
                    <ClawFleet />
                  </div>
                </div>
              )}
              {tab === "terminal" && <Terminal />}
            </motion.div>
          </AnimatePresence>
        ) : null}
      </main>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-2 border-[#27272a] border-t-[#C5A45D] rounded-full mb-6"
      />
      <p
        className="text-lg font-bold tracking-widest text-[#C5A45D]"
        style={{ textShadow: "0 0 20px rgba(197,164,93,0.3)" }}
      >
        INITIALIZING SYSTEMS...
      </p>
      <div className="flex gap-1 mt-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 rounded-full bg-[#C5A45D]"
          />
        ))}
      </div>
    </div>
  );
}

function ErrorScreen({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="text-4xl mb-4">&#x26A0;</div>
      <p className="text-lg font-bold text-red-400 mb-2">CONNECTION ERROR</p>
      <p className="text-sm text-[#71717a] mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-[#C5A45D] text-black font-bold rounded-lg hover:bg-[#D4B75E] transition-all"
      >
        RETRY
      </button>
    </div>
  );
}
