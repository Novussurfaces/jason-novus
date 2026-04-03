// ── Novus Command Center Integration ──
// Pushes leads + events from the website to the Command Center dashboard.
// Set COMMAND_CENTER_URL and COMMAND_CENTER_API_KEY in .env.local
// If not set, calls are skipped silently — forms still work.

type LeadType = "quote" | "contact" | "chat" | "calculator";

interface LeadPayload {
  type: LeadType;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  product?: string;
  area?: number;
  projectType?: string;
  locale?: string;
  source?: string;
  timestamp?: string;
  userAgent?: string;
  [key: string]: unknown;
}

export async function pushLeadToCommandCenter(
  payload: LeadPayload
): Promise<boolean> {
  const baseUrl = process.env.COMMAND_CENTER_URL;
  const apiKey = process.env.COMMAND_CENTER_API_KEY;

  if (!baseUrl || !apiKey) {
    console.warn("[command-center] URL or API key not set — skipping lead push");
    return false;
  }

  const url = `${baseUrl}/api/pipeline/ingest`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Novus-API-Key": apiKey,
      },
      body: JSON.stringify({
        ...payload,
        source: payload.source || "novusepoxy.ca",
        timestamp: payload.timestamp || new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error(`[command-center] Ingest returned ${response.status}`);
    }

    return response.ok;
  } catch (err) {
    // Command Center may be down — log but never fail the user request
    console.error("[command-center] Lead push failed:", err);
    return false;
  }
}
