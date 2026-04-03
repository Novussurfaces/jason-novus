import { NextResponse } from "next/server";

// Telegram config — Jason DM only (NEVER Luca group -5180507841)
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8715863191:AAEXrjNoFTQJCq214_Hvmh_zD2mSk9x6Af8";
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || "7562421258";

// Interest classification
const POSITIVE = ["oui", "yes", "interesse", "soumission", "prix", "combien", "quand", "disponible", "appeler", "ok", "parfait", "garage", "epoxy", "devis", "rdv", "info"];
const NEGATIVE = ["non", "stop", "arret", "desabonner", "unsubscribe", "remove", "pas interesse", "spam"];
const QUESTION = ["combien", "prix", "cout", "cher", "quand", "delai", "comment", "garantie", "couleur", "region", "ou "];

function classifyReply(body: string): { category: string; confidence: number } {
  const text = body.toLowerCase().trim();

  const negHits = NEGATIVE.filter(kw => text.includes(kw)).length;
  if (negHits > 0) return { category: "STOP", confidence: Math.min(0.5 + negHits * 0.2, 1) };

  const posHits = POSITIVE.filter(kw => text.includes(kw)).length;
  const qHits = QUESTION.filter(kw => text.includes(kw)).length;

  if (posHits > 0 && qHits > 0) return { category: "HOT_QUESTION", confidence: Math.min(0.5 + (posHits + qHits) * 0.15, 1) };
  if (posHits > 0) return { category: "INTERESTED", confidence: Math.min(0.5 + posHits * 0.2, 1) };
  if (qHits > 0) return { category: "QUESTION", confidence: Math.min(0.4 + qHits * 0.2, 1) };

  if (["oui", "yes", "ok", "1", "ouais"].includes(text)) return { category: "INTERESTED", confidence: 0.9 };

  return { category: "UNKNOWN", confidence: 0.3 };
}

async function sendTelegram(message: string): Promise<boolean> {
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT, text: message, parse_mode: "HTML" }),
    });
    return true;
  } catch {
    return false;
  }
}

// Twilio sends POST with form-urlencoded data
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let from = "";
    let body = "";
    let to = "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      from = (formData.get("From") as string) || "";
      body = (formData.get("Body") as string) || "";
      to = (formData.get("To") as string) || "";
    } else {
      const json = await request.json();
      from = json.From || json.from || "";
      body = json.Body || json.body || "";
      to = json.To || json.to || "";
    }

    if (!from || !body) {
      return new Response(
        '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        { status: 200, headers: { "Content-Type": "text/xml" } }
      );
    }

    // Classify the reply
    const { category, confidence } = classifyReply(body);

    const emoji: Record<string, string> = {
      INTERESTED: "\u{1F525}", HOT_QUESTION: "\u{2753}\u{1F525}",
      QUESTION: "\u{2753}", STOP: "\u{1F6D1}", UNKNOWN: "\u{1F4E9}",
    };

    const priority: Record<string, string> = {
      INTERESTED: "HAUTE", HOT_QUESTION: "HAUTE",
      QUESTION: "MOYENNE", STOP: "BASSE", UNKNOWN: "BASSE",
    };

    // Build Telegram alert
    const lines = [
      `${emoji[category] || "\u{1F4E9}"} <b>SMS REPLY — ${category}</b>`,
      ``,
      `<b>De:</b> ${from}`,
      `<b>Message:</b> ${body.slice(0, 200)}`,
      `<b>Priorite:</b> ${priority[category] || "BASSE"}`,
      `<b>Confiance:</b> ${Math.round(confidence * 100)}%`,
      `<b>Recu:</b> ${new Date().toISOString().slice(0, 19)}`,
    ];

    if (category === "INTERESTED" || category === "HOT_QUESTION") {
      lines.push("", "\u{1F449} <b>ACTION: Rappeler ce lead ASAP!</b>", `\u{1F4DE} Tel: ${from}`);
    } else if (category === "STOP") {
      lines.push("", "\u{26A0}\u{FE0F} Ne plus contacter ce numero.");
    } else if (category === "QUESTION") {
      lines.push("", "\u{1F4A1} Repondre a la question pour closer.");
    }

    // Send Telegram alert (non-blocking)
    sendTelegram(lines.join("\n"));

    // Forward to n8n/webhook if configured
    const novusUrl = process.env.NOVUS_WEBHOOK_URL;
    if (novusUrl) {
      fetch(`${novusUrl}/webhook/sms-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, body, category, confidence, timestamp: new Date().toISOString() }),
      }).catch(() => {});
    }

    // Return TwiML empty response (no auto-reply for now)
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { status: 200, headers: { "Content-Type": "text/xml" } }
    );
  } catch {
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { status: 200, headers: { "Content-Type": "text/xml" } }
    );
  }
}

// Twilio sometimes sends GET for status callbacks
export async function GET() {
  return NextResponse.json({ status: "ok", service: "novus-sms-incoming" });
}
