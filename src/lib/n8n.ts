// ── n8n Webhook Integration ──
// Set N8N_WEBHOOK_URL in .env.local (e.g. http://100.83.113.25)
// If not set, webhooks are skipped silently — forms still work.
// Sends to both the Novus webhook handler AND n8n cloud for redundancy.

type WebhookType = "quote" | "contact" | "calculator" | "registration" | "lead";

async function sendWebhook(
  url: string,
  label: string,
  data: Record<string, unknown>
): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Novus-Source": "website",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.error(`[webhook] ${label} returned ${response.status}`);
    }
    return response.ok;
  } catch (err) {
    console.error(`[webhook] ${label} failed:`, err);
    return false;
  }
}

export async function triggerN8nWebhook(
  type: WebhookType,
  data: Record<string, unknown>
): Promise<boolean> {
  const payload = {
    ...data,
    source: data.source || "novusepoxy.ca",
    project_type: data.projectType || data.project_type || "",
    timestamp: data.timestamp || new Date().toISOString(),
  };

  const results: boolean[] = [];

  // Primary: Novus webhook handler on VPS (Telegram alerts + dashboard)
  const novusUrl = process.env.NOVUS_WEBHOOK_URL;
  if (novusUrl) {
    results.push(await sendWebhook(
      `${novusUrl}/webhook/novus-lead-v1`,
      "novus-webhook",
      payload
    ));
  }

  // Secondary: n8n cloud (AI scoring + email responses)
  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  if (n8nUrl) {
    results.push(await sendWebhook(
      `${n8nUrl}/webhook/novus-lead-v2`,
      "n8n-cloud",
      payload
    ));
  }

  if (!novusUrl && !n8nUrl) {
    console.warn(`[webhook] No webhook URLs configured — skipping ${type}`);
    return false;
  }

  return results.some(Boolean);
}
