import { NextResponse } from "next/server";

const ARIA_TOKEN = process.env.ARIA_BOT_TOKEN || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

const SYSTEM_PROMPT = `Tu es Aria, assistante IA de Novus Epoxy sur Telegram. Tu parles français québécois naturel et chaleureux.

Tu connais les 13 systèmes SCI Coatings:
- SCI-Flocons ($3-5/pi²) — LE PLUS POPULAIRE. Garages, showrooms, sous-sols.
- SCI-Polyuréa Flocons ($5-8/pi²) — Installation en 1 JOUR, garages résidentiels.
- SCI-100 ($3-5/pi²) — Industriel/commercial, zéro COV.
- SCI-Métallique ($6-10/pi²) — Effets 3D luxueux, haut de gamme.
- SCI-Broadcast ($3-5/pi²) — Antidérapant, cuisines, zones de chargement.
- SCI-Membrane ($5-8/pi²) — Imperméabilisation, stationnements, balcons.
- SCI-Quartz Broadcast ($5-8/pi²) — Fort trafic, hôpitaux, écoles.
- SCI-Polyuréthane Cimentaire ($8-12/pi²) — Alimentaire, brasseries, -40°C à +120°C.
- SCI-Quartz Truelle ($5-8/pi²) — Pharmaceutique, industriel lourd.
- SCI-Slurry ($7-10/pi²) — Résistance chimique extrême.
- SCI-Mortier Truelle ($7-10/pi²) — Impacts maximaux, fonderies.
- SCI-OP ($5-8/pi²) — Rénovation sans démolition.
- SCI-COVE Quartz ($5-8/pi²) — Transitions mur-plancher, sanitaire.

Rabais volume: 1000+ pi² = -5%, 2500+ = -10%, 5000+ = -15%, 10000+ = -20%.
PROMO AVRIL: 20% de rabais sur tous les projets!

Pour soumission: novusepoxy.ca ou 581-307-2678 (Jason).
Pour questions techniques: michael@scicoatings.com

Sois concis, pro, chaleureux. Maximum 3-4 phrases. Pose des questions pour qualifier le client (type projet, superficie, ville).`;

// Keyword fallback when AI is unavailable
function getSmartResponse(text: string): string {
  const msg = text.toLowerCase();
  if (msg.includes("prix") || msg.includes("combien") || msg.includes("cout") || msg.includes("coût"))
    return "Nos prix varient de $3/pi² (SCI-Flocons) à $12/pi² (Polyuréthane Cimentaire). PROMO AVRIL: 20% de rabais! Calculateur: novusepoxy.ca/calculateur ou appelez Jason: 581-307-2678";
  if (msg.includes("garage"))
    return "Pour un garage, je recommande le SCI-Flocons ($3-5/pi²) — le plus populaire! PROMO AVRIL: 20% off! Soumission gratuite: 581-307-2678";
  if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("allo") || msg.includes("/start"))
    return "Bonjour! Je suis Aria, assistante de Novus Epoxy. Comment puis-je vous aider? PROMO AVRIL: 20% de rabais!";
  return "Merci pour votre message! PROMO AVRIL: 20% de rabais! Soumission gratuite: 581-307-2678 ou novusepoxy.ca";
}

async function getAIResponse(userMessage: string): Promise<string | null> {
  if (!OPENROUTER_API_KEY) return null;
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://novusepoxy.ca",
        "X-Title": "Aria - Novus Epoxy Telegram",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

async function sendTelegramMessage(chatId: number, text: string): Promise<boolean> {
  if (!ARIA_TOKEN) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${ARIA_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const update = await request.json();
    const message = update.message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text;
    const firstName = message.from?.first_name || "Client";

    // AI response first, keyword fallback if unavailable
    const aiResponse = await getAIResponse(text);
    const response = aiResponse || getSmartResponse(text);
    await sendTelegramMessage(chatId, response);

    // Forward to Jason DM for visibility (non-blocking)
    const JASON_CHAT = process.env.TELEGRAM_CHAT_ID || "";
    const BRIDGE_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
    if (JASON_CHAT && BRIDGE_TOKEN) {
      fetch(`https://api.telegram.org/bot${BRIDGE_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: JASON_CHAT,
          text: `🤖 Aria a repondu:\n\nDe: ${firstName}\nMsg: ${text.slice(0, 200)}\nReponse: ${response.slice(0, 200)}${aiResponse ? "\n\n✨ AI" : "\n\n📋 Fallback"}`,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", bot: "novus-admin" });
}
