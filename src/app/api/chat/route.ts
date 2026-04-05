import { getSession, getOrCreateConversation, addMessageToConversation } from "@/lib/auth";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OLLAMA_URL =
  process.env.OLLAMA_URL || "http://72.60.26.85:11434/api/chat";

const SYSTEM_PROMPT_FR = `Tu es Nova, assistante virtuelle de Novus Epoxy. Tu aides les clients à choisir le bon système de revêtement pour leur projet. Tu parles français québécois naturel et chaleureux.

IMPORTANT: Recommande le BON produit selon le BESOIN du client. NE recommande PAS toujours le même produit.

Les 13 systèmes SCI Coatings (prix installé par pi²):

RÉSIDENTIEL:
- SCI-Flocons (2.85-4.75$/pi²) — Garages, showrooms, sous-sols. Flocons décoratifs.
- SCI-Polyuréa Flocons (4.50-7.00$/pi²) — Installation en 1 JOUR, garages résidentiels.
- SCI-Métallique (5.50-9.00$/pi²) — Effets 3D luxueux, haut de gamme.

COMMERCIAL:
- SCI-100 (2.75-4.50$/pi²) — Industriel/commercial, zéro COV.
- SCI-Broadcast (2.75-4.50$/pi²) — Antidérapant, cuisines, zones de chargement.
- SCI-Quartz Broadcast (4.50-7.50$/pi²) — Fort trafic, hôpitaux, écoles.
- SCI-OP (4.25-6.50$/pi²) — Rénovation sans démolition.

INDUSTRIEL:
- SCI-Polyuréthane Cimentaire (7.00-11.00$/pi²) — Alimentaire, brasseries, -40°C à +120°C.
- SCI-Quartz Truelle (4.75-7.50$/pi²) — Pharmaceutique, industriel lourd.
- SCI-Slurry (6.00-9.00$/pi²) — Résistance chimique extrême.
- SCI-Mortier Truelle (6.50-9.50$/pi²) — Impacts maximaux, fonderies.

SPÉCIALISÉ:
- SCI-Membrane (4.50-7.00$/pi²) — Imperméabilisation, stationnements, balcons.
- SCI-COVE Quartz (4.50-7.00$/pi²) — Transitions mur-plancher, sanitaire.

Rabais volume: 1000+ pi² = -5%, 2500+ = -10%, 5000+ = -15%, 10000+ = -20%.
PROMO AVRIL: 20% de rabais sur tous les projets!

Fabriqué à Montréal par SCI Coatings. Livraison mondiale.

Quand le client est qualifié (type projet + superficie + ville):
- "Appelez Jason: 581-307-2678" — TOUJOURS proposer l'appel
- Soumission: novusepoxy.ca/soumission
- Calculateur: novusepoxy.ca/calculateur
- Questions techniques: michael@scicoatings.com

Sois concis, pro, PUISSANT. Maximum 3-4 phrases.`;

const SYSTEM_PROMPT_EN = `You are Nova, Novus Epoxy's virtual assistant. You help clients choose the right coating system. Natural, warm English.

IMPORTANT: Recommend the RIGHT product for the client's NEED. Do NOT always recommend the same product.

13 SCI Coatings systems (installed price per sq ft):

RESIDENTIAL:
- SCI-Flake ($2.85-4.75/sq ft) — Garages, showrooms, basements. Decorative flakes.
- SCI-Polyurea Flake ($4.50-7.00/sq ft) — 1-DAY install, residential garages.
- SCI-Metallic ($5.50-9.00/sq ft) — Luxury 3D effects, high-end.

COMMERCIAL:
- SCI-100 ($2.75-4.50/sq ft) — Industrial/commercial, zero VOC.
- SCI-Broadcast ($2.75-4.50/sq ft) — Anti-slip, kitchens, loading areas.
- SCI-Quartz Broadcast ($4.50-7.50/sq ft) — High traffic, hospitals, schools.
- SCI-OP ($4.25-6.50/sq ft) — Renovation without demolition.

INDUSTRIAL:
- SCI-Cementitious Polyurethane ($7.00-11.00/sq ft) — Food processing, breweries, -40°C to +120°C.
- SCI-Quartz Trowel ($4.75-7.50/sq ft) — Pharmaceutical, heavy industrial.
- SCI-Slurry ($6.00-9.00/sq ft) — Extreme chemical resistance.
- SCI-Trowel Mortar ($6.50-9.50/sq ft) — Maximum impact, foundries.

SPECIALIZED:
- SCI-Membrane ($4.50-7.00/sq ft) — Waterproofing, parking, balconies.
- SCI-COVE Quartz ($4.50-7.00/sq ft) — Wall-floor transitions, sanitary.

Volume discounts: 1,000+ sq ft = -5%, 2,500+ = -10%, 5,000+ = -15%, 10,000+ = -20%.
APRIL PROMO: 20% off all projects!

Made in Montreal by SCI Coatings. Worldwide shipping.

When qualified (project type + area + city):
- "Call Jason: 581-307-2678" — ALWAYS offer the call
- Quote: novusepoxy.ca/en/soumission
- Calculator: novusepoxy.ca/en/calculateur
- Technical: michael@scicoatings.com

Be concise, professional, POWERFUL. Max 3-4 sentences.`;

