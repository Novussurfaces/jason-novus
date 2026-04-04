// ── Instant Response System ──
// When a lead submits a form:
// 1. SMS to client: "Un spécialiste vous contacte dans les prochaines minutes"
// 2. Telegram alert to Jason with full lead details
// Both fire-and-forget — never block the user's form submission.

const TWILIO_SID = process.env.TWILIO_SID || "";
const TWILIO_AUTH = process.env.TWILIO_AUTH || "";
const TWILIO_PHONE = process.env.TWILIO_PHONE || "";
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || "";

interface LeadInfo {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  product?: string;
  area?: string | number;
  projectType?: string;
  type: "quote" | "contact" | "calculator";
}

// Send instant SMS to the client
async function sendClientSMS(phone: string, name: string): Promise<void> {
  if (!TWILIO_SID || !TWILIO_AUTH || !TWILIO_PHONE || !phone) return;

  const cleanPhone = phone.replace(/[^+\d]/g, "");
  if (cleanPhone.length < 10) return;

  const formattedPhone = cleanPhone.startsWith("+") ? cleanPhone : `+1${cleanPhone}`;

  try {
    const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString("base64");
    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: TWILIO_PHONE,
          To: formattedPhone,
          Body: `Bonjour ${name}! Merci pour votre intérêt envers Novus Epoxy. Un spécialiste vous contactera dans les prochaines minutes. En attendant, explorez nos réalisations: novusepoxy.ca — Jason, 581-307-2678`,
        }),
      }
    );
  } catch {
    // Never fail the form submission
  }
}

// Send Telegram alert to Jason with lead details
async function alertJason(lead: LeadInfo): Promise<void> {
  if (!TG_TOKEN || !TG_CHAT) return;

  const typeEmoji = lead.type === "quote" ? "💰" : lead.type === "calculator" ? "🧮" : "📩";
  const lines = [
    `${typeEmoji} NOUVEAU LEAD — ${lead.type.toUpperCase()}`,
    ``,
    `👤 ${lead.name}`,
    `📧 ${lead.email}`,
    lead.phone ? `📱 ${lead.phone}` : null,
    lead.product ? `📦 ${lead.product}` : null,
    lead.area ? `📐 ${lead.area} pi²` : null,
    lead.projectType ? `🏗 ${lead.projectType}` : null,
    lead.message ? `💬 ${lead.message.slice(0, 200)}` : null,
    ``,
    `⚡ APPELLE MAINTENANT: ${lead.phone || "pas de tel"}`,
  ].filter(Boolean);

  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TG_CHAT,
        text: lines.join("\n"),
        parse_mode: "HTML",
      }),
    });
  } catch {
    // Never fail the form submission
  }
}

export async function triggerInstantResponse(lead: LeadInfo): Promise<void> {
  // Fire both in parallel, never await blocking
  Promise.all([
    lead.phone ? sendClientSMS(lead.phone, lead.name) : Promise.resolve(),
    alertJason(lead),
  ]).catch(() => {});
}
