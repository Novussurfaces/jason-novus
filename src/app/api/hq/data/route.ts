import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// HQ Dashboard Data API — reads real AGI engine data
// Works locally (reads files), falls back to VPS API in production

const SCRIPTS_DIR = path.join(process.cwd(), "scripts");
const PROJECT_DIR = process.cwd();

interface AgiMemory {
  total_runs: number;
  total_leads_found: number;
  total_emails_sent: number;
  total_bounces: number;
  dead_domains: string[];
  domain_results: Record<string, { sent: number; bounced: number; replied: number }>;
  type_results: Record<string, { found: number; sent: number; bounced: number; replied: number }>;
  campaign_results: Record<string, { runs: number; leads: number; emails: number; bounces: number }>;
  city_results: Record<string, { leads: number; quality_avg: number }>;
  scoring_weights: Record<string, number>;
  optimization_history: Array<{ timestamp: string; changes: string[] }>;
  last_run: string | null;
}

async function readAgiMemory(): Promise<AgiMemory | null> {
  try {
    const raw = await fs.readFile(path.join(SCRIPTS_DIR, "agi-memory.json"), "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function readCsvCount(filename: string): Promise<number> {
  try {
    const raw = await fs.readFile(path.join(PROJECT_DIR, filename), "utf-8");
    return raw.trim().split("\n").length - 1; // minus header
  } catch {
    return 0;
  }
}

async function readEmailLog(): Promise<{
  total: number;
  sent: number;
  bounced: number;
  skipped: number;
  recentEmails: Array<{ timestamp: string; email: string; company: string; status: string }>;
}> {
  try {
    const raw = await fs.readFile(path.join(SCRIPTS_DIR, "email-log.csv"), "utf-8");
    const lines = raw.trim().split("\n").slice(1); // skip header
    let sent = 0, bounced = 0, skipped = 0;
    const recent: Array<{ timestamp: string; email: string; company: string; status: string }> = [];

    for (const line of lines) {
      const parts = line.split(",");
      const status = (parts[6] || "").trim().toLowerCase();
      if (status === "sent") sent++;
      else if (status.includes("bounce") || status.includes("bad-mx")) bounced++;
      else if (status.includes("skip")) skipped++;

      recent.push({
        timestamp: parts[0] || "",
        email: parts[1] || "",
        company: parts[2] || "",
        status: status,
      });
    }

    return {
      total: lines.length,
      sent,
      bounced,
      skipped,
      recentEmails: recent.slice(-20).reverse(),
    };
  } catch {
    return { total: 0, sent: 0, bounced: 0, skipped: 0, recentEmails: [] };
  }
}

async function readLeadsByType(filename: string): Promise<Record<string, number>> {
  try {
    const raw = await fs.readFile(path.join(PROJECT_DIR, filename), "utf-8");
    const lines = raw.trim().split("\n").slice(1);
    const types: Record<string, number> = {};
    for (const line of lines) {
      const parts = line.split(",");
      // Find 'type' column — usually index 8 in our CSVs
      const type = (parts[8] || "unknown").trim().toLowerCase();
      types[type] = (types[type] || 0) + 1;
    }
    return types;
  } catch {
    return {};
  }
}

export async function GET() {
  const [memory, emailLog, agiLeads, huntedLeads, permitsLeads, megaPipeline] =
    await Promise.all([
      readAgiMemory(),
      readEmailLog(),
      readCsvCount("NOVUS-AGI-LEADS.csv"),
      readCsvCount("NOVUS-HUNTED-CLEAN.csv"),
      readCsvCount("NOVUS-PERMITS-CONTRACTORS.csv"),
      readCsvCount("NOVUS-MEGA-PIPELINE.csv"),
    ]);

  const leadsByType = await readLeadsByType("NOVUS-AGI-LEADS.csv");

  const bounceRate = emailLog.sent > 0
    ? ((emailLog.bounced / emailLog.sent) * 100).toFixed(1)
    : "0.0";

  const data = {
    // Core stats
    stats: {
      totalLeads: agiLeads + huntedLeads + permitsLeads,
      agiLeads,
      huntedLeads,
      permitsLeads,
      megaPipeline,
      emailsSent: emailLog.sent,
      emailsBounced: emailLog.bounced,
      emailsSkipped: emailLog.skipped,
      bounceRate: parseFloat(bounceRate),
      deliveryRate: parseFloat((100 - parseFloat(bounceRate)).toFixed(1)),
    },

    // AGI Engine intelligence
    engine: memory
      ? {
          runs: memory.total_runs,
          leadsFound: memory.total_leads_found,
          deadDomains: memory.dead_domains.length,
          knownDomains: Object.keys(memory.domain_results).length,
          scoringWeights: memory.scoring_weights,
          lastRun: memory.last_run,
          lastOptimization: memory.optimization_history.length > 0
            ? memory.optimization_history[memory.optimization_history.length - 1]
            : null,
        }
      : null,

    // Campaign performance
    campaigns: memory?.campaign_results || {},

    // City performance
    cities: memory?.city_results || {},

    // Lead distribution
    leadsByType,

    // Recent activity
    recentEmails: emailLog.recentEmails,

    // Installed tools
    tools: [
      { name: "Agent Orchestrator", version: "0.1.0", status: "ready" },
      { name: "Squad CLI", version: "0.9.1", status: "ready" },
      { name: "OpenClaw", version: "2026.3.23", status: "ready" },
      { name: "Spec-Kit", version: "0.4.1", status: "ready" },
      { name: "Marketing Skills", version: "36 skills", status: "active" },
      { name: "AGI Engine v2.0", version: "12 agents", status: "active" },
    ],

    // Timestamp
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-cache" },
  });
}