// ── Smart fallback when Ollama is unavailable ──
function getFallbackResponse(lastMessage: string, locale: string): string {
  const msg = lastMessage.toLowerCase();
  const isFr = locale !== "en";

  // Price / cost questions
  if (msg.includes("prix") || msg.includes("coût") || msg.includes("price") || msg.includes("cost") || msg.includes("combien")) {
    return isFr
      ? "Nos prix varient de 2.75$/pi² (SCI-100) à 11.00$/pi² (Polyuréthane Cimentaire). PROMO AVRIL: 20% de rabais! Calculateur: novusepoxy.ca/calculateur ou 581-307-2678"
      : "Our prices range from $2.75/sq ft (SCI-100) to $11.00/sq ft (Cementitious Polyurethane). APRIL PROMO: 20% off! Calculator: novusepoxy.ca/en/calculateur or call 581-307-2678";
  }

  // Garage
  if (msg.includes("garage")) {
    return isFr
      ? "Pour un garage, le SCI-Flocons (2.85-4.75$/pi²) est excellent! Pour une installation en 1 jour, le SCI-Polyuréa (4.50-7.00$/pi²) est parfait. PROMO AVRIL: 20% de rabais! Quelle est la superficie?"
      : "For a garage, SCI-Flake ($2.85-4.75/sq ft) is excellent! For a 1-day install, SCI-Polyurea ($4.50-7.00/sq ft) is perfect. APRIL PROMO: 20% off! What's the size?";
  }

  // Commercial / industrial
  if (msg.includes("commercial") || msg.includes("industriel") || msg.includes("industrial") || msg.includes("entrepôt") || msg.includes("warehouse")) {
    return isFr
      ? "Pour les projets commerciaux et industriels, nous avons des systèmes comme SCI-100 (époxy 100% solide), SCI-Quartz Broadcast (fort trafic), et SCI-Mortier (impacts lourds). Quel type d'environnement exactement?"
      : "For commercial and industrial projects, we have systems like SCI-100 (100% solid epoxy), SCI-Quartz Broadcast (high traffic), and SCI-Mortar (heavy impacts). What type of environment exactly?";
  }

  // Metallic
  if (msg.includes("métal") || msg.includes("metal") || msg.includes("luxe") || msg.includes("luxury") || msg.includes("showroom")) {
    return isFr
      ? "Le SCI-Métallique (5.50-9.00$/pi²) crée des effets 3D spectaculaires — chaque plancher est unique! PROMO AVRIL: 20% de rabais! Soumission: 581-307-2678"
      : "SCI-Metallic ($5.50-9.00/sq ft) creates spectacular 3D effects — each floor is unique! APRIL PROMO: 20% off! Quote: 581-307-2678";
  }

  // Delivery / shipping
  if (msg.includes("livr") || msg.includes("deliv") || msg.includes("ship") || msg.includes("expéd")) {
    return isFr
      ? "Nous livrons partout dans le monde! Amérique du Nord: 3-7 jours. Europe: 10-21 jours (maritime ou aérien). Tous nos produits sont fabriqués à Montréal. Où est situé votre projet?"
      : "We ship worldwide! North America: 3-7 days. Europe: 10-21 days (ocean or air). All products made in Montreal. Where is your project located?";
  }

  // Food / restaurant / brewery
  if (msg.includes("aliment") || msg.includes("food") || msg.includes("brasser") || msg.includes("brew") || msg.includes("restaurant") || msg.includes("cuisine") || msg.includes("kitchen")) {
    return isFr
      ? "Pour l'alimentaire, le SCI-Polyuréthane Cimentaire (7.00-11.00$/pi²) est LA référence — résiste de -40°C à +120°C. PROMO AVRIL: 20%! Specs: michael@scicoatings.com ou 581-307-2678"
      : "For food industry, SCI-Cementitious Polyurethane ($7.00-11.00/sq ft) is THE standard — withstands -40°C to +120°C. APRIL PROMO: 20% off! Specs: michael@scicoatings.com or 581-307-2678";
  }

  // Default — suggest quote form
  return isFr
    ? "Merci pour votre message! Je peux vous aider à choisir le bon système de revêtement parmi nos 13 produits. Parlez-moi de votre projet — type de surface, superficie approximative et localisation — et je vous ferai une recommandation personnalisée! Vous pouvez aussi remplir notre formulaire de soumission: novusepoxy.ca/soumission"
    : "Thanks for your message! I can help you choose the right coating system from our 13 products. Tell me about your project — surface type, approximate area, and location — and I'll give you a personalized recommendation! You can also fill out our quote form: novusepoxy.ca/en/soumission";
}

