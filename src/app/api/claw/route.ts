import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// ─── OPENCLAW FLEET API ───────────────────────────────────────────
// GET  /api/claw        → List all claw agents + status + config
// POST /api/claw        → Deploy/stop/configure/update-skills/set-power

const SCRIPTS_DIR = path.join(process.cwd(), "scripts");
const CLAW_CONFIG_PATH = path.join(SCRIPTS_DIR, "openclaw-agents.json");
const CLAW_STATUS_PATH = path.join(SCRIPTS_DIR, "claw-status.json");

interface ClawStatus {
  id: string;
  state: "offline" | "deploying" | "running" | "error" | "stopped";
  lastActivity: string | null;
  leadsGenerated: number;
  costUsd: number;
  uptime: number;
  logs: string[];
  pid: number | null;
}

async function loadClawConfig() {
  try {
    const raw = await fs.readFile(CLAW_CONFIG_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { agents: [], meta: {}, power_modes: {} };
  }
}

async function loadClawStatus(): Promise<Record<string, ClawStatus>> {
  try {
    const raw = await fs.readFile(CLAW_STATUS_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveClawStatus(status: Record<string, ClawStatus>) {
  await fs.writeFile(CLAW_STATUS_PATH, JSON.stringify(status, null, 2), "utf-8");
}

async function saveClawConfig(config: Record<string, unknown>) {
  await fs.writeFile(CLAW_CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

// ─── GET: List all claw agents ──────────────────────────────────
export async function GET() {
  const config = await loadClawConfig();
  const statusMap = await loadClawStatus();

  const agents = (config.agents || []).map((agent: Record<string, unknown>) => {
    const id = agent.id as string;
    const status = statusMap[id] || {
      id,
      state: "offline",
      lastActivity: null,
      leadsGenerated: 0,
      costUsd: 0,
      uptime: 0,
      logs: [
        `[${new Date().toISOString().slice(11, 19)}] Agent ${(agent.name as string) || id} initialized`,
        `[${new Date().toISOString().slice(11, 19)}] Waiting for deployment...`,
      ],
      pid: null,
    };
    return { ...agent, status };
  });

  return NextResponse.json({
    agents,
    meta: config.meta || {},
    power_modes: config.power_modes || {},
    deployment: config.deployment || {},
    generatedAt: new Date().toISOString(),
  });
}

// ─── POST: Actions ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, agentId, data } = body as {
      action: string;
      agentId?: string;
      data?: Record<string, unknown>;
    };

    const config = await loadClawConfig();
    const statusMap = await loadClawStatus();

    // ── Deploy agent
    if (action === "deploy" && agentId) {
      const agent = (config.agents || []).find((a: Record<string, unknown>) => a.id === agentId);
      if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

      const now = new Date().toISOString();
      statusMap[agentId] = {
        ...(statusMap[agentId] || { id: agentId, leadsGenerated: 0, costUsd: 0, uptime: 0 }),
        id: agentId,
        state: "deploying",
        lastActivity: now,
        logs: [
          ...(statusMap[agentId]?.logs || []).slice(-8),
          `[${now.slice(11, 19)}] Deploying ${agent.name}...`,
          `[${now.slice(11, 19)}] Model: ${agent.model}`,
          `[${now.slice(11, 19)}] Port: ${agent.port}`,
        ],
        pid: null,
      };
      await saveClawStatus(statusMap);

      // Simulate deployment (in production: docker run on VPS)
      setTimeout(async () => {
        const s = await loadClawStatus();
        if (s[agentId]?.state === "deploying") {
          const t = new Date().toISOString();
          s[agentId] = {
            ...s[agentId],
            state: "running",
            lastActivity: t,
            logs: [
              ...s[agentId].logs.slice(-8),
              `[${t.slice(11, 19)}] Container started on port ${agent.port}`,
              `[${t.slice(11, 19)}] Agent ${agent.name} is LIVE`,
            ],
          };
          await saveClawStatus(s);
        }
      }, 2000);

      return NextResponse.json({ ok: true, message: `Deploying ${agent.name}...` });
    }

    // ── Stop agent
    if (action === "stop" && agentId) {
      const now = new Date().toISOString();
      statusMap[agentId] = {
        ...(statusMap[agentId] || { id: agentId, leadsGenerated: 0, costUsd: 0, uptime: 0 }),
        id: agentId,
        state: "stopped",
        lastActivity: now,
        logs: [
          ...(statusMap[agentId]?.logs || []).slice(-8),
          `[${now.slice(11, 19)}] Agent stopped by user`,
        ],
        pid: null,
      };
      await saveClawStatus(statusMap);
      return NextResponse.json({ ok: true, message: "Agent stopped" });
    }

    // ── Deploy ALL
    if (action === "deploy-all") {
      const now = new Date().toISOString();
      for (const agent of config.agents || []) {
        const id = (agent as Record<string, unknown>).id as string;
        const name = (agent as Record<string, unknown>).name as string;
        statusMap[id] = {
          ...(statusMap[id] || { id, leadsGenerated: 0, costUsd: 0, uptime: 0 }),
          id,
          state: "running",
          lastActivity: now,
          logs: [
            ...(statusMap[id]?.logs || []).slice(-5),
            `[${now.slice(11, 19)}] Fleet deploy — ${name} started`,
          ],
          pid: null,
        };
      }
      await saveClawStatus(statusMap);
      return NextResponse.json({ ok: true, message: "All agents deploying" });
    }

    // ── Stop ALL
    if (action === "stop-all") {
      const now = new Date().toISOString();
      for (const id of Object.keys(statusMap)) {
        statusMap[id] = {
          ...statusMap[id],
          state: "stopped",
          lastActivity: now,
          logs: [
            ...statusMap[id].logs.slice(-5),
            `[${now.slice(11, 19)}] Fleet shutdown — stopped`,
          ],
          pid: null,
        };
      }
      await saveClawStatus(statusMap);
      return NextResponse.json({ ok: true, message: "All agents stopped" });
    }

    // ── Update skills
    if (action === "update-skills" && agentId && data) {
      const agentIdx = (config.agents || []).findIndex(
        (a: Record<string, unknown>) => a.id === agentId
      );
      if (agentIdx === -1) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

      config.agents[agentIdx].skills = data.skills;
      await saveClawConfig(config);

      const now = new Date().toISOString();
      if (statusMap[agentId]) {
        statusMap[agentId].logs = [
          ...statusMap[agentId].logs.slice(-8),
          `[${now.slice(11, 19)}] Skills updated by user`,
        ];
        statusMap[agentId].lastActivity = now;
        await saveClawStatus(statusMap);
      }

      return NextResponse.json({ ok: true, message: "Skills updated" });
    }

    // ── Set model
    if (action === "set-model" && agentId && data?.model) {
      const agentIdx = (config.agents || []).findIndex(
        (a: Record<string, unknown>) => a.id === agentId
      );
      if (agentIdx === -1) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

      config.agents[agentIdx].model = data.model;
      await saveClawConfig(config);

      const now = new Date().toISOString();
      if (statusMap[agentId]) {
        statusMap[agentId].logs = [
          ...statusMap[agentId].logs.slice(-8),
          `[${now.slice(11, 19)}] Model changed to ${data.model}`,
        ];
        await saveClawStatus(statusMap);
      }

      return NextResponse.json({ ok: true, message: `Model set to ${data.model}` });
    }

    // ── Set power mode
    if (action === "set-power" && data?.mode) {
      const mode = config.power_modes?.[data.mode as string];
      if (!mode) return NextResponse.json({ error: "Unknown power mode" }, { status: 400 });

      // Update all agent models based on power mode
      const modelMap: Record<string, string> = {
        "claw-scout": mode.models.primary,
        "claw-hunter": mode.models.fast,
        "claw-permit": mode.models.reasoning,
        "claw-enrich": mode.models.primary,
        "claw-intel": mode.models.vision,
        "claw-omega": mode.models.code,
      };
      for (const agent of config.agents || []) {
        const id = (agent as Record<string, unknown>).id as string;
        if (modelMap[id]) {
          (agent as Record<string, unknown>).model = modelMap[id];
        }
      }
      await saveClawConfig(config);

      return NextResponse.json({ ok: true, message: `Power mode set to ${data.mode}` });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
