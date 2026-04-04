import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";

// ─── AGENT CONTROL API ─────────────────────────────────────────────
// GET  /api/agents         → List all agents + status
// POST /api/agents         → Run an agent { action: "run"|"stop"|"test", agentId: "atlas" }

const SCRIPTS_DIR = path.join(process.cwd(), "scripts");
const REGISTRY_PATH = path.join(SCRIPTS_DIR, "agent-registry.json");
const AGENT_STATUS_PATH = path.join(SCRIPTS_DIR, "agent-status.json");

interface AgentDef {
  id: string;
  name: string;
  role: string;
  description: string;
  script: string;
  command: string;
  schedule: string;
  ai_model: string | null;
  task_type: string | null;
  status: string;
  outputs: string[];
  metrics: string[];
}

interface AgentStatus {
  id: string;
  state: "idle" | "running" | "success" | "error";
  lastRun: string | null;
  lastDuration: number | null;
  lastResult: string | null;
  runsTotal: number;
  errorsTotal: number;
  pid: number | null;
}

async function loadRegistry(): Promise<{ agents: AgentDef[]; config: Record<string, unknown> }> {
  try {
    const raw = await fs.readFile(REGISTRY_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { agents: [], config: {} };
  }
}

async function loadStatus(): Promise<Record<string, AgentStatus>> {
  try {
    const raw = await fs.readFile(AGENT_STATUS_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveStatus(status: Record<string, AgentStatus>): Promise<void> {
  await fs.writeFile(AGENT_STATUS_PATH, JSON.stringify(status, null, 2), "utf-8");
}

async function getAgentOutputStats(agent: AgentDef): Promise<Record<string, number>> {
  const stats: Record<string, number> = {};
  for (const output of agent.outputs) {
    try {
      const filePath = output.includes("/")
        ? path.join(process.cwd(), output)
        : path.join(output.endsWith(".json") ? SCRIPTS_DIR : process.cwd(), output);
      const raw = await fs.readFile(filePath, "utf-8");
      const lines = raw.trim().split("\n");
      stats[output] = output.endsWith(".json") ? 1 : Math.max(0, lines.length - 1);
    } catch {
      stats[output] = 0;
    }
  }
  return stats;
}

// ─── GET: List all agents ──────────────────────────────────────────
export async function GET() {
  const registry = await loadRegistry();
  const statusMap = await loadStatus();

  const agents = await Promise.all(
    registry.agents.map(async (agent) => {
      const status = statusMap[agent.id] || {
        id: agent.id,
        state: "idle",
        lastRun: null,
        lastDuration: null,
        lastResult: null,
        runsTotal: 0,
        errorsTotal: 0,
        pid: null,
      };
      const outputStats = await getAgentOutputStats(agent);

      return {
        ...agent,
        runtime: status,
        outputStats,
      };
    })
  );

  return NextResponse.json({
    agents,
    config: {
      totalAgents: agents.length,
      runningCount: agents.filter((a) => a.runtime.state === "running").length,
      readyCount: agents.filter((a) => a.status === "ready").length,
    },
    generatedAt: new Date().toISOString(),
  });
}

// ─── POST: Run/Stop/Test agent ─────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, agentId } = body as { action: string; agentId: string };

    if (!action || !agentId) {
      return NextResponse.json({ error: "Missing action or agentId" }, { status: 400 });
    }

    const registry = await loadRegistry();
    const agent = registry.agents.find((a) => a.id === agentId);
    if (!agent) {
      return NextResponse.json({ error: `Agent '${agentId}' not found` }, { status: 404 });
    }

    const statusMap = await loadStatus();

    if (action === "run" || action === "test") {
      const isDryRun = action === "test";
      const command = isDryRun
        ? agent.command.replace(/--batch \d+/, "--batch 1") + " --dry-run"
        : agent.command;

      // Update status to running
      statusMap[agentId] = {
        ...(statusMap[agentId] || { id: agentId, runsTotal: 0, errorsTotal: 0 }),
        id: agentId,
        state: "running",
        lastRun: new Date().toISOString(),
        lastDuration: null,
        lastResult: null,
        pid: null,
      };
      await saveStatus(statusMap);

      const startTime = Date.now();

      // Execute in background
      exec(
        `cd "${SCRIPTS_DIR}" && ${command}`,
        { timeout: 300000, maxBuffer: 10 * 1024 * 1024 },
        async (error, stdout, stderr) => {
          const duration = Math.round((Date.now() - startTime) / 1000);
          const currentStatus = await loadStatus();

          if (error) {
            currentStatus[agentId] = {
              ...currentStatus[agentId],
              state: "error",
              lastDuration: duration,
              lastResult: (stderr || error.message).slice(0, 500),
              errorsTotal: (currentStatus[agentId]?.errorsTotal || 0) + 1,
              pid: null,
            };
          } else {
            currentStatus[agentId] = {
              ...currentStatus[agentId],
              state: "success",
              lastDuration: duration,
              lastResult: stdout.slice(-500),
              runsTotal: (currentStatus[agentId]?.runsTotal || 0) + 1,
              pid: null,
            };
          }
          await saveStatus(currentStatus);
        }
      );

      return NextResponse.json({
        ok: true,
        message: `Agent ${agent.name} ${isDryRun ? "test" : "run"} started`,
        agentId,
        command,
      });
    }

    if (action === "stop") {
      if (statusMap[agentId]?.pid) {
        try {
          process.kill(statusMap[agentId].pid!);
        } catch {
          /* already dead */
        }
      }
      statusMap[agentId] = {
        ...(statusMap[agentId] || { id: agentId, runsTotal: 0, errorsTotal: 0 }),
        id: agentId,
        state: "idle",
        pid: null,
        lastResult: "Stopped by user",
      };
      await saveStatus(statusMap);
      return NextResponse.json({ ok: true, message: `Agent ${agent.name} stopped` });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
