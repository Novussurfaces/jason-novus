"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  category: "leads" | "agents" | "comms" | "system";
  action: () => Promise<string>;
}

const ACTIONS: QuickAction[] = [
  // LEADS
  {
    id: "call-jason",
    label: "Appeler Jason",
    icon: "\u{1F4DE}",
    color: "#C5A45D",
    category: "leads",
    action: async () => {
      window.open("tel:5813072678");
      return "Appel Jason 581-307-2678";
    },
  },
  {
    id: "call-luca",
    label: "Appeler Luca",
    icon: "\u{1F4DE}",
    color: "#22c55e",
    category: "leads",
    action: async () => {
      window.open("tel:5813075983");
      return "Appel Luca 581-307-5983";
    },
  },
  {
    id: "view-submissions",
    label: "Soumissions",
    icon: "\u{1F4CB}",
    color: "#6366f1",
    category: "leads",
    action: async () => {
      const res = await fetch("/api/submissions?limit=5", { cache: "no-store" });
      if (!res.ok) return "Aucune soumission";
      const data = await res.json();
      return `${data.submissions?.length || 0} soumissions recentes`;
    },
  },
  {
    id: "view-site",
    label: "Voir le site",
    icon: "\u{1F310}",
    color: "#0891b2",
    category: "leads",
    action: async () => {
      window.open("https://novusepoxy.ca", "_blank");
      return "Site ouvert";
    },
  },
  // AGENTS
  {
    id: "agent-status",
    label: "Status Agents",
    icon: "\u{1F916}",
    color: "#C5A45D",
    category: "agents",
    action: async () => {
      try {
        const res = await fetch("/api/agents", { cache: "no-store" });
        if (!res.ok) return "API agents non dispo";
        const data = await res.json();
        return `${data.config?.totalAgents || 0} agents, ${data.config?.runningCount || 0} actifs`;
      } catch {
        return "Erreur connexion agents";
      }
    },
  },
  {
    id: "hq-refresh",
    label: "Refresh Data",
    icon: "\u{1F504}",
    color: "#f59e0b",
    category: "agents",
    action: async () => {
      try {
        const res = await fetch("/api/hq/data", { cache: "no-store" });
        if (!res.ok) return "Erreur refresh";
        return "Data rafraichie";
      } catch {
        return "Erreur connexion";
      }
    },
  },
  {
    id: "calculator",
    label: "Calculateur",
    icon: "\u{1F4B0}",
    color: "#22c55e",
    category: "agents",
    action: async () => {
      window.open("https://novusepoxy.ca/calculateur", "_blank");
      return "Calculateur ouvert";
    },
  },
  {
    id: "quote-form",
    label: "Soumission",
    icon: "\u{1F4DD}",
    color: "#8b5cf6",
    category: "agents",
    action: async () => {
      window.open("https://novusepoxy.ca/soumission", "_blank");
      return "Formulaire ouvert";
    },
  },
  // COMMS
  {
    id: "email-info",
    label: "Email Info",
    icon: "\u{2709}",
    color: "#ef4444",
    category: "comms",
    action: async () => {
      window.open("mailto:info@novusepoxy.ca");
      return "Email ouvert";
    },
  },
  {
    id: "vercel-dash",
    label: "Vercel",
    icon: "\u{25B2}",
    color: "#ffffff",
    category: "comms",
    action: async () => {
      window.open("https://vercel.com/dashboard", "_blank");
      return "Vercel ouvert";
    },
  },
  {
    id: "github",
    label: "GitHub",
    icon: "\u{1F4BB}",
    color: "#a1a1aa",
    category: "comms",
    action: async () => {
      window.open("https://github.com/Novussurfaces/jason-novus", "_blank");
      return "GitHub ouvert";
    },
  },
  {
    id: "google-ads",
    label: "Google Ads",
    icon: "\u{1F4E2}",
    color: "#4285f4",
    category: "comms",
    action: async () => {
      window.open("https://ads.google.com", "_blank");
      return "Google Ads ouvert";
    },
  },
  // SYSTEM
  {
    id: "sys-status",
    label: "System Check",
    icon: "\u{2705}",
    color: "#22c55e",
    category: "system",
    action: async () => {
      try {
        const start = Date.now();
        const res = await fetch("/api/hq/data", { cache: "no-store" });
        const latency = Date.now() - start;
        if (!res.ok) return `API DOWN (${res.status})`;
        return `API OK — ${latency}ms`;
      } catch {
        return "SYSTEME HORS LIGNE";
      }
    },
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "\u{1F4CA}",
    color: "#f59e0b",
    category: "system",
    action: async () => {
      window.open("https://analytics.google.com", "_blank");
      return "Analytics ouvert";
    },
  },
  {
    id: "sci-michael",
    label: "SCI Michael",
    icon: "\u{1F3ED}",
    color: "#0891b2",
    category: "system",
    action: async () => {
      window.open("tel:5149077722");
      return "Appel Michael SCI 514-907-7722";
    },
  },
  {
    id: "email-michael",
    label: "Email SCI",
    icon: "\u{1F4E7}",
    color: "#6366f1",
    category: "system",
    action: async () => {
      window.open("mailto:michael@scicoatings.com");
      return "Email SCI ouvert";
    },
  },
];

const CATEGORIES = [
  { key: "leads", label: "LEADS & VENTES", color: "#C5A45D" },
  { key: "agents", label: "OUTILS", color: "#22c55e" },
  { key: "comms", label: "COMMUNICATIONS", color: "#6366f1" },
  { key: "system", label: "SYSTEME", color: "#ef4444" },
];

export default function QuickActions() {
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const execute = async (action: QuickAction) => {
    setFeedback((prev) => ({ ...prev, [action.id]: "..." }));
    try {
      const result = await action.action();
      setFeedback((prev) => ({ ...prev, [action.id]: result }));
      setTimeout(() => {
        setFeedback((prev) => {
          const next = { ...prev };
          delete next[action.id];
          return next;
        });
      }, 3000);
    } catch {
      setFeedback((prev) => ({ ...prev, [action.id]: "Erreur" }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {CATEGORIES.map((cat) => {
        const catActions = ACTIONS.filter((a) => a.category === cat.key);
        return (
          <div key={cat.key}>
            <h3
              className="text-xs font-bold tracking-[0.3em] mb-4 flex items-center gap-2"
              style={{ color: cat.color }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              {cat.label}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {catActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => execute(action)}
                  className="group relative bg-[#18181b] border border-[#27272a] rounded-xl p-4 hover:border-[#3f3f46] transition-all active:scale-95 text-left cursor-pointer"
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <div className="text-sm font-semibold text-white/90">
                    {action.label}
                  </div>
                  {feedback[action.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs text-[#C5A45D] truncate"
                    >
                      {feedback[action.id]}
                    </motion.div>
                  )}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${action.color}08, transparent 70%)`,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
