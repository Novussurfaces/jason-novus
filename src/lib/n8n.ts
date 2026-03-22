// ── n8n Webhook Integration ──
// Configure these URLs in .env.local

const N8N_BASE_URL = process.env.N8N_WEBHOOK_URL || "https://n8n.novussurfaces.com";

const WEBHOOKS = {
  quote: `${N8N_BASE_URL}/webhook/quote`,
  contact: `${N8N_BASE_URL}/webhook/contact`,
  calculator: `${N8N_BASE_URL}/webhook/calculator`,
  registration: `${N8N_BASE_URL}/webhook/registration`,
  lead: `${N8N_BASE_URL}/webhook/lead`,
} as const;

type WebhookType = keyof typeof WEBHOOKS;

export async function triggerN8nWebhook(
  type: WebhookType,
  data: Record<string, unknown>
): Promise<boolean> {
  const url = WEBHOOKS[type];

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Novus-Source": "website",
        "X-Novus-Webhook-Type": type,
      },
      body: JSON.stringify({
        ...data,
        _meta: {
          source: "novussurfaces.com",
          type,
          timestamp: new Date().toISOString(),
          version: "1.0",
        },
      }),
    });

    return response.ok;
  } catch {
    // n8n may be down — log but don't fail the user request
    console.error(`[n8n] Webhook ${type} failed:`, url);
    return false;
  }
}