export async function POST(request: Request) {
  try {
    const { messages, locale } = await request.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // Track conversation if user is logged in
    const user = await getSession();
    if (user) {
      const conv = getOrCreateConversation(user.id);
      addMessageToConversation(user.id, conv.id, {
        role: "user",
        content: lastUserMessage,
        timestamp: new Date().toISOString(),
      });
    }

    const systemPrompt = locale === "en" ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_FR;

    // Priority: OpenRouter → OpenAI → Ollama → Fallback
    const provider = OPENROUTER_API_KEY
      ? "openrouter"
      : OPENAI_API_KEY
        ? "openai"
        : "ollama";

    const apiUrl =
      provider === "openrouter"
        ? "https://openrouter.ai/api/v1/chat/completions"
        : provider === "openai"
          ? "https://api.openai.com/v1/chat/completions"
          : OLLAMA_URL;

    const isCloudAPI = provider !== "ollama";

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (provider === "openrouter") {
        headers["Authorization"] = `Bearer ${OPENROUTER_API_KEY}`;
        headers["HTTP-Referer"] = "https://novusepoxy.ca";
        headers["X-Title"] = "Nova - Novus Epoxy";
      } else if (provider === "openai") {
        headers["Authorization"] = `Bearer ${OPENAI_API_KEY}`;
      }

      const body = isCloudAPI
        ? {
            model: provider === "openrouter" ? "anthropic/claude-sonnet-4" : "gpt-4o-mini",
            messages: [{ role: "system", content: systemPrompt }, ...messages],
            stream: true,
            temperature: 0.7,
            max_tokens: 400,
          }
        : {
            model: "qwen2.5:14b",
            messages: [{ role: "system", content: systemPrompt }, ...messages],
            stream: true,
            options: { temperature: 0.7, num_predict: 400 },
          };

      const apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (apiResponse.ok && apiResponse.body) {
        let fullContent = "";
        const apiBody = apiResponse.body;

        const stream = new ReadableStream({
          async start(streamController) {
            const reader = apiBody.getReader();
            const decoder = new TextDecoder();

            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n").filter((l) => l.trim());

                for (const line of lines) {
                  try {
                    if (isCloudAPI) {
                      // OpenAI/OpenRouter SSE format: "data: {...}"
                      const data = line.replace(/^data: /, "");
                      if (data === "[DONE]") continue;
                      const parsed = JSON.parse(data);
                      const token = parsed.choices?.[0]?.delta?.content || "";
                      if (token) {
                        fullContent += token;
                        streamController.enqueue(new TextEncoder().encode(token));
                      }
                    } else {
                      // Ollama format: newline-delimited JSON
                      const parsed = JSON.parse(line);
                      const token = parsed.message?.content || "";
                      if (token) {
                        fullContent += token;
                        streamController.enqueue(new TextEncoder().encode(token));
                      }
                    }
                  } catch {
                    // skip malformed chunks
                  }
                }
              }
            } catch {
              // Stream interrupted
            } finally {
              reader.releaseLock();
              streamController.close();

              if (user && fullContent) {
                const conv = getOrCreateConversation(user.id);
                addMessageToConversation(user.id, conv.id, {
                  role: "assistant",
                  content: fullContent,
                  timestamp: new Date().toISOString(),
                });
              }
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
            "Transfer-Encoding": "chunked",
          },
        });
      }
    } catch {
      // API unavailable — fall through to fallback
    }

    // Smart fallback when Ollama is down
    const fallback = getFallbackResponse(lastUserMessage, locale || "fr");

    if (user) {
      const conv = getOrCreateConversation(user.id);
      addMessageToConversation(user.id, conv.id, {
        role: "assistant",
        content: fallback,
        timestamp: new Date().toISOString(),
      });
    }

    return new Response(fallback, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch {
    const errorMsg = "Service momentanément indisponible. Veuillez réessayer.";
    return new Response(errorMsg, { status: 503 });
  }
}
