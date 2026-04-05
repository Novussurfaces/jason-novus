"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface TerminalLine {
  type: "input" | "output" | "error" | "system";
  text: string;
  timestamp: string;
}

const COMMANDS: Record<string, { desc: string; handler: (args: string[]) => Promise<string> }> = {
  help: {
    desc: "Afficher les commandes disponibles",
    handler: async () => {
      const lines = Object.entries(COMMANDS)
        .map(([cmd, { desc }]) => `  ${cmd.padEnd(16)} ${desc}`)
        .join("\n");
      return `NOVUS HQ TERMINAL v2.0\n${"─".repeat(40)}\n${lines}`;
    },
  },
  status: {
    desc: "Status du systeme",
    handler: async () => {
      try {
        const res = await fetch("/api/hq/data", { cache: "no-store" });
        if (!res.ok) return "ERREUR: API non disponible";
        const data = await res.json();
        return [
          "NOVUS SYSTEM STATUS",
          "─".repeat(30),
          `Leads totaux:    ${data.stats?.totalLeads || 0}`,
          `Emails envoyes:  ${data.stats?.emailsSent || 0}`,
          `Taux livraison:  ${data.stats?.deliveryRate || 0}%`,
          `AGI runs:        ${data.engine?.runs || 0}`,
          `Derniere update: ${data.generatedAt || "N/A"}`,
        ].join("\n");
      } catch {
        return "ERREUR: Impossible de contacter l'API";
      }
    },
  },
  agents: {
    desc: "Lister les agents",
    handler: async () => {
      try {
        const res = await fetch("/api/agents", { cache: "no-store" });
        if (!res.ok) return "ERREUR: API agents non disponible";
        const data = await res.json();
        const agents = data.agents || [];
        if (agents.length === 0) return "Aucun agent configure.";
        const lines = agents.map((a: { name: string; role: string; status: string }) =>
          `  ${a.name.padEnd(14)} ${a.role.padEnd(20)} [${a.status}]`
        );
        return [`AGENTS (${agents.length})`, "─".repeat(40), ...lines].join("\n");
      } catch {
        return "ERREUR: Impossible de lister les agents";
      }
    },
  },
  leads: {
    desc: "Stats leads rapides",
    handler: async () => {
      try {
        const res = await fetch("/api/hq/data", { cache: "no-store" });
        if (!res.ok) return "ERREUR: API non disponible";
        const data = await res.json();
        const types = data.leadsByType || {};
        const lines = Object.entries(types).map(
          ([type, count]) => `  ${type.padEnd(16)} ${count}`
        );
        return [`LEADS PAR TYPE`, "─".repeat(30), ...lines, "", `Total: ${data.stats?.totalLeads || 0}`].join("\n");
      } catch {
        return "ERREUR: Impossible de charger les leads";
      }
    },
  },
  submissions: {
    desc: "Dernieres soumissions du site",
    handler: async () => {
      try {
        const res = await fetch("/api/submissions?limit=10", { cache: "no-store" });
        if (!res.ok) return "Aucune soumission ou API non disponible.";
        const data = await res.json();
        const subs = data.submissions || [];
        if (subs.length === 0) return "Aucune soumission recente.";
        const lines = subs.map((s: { name: string; type: string; createdAt: string }) =>
          `  ${new Date(s.createdAt).toLocaleString("fr-CA").padEnd(20)} ${s.name.padEnd(16)} [${s.type}]`
        );
        return [`SOUMISSIONS RECENTES`, "─".repeat(50), ...lines].join("\n");
      } catch {
        return "ERREUR: Impossible de charger les soumissions";
      }
    },
  },
  clear: {
    desc: "Effacer le terminal",
    handler: async () => "__CLEAR__",
  },
  call: {
    desc: "Afficher les numeros",
    handler: async () => {
      return [
        "CONTACTS RAPIDES",
        "─".repeat(30),
        "  Jason (Fondateur):  581-307-2678",
        "  Luca (Ventes):      581-307-5983",
        "  Michael (SCI):      514-907-7722",
        "  Email:              info@novusepoxy.ca",
      ].join("\n");
    },
  },
  deploy: {
    desc: "Info deploiement Vercel",
    handler: async () => {
      return [
        "DEPLOIEMENT",
        "─".repeat(30),
        "  Site:     novusepoxy.ca",
        "  Host:     Vercel",
        "  Repo:     github.com/Novussurfaces/jason-novus",
        "  Branch:   main (auto-deploy)",
        "  Status:   git push origin main → deploy auto",
      ].join("\n");
    },
  },
};

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: "system",
      text: "NOVUS HQ TERMINAL v2.0 — Tape 'help' pour les commandes",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd || isProcessing) return;

    setInput("");
    setLines((prev) => [
      ...prev,
      { type: "input", text: `$ ${cmd}`, timestamp: new Date().toISOString() },
    ]);

    setIsProcessing(true);
    const parts = cmd.toLowerCase().split(" ");
    const command = COMMANDS[parts[0]];

    if (command) {
      try {
        const result = await command.handler(parts.slice(1));
        if (result === "__CLEAR__") {
          setLines([
            {
              type: "system",
              text: "Terminal efface.",
              timestamp: new Date().toISOString(),
            },
          ]);
        } else {
          setLines((prev) => [
            ...prev,
            { type: "output", text: result, timestamp: new Date().toISOString() },
          ]);
        }
      } catch {
        setLines((prev) => [
          ...prev,
          { type: "error", text: "Erreur d'execution", timestamp: new Date().toISOString() },
        ]);
      }
    } else {
      setLines((prev) => [
        ...prev,
        {
          type: "error",
          text: `Commande inconnue: ${parts[0]}. Tape 'help' pour la liste.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
    setIsProcessing(false);
  };

  const lineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input": return "text-[#C5A45D]";
      case "output": return "text-green-400";
      case "error": return "text-red-400";
      case "system": return "text-[#71717a]";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-black/80 border border-[#27272a] rounded-xl overflow-hidden font-mono text-sm"
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#18181b] border-b border-[#27272a]">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-[#71717a] tracking-wider">NOVUS TERMINAL</span>
      </div>

      {/* Output area */}
      <div
        className="p-4 h-[400px] md:h-[500px] overflow-y-auto scrollbar-thin"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} className={`${lineColor(line.type)} whitespace-pre-wrap mb-1 leading-relaxed`}>
            {line.text}
          </div>
        ))}
        {isProcessing && (
          <div className="text-[#C5A45D] animate-pulse">Processing...</div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-[#27272a] flex">
        <span className="px-3 py-3 text-[#C5A45D] font-bold">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isProcessing}
          placeholder="Tape une commande..."
          className="flex-1 bg-transparent text-green-400 py-3 pr-4 outline-none placeholder:text-[#3f3f46]"
          autoFocus
        />
      </form>
    </motion.div>
  );
}
