import { NextResponse } from "next/server";

const ARIA_TOKEN = process.env.ARIA_BOT_TOKEN || "8652131717:AAFC93pdaastVdW-OQcRRo_kWbvOElkHlD4";

// Nova system prompt — same as chat route for consistency
const SYSTEM_PROMPT = `Tu es Nova, assistante admin de Novus Epoxy. Tu reponds aux messages des clients et de l'equipe sur Telegram.
Tu connais les 13 systemes SCI Coatings. Prix: $3-12/pi² selon le systeme.
Systemes populaires: SCI-Flocons (garage $3-5/pi²), SCI-Metallique (luxe $6-10/pi²), SCI-Polyurea (1 jour $5-8/pi²).
Rabais volume: 1000+ pi² = -5%, 2500+ pi² = -10%, 5000+ pi² = -15%.
PROMO AVRIL: 20% de rabais sur tous les projets!
Pour soumission: novusepoxy.ca ou 581-307-2678 (Jason).
Sois concis, pro, chaleureux. Max 3-4 phrases.`;

// Smart response based on message content
function getSmartResponse(text: string): string {
  const msg = text.toLowerCase();

  if (msg.includes("prix") || msg.includes("combien") || msg.includes("cout") || msg.includes("co\u00fbt")) {
    return "Nos prix varient de $3/pi\u00b2 (SCI-Flocons) \u00e0 $12/pi\u00b2 (Polyur\u00e9thane Cimentaire). PROMO AVRIL: 20% de rabais! Utilisez notre calculateur: novusepoxy.ca/calculateur ou appelez Jason au 581-307-2678 pour une soumission gratuite!";
  }

  if (msg.includes("garage")) {
    return "Pour un garage, je recommande le SCI-Flocons ($3-5/pi\u00b2) \u2014 le plus populaire! Installation en 1 jour avec SCI-Polyu\u00e9a. PROMO AVRIL: 20% de rabais! Quelle est la superficie? Soumission gratuite: 581-307-2678";
  }

  if (msg.includes("commercial") || msg.includes("industriel") || msg.includes("entrepot") || msg.includes("entrep\u00f4t")) {
    return "Pour le commercial/industriel: SCI-100 (\u00e9poxy 100% solide), SCI-Quartz (fort trafic), SCI-Mortier (impacts lourds). PROMO AVRIL: 20% off! Appelez Jason: 581-307-2678 pour une soumission gratuite.";
  }

  if (msg.includes("soumission") || msg.includes("devis") || msg.includes("quote")) {
    return "Soumission gratuite! Appelez Jason au 581-307-2678 ou remplissez le formulaire: novusepoxy.ca. On se d\u00e9place partout au Qu\u00e9bec. PROMO AVRIL: 20% de rabais!";
  }

  if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("allo") || msg.includes("hi") || msg.includes("hello")) {
    return "Bonjour! Bienvenue chez Novus Epoxy \u2014 sp\u00e9cialiste en rev\u00eatements \u00e9poxy au Qu\u00e9bec. Comment puis-je vous aider? PROMO AVRIL: 20% de rabais sur tous les projets!";
  }

  if (msg.includes("partenaire") || msg.includes("partner") || msg.includes("b2b") || msg.includes("commission")) {
    return "Notre programme partenaire: 10% commission referral + prix B2B -15%. Parfait pour entrepreneurs, gestionnaires immobiliers, contracteurs. PROMO AVRIL: 20% off! Contactez Jason: 581-307-2678";
  }

  return "Merci pour votre message! Novus Epoxy \u2014 sp\u00e9cialiste rev\u00eatements \u00e9poxy au Qu\u00e9bec. PROMO AVRIL: 20% de rabais! Pour une soumission gratuite: 581-307-2678 (Jason) ou novusepoxy.ca";
}

async function sendTelegramMessage(chatId: number, text: string): Promise<boolean> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${ARIA_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const update = await request.json();

    // Handle message updates
    const message = update.message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text;
    const firstName = message.from?.first_name || "Client";

    // Skip bot commands that aren't relevant
    if (text.startsWith("/start")) {
      await sendTelegramMessage(chatId,
        `Bonjour ${firstName}! Je suis Nova, assistante de Novus Epoxy.\n\nComment puis-je vous aider?\n\nPROMO AVRIL: 20% de rabais sur tous nos revetements!\n\nSoumission gratuite: 581-307-2678`
      );
      return NextResponse.json({ ok: true });
    }

    // Generate smart response
    const response = getSmartResponse(text);
    await sendTelegramMessage(chatId, response);

    // Forward to Jason DM for visibility (non-blocking)
    const JASON_CHAT = process.env.TELEGRAM_CHAT_ID || "7562421258";
    const BRIDGE_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8715863191:AAEXrjNoFTQJCq214_Hvmh_zD2mSk9x6Af8";

    fetch(`https://api.telegram.org/bot${BRIDGE_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: JASON_CHAT,
        text: `\u{1F916} Aria a repondu:\n\nDe: ${firstName}\nMsg: ${text.slice(0, 200)}\nReponse: ${response.slice(0, 200)}`,
      }),
    }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}

// Telegram sends GET for webhook verification
export async function GET() {
  return NextResponse.json({ status: "ok", bot: "novus-admin" });
}
