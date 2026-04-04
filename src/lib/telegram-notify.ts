// ── Telegram Notifications for Quote Form ──
// Sends detailed lead alerts to:
// 1. Jason's bridge bot (TELEGRAM_BOT_TOKEN → chat TELEGRAM_CHAT_ID)
// 2. Aria bot (ARIA_BOT_TOKEN → same chat) for automated follow-up
//
// CRITICAL: Never send to Luca group. Jason DM only (7562421258).
// CRITICAL: Never hardcode tokens — always use process.env.

interface QuotePayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  surfaceArea?: string;
  product?: string;
  message?: string;
  locale?: string;
  timestamp?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildLeadMessage(data: QuotePayload): string {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const phone = data.phone ? escapeHtml(data.phone) : null;
  const cleanPhone = data.phone?.replace(/[^+\d]/g, "") || "";

  const lines: string[] = [
    `<b>NOUVELLE SOUMISSION</b>`,
    ``,
    `<b>Client:</b> ${name}`,
    `<b>Courriel:</b> <a href="mailto:${email}">${email}</a>`,
  ];

  if (phone && cleanPhone) {
    const formattedTel = cleanPhone.startsWith("+") ? cleanPhone : `+1${cleanPhone}`;
    lines.push(`<b>Tel:</b> <a href="tel:${formattedTel}">${phone}</a>`);
  }

  if (data.company) {
    lines.push(`<b>Entreprise:</b> ${escapeHtml(data.company)}`);
  }

  lines.push(``);

  if (data.projectType) {
    lines.push(`<b>Type de projet:</b> ${escapeHtml(data.projectType)}`);
  }
  if (data.surfaceArea) {
    lines.push(`<b>Surface:</b> ${escapeHtml(data.surfaceArea)} pi2`);
  }
  if (data.product) {
    lines.push(`<b>Produit:</b> ${escapeHtml(data.product)}`);
  }

  if (data.message) {
    const truncated = data.message.length > 300
      ? data.message.slice(0, 300) + "..."
      : data.message;
    lines.push(``);
    lines.push(`<b>Message:</b>`);
    lines.push(escapeHtml(truncated));
  }

  lines.push(``);

  if (phone && cleanPhone) {
    const formattedTel = cleanPhone.startsWith("+") ? cleanPhone : `+1${cleanPhone}`;
    lines.push(`<b>APPELLE:</b> <a href="tel:${formattedTel}">${phone}</a>`);
  }
  lines.push(`<b>EMAIL:</b> <a href="mailto:${email}">${email}</a>`);

  const ts = data.timestamp || new Date().toISOString();
  lines.push(``);
  lines.push(`<i>${ts}</i>`);

  return lines.join("\n");
}

async function sendTelegram(
  token: string,
  chatId: string,
  text: string,
  label: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[telegram-notify] ${label} returned ${response.status}: ${body}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`[telegram-notify] ${label} failed:`, err);
    return false;
  }
}

/**
 * Send quote notification to Jason via bridge bot.
 * Uses TELEGRAM_BOT_TOKEN (8715863191) -> TELEGRAM_CHAT_ID (7562421258).
 * NEVER sends to Luca group.
 */
export async function notifyJasonTelegram(data: QuotePayload): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("[telegram-notify] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping Jason alert");
    return false;
  }

  const message = buildLeadMessage(data);
  return sendTelegram(token, chatId, message, "jason-bridge-bot");
}

/**
 * Forward quote to Aria bot for automated follow-up.
 * Uses ARIA_BOT_TOKEN (8652131717) -> same Jason chat (TELEGRAM_CHAT_ID).
 * Aria receives a slightly different message so she can act on it.
 */
export async function notifyAriaTelegram(data: QuotePayload): Promise<boolean> {
  const token = process.env.ARIA_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("[telegram-notify] ARIA_BOT_TOKEN not set — skipping Aria forward");
    return false;
  }

  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);

  const ariaLines: string[] = [
    `<b>[ARIA] Nouveau lead a suivre</b>`,
    ``,
    `<b>Nom:</b> ${name}`,
    `<b>Email:</b> ${email}`,
  ];

  if (data.phone) {
    ariaLines.push(`<b>Tel:</b> ${escapeHtml(data.phone)}`);
  }
  if (data.projectType) {
    ariaLines.push(`<b>Projet:</b> ${escapeHtml(data.projectType)}`);
  }
  if (data.product) {
    ariaLines.push(`<b>Produit:</b> ${escapeHtml(data.product)}`);
  }
  if (data.message) {
    ariaLines.push(`<b>Msg:</b> ${escapeHtml(data.message.slice(0, 200))}`);
  }

  ariaLines.push(``);
  ariaLines.push(`<i>Follow up ASAP — lead is warm</i>`);

  const message = ariaLines.join("\n");
  return sendTelegram(token, chatId, message, "aria-bot");
}

/**
 * Fire both Telegram notifications in parallel.
 * Never blocks or throws — form submission always succeeds.
 */
export async function notifyAllTelegram(data: QuotePayload): Promise<void> {
  await Promise.allSettled([
    notifyJasonTelegram(data),
    notifyAriaTelegram(data),
  ]);
}
