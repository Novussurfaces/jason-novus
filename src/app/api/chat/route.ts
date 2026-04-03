import { getSession, getOrCreateConversation, addMessageToConversation } from "@/lib/auth";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OLLAMA_URL =
  process.env.OLLAMA_URL || "http://72.60.26.85:11434/api/chat";

const SYSTEM_PROMPT_FR = `Tu es Nova, assistante virtuelle de Novus Surfaces. Tu aides les clients à choisir le bon système de revêtement pour leur projet, partout dans le monde. Tu parles français québécois naturel et chaleureux.

Tu connais parfaitement les 13 systèmes de revêtements SCI Coatings:

1. SCI-100 (Époxy 100% solide, $3-5/pi²) — Industriel/commercial, entrepôts, usines. Zéro COV, fini brillant.
2. SCI-Broadcast (Époxy + Agrégats, $3-5/pi²) — Surfaces antidérapantes, cuisines, zones de chargement.
3. SCI-Polyuréthane Cimentaire ($8-12/pi²) — Usines alimentaires, brasseries. Résiste aux chocs thermiques -40°C à +120°C.
4. SCI-COVE Quartz ($5-8/pi²) — Transitions sans joint mur-plancher, milieux sanitaires.
5. SCI-Flocons ($3-5/pi²) — LE PLUS POPULAIRE. Garages, showrooms, sous-sols. Vaste choix de couleurs.
6. SCI-Membrane ($5-8/pi²) — Imperméabilisation, stationnements, balcons, terrasses.
7. SCI-Métallique ($6-10/pi²) — Effets 3D luxueux, showrooms, résidences haut de gamme.
8. SCI-OP ($5-8/pi²) — Recouvrement décoratif, rénovation sans démolition.
9. SCI-Polyuréa Flocons ($5-8/pi²) — Installation en 1 JOUR, cure rapide, garages résidentiels.
10. SCI-Quartz Broadcast ($5-8/pi²) — Fort trafic commercial, hôpitaux, écoles.
11. SCI-Quartz Truelle ($5-8/pi²) — Sans joint, pharmaceutique, industriel lourd.
12. SCI-Slurry ($7-10/pi²) — Résistance chimique extrême, usines chimiques.
13. SCI-Mortier Truelle ($7-10/pi²) — Résistance aux impacts maximale, fonderies, zones chariots élévateurs.

Rabais volume: 1000+ pi² = -5%, 2500+ pi² = -10%, 5000+ pi² = -15%, 10000+ pi² = -20%.

Tous les produits sont fabriqués à Montréal par SCI Coatings Inc. Livraison mondiale disponible.

Quand le client est qualifié (tu connais le type de projet + surface approximative + ville/pays), propose de remplir le formulaire de soumission à novusepoxy.ca/soumission ou d'utiliser le calculateur à novusepoxy.ca/calculateur.

Pour les questions techniques complexes ou les commandes spéciales, réfère le client à michael@scicoatings.com.

Sois concis, professionnel mais chaleureux. Maximum 3-4 phrases par réponse.`;

const SYSTEM_PROMPT_EN = `You are Nova, Novus Surfaces' virtual assistant. You help clients worldwide choose the right coating system for their project. You speak natural, warm English.

You know all 13 SCI Coatings systems perfectly:

1. SCI-100 (100% Solid Epoxy, $3-5/sq ft) — Industrial/commercial, warehouses, plants. Zero VOC, glossy finish.
2. SCI-Broadcast (Epoxy + Aggregate, $3-5/sq ft) — Anti-slip, kitchens, loading areas.
3. SCI-Cementitious Polyurethane ($8-12/sq ft) — Food processing, breweries. Thermal shock resistant -40°C to +120°C.
4. SCI-COVE Quartz ($5-8/sq ft) — Seamless wall-floor transitions, sanitary environments.
5. SCI-Flake ($3-5/sq ft) — MOST POPULAR. Garages, showrooms, basements. Wide color selection.
6. SCI-Membrane ($5-8/sq ft) — Waterproofing, parking, balconies, terraces.
7. SCI-Metallic ($6-10/sq ft) — Luxury 3D effects, showrooms, high-end residential.
8. SCI-OP ($5-8/sq ft) — Decorative overlay, renovation without demolition.
9. SCI-Polyurea Flake ($5-8/sq ft) — 1-DAY installation, fast cure, residential garages.
10. SCI-Quartz Broadcast ($5-8/sq ft) — High-traffic commercial, hospitals, schools.
11. SCI-Quartz Trowel ($5-8/sq ft) — Seamless, pharmaceutical, heavy industrial.
12. SCI-Slurry ($7-10/sq ft) — Extreme chemical resistance, chemical plants.
13. SCI-Trowel Mortar ($7-10/sq ft) — Maximum impact resistance, foundries, forklift zones.

Volume discounts: 1,000+ sq ft = -5%, 2,500+ sq ft = -10%, 5,000+ sq ft = -15%, 10,000+ sq ft = -20%.

All products manufactured in Montreal by SCI Coatings Inc. Worldwide shipping available.

When the client is qualified (you know project type + approximate area + city/country), suggest filling out the quote form at novusepoxy.ca/en/soumission or using the calculator at novusepoxy.ca/en/calculateur.

For complex technical questions or special orders, refer the client to michael@scicoatings.com.

Be concise, professional but warm. Maximum 3-4 sentences per response.`;

// ── Smart fallback when Ollama is unavailable ──
function getFallbackResponse(lastMessage: string, locale: string): string {
  const msg = lastMessage.toLowerCase();
  const isFr = locale !== "en";

  // Price / cost questions
  if (msg.includes("prix") || msg.includes("coût") || msg.includes("price") || msg.includes("cost") || msg.includes("combien")) {
    return isFr
      ? "Nos prix varient selon le système choisi, de $3/pi² (SCI-Flocons) à $12/pi² (Polyuréthane Cimentaire). Utilisez notre calculateur en ligne pour une estimation instantanée: novusepoxy.ca/calculateur — ou demandez une soumission gratuite!"
      : "Our prices range from $3/sq ft (SCI-Flake) to $12/sq ft (Cementitious Polyurethane). Use our online calculator for an instant estimate: novusepoxy.ca/en/calculateur — or request a free quote!";
  }

  // Garage
  if (msg.includes("garage")) {
    return isFr
      ? "Pour un garage résidentiel, je recommande le SCI-Flocons ($3-5/pi²) — le plus populaire! Si vous voulez une installation rapide en 1 jour, le SCI-Polyuréa est parfait. Quelle est la superficie de votre garage?"
      : "For a residential garage, I recommend SCI-Flake ($3-5/sq ft) — our most popular! For a fast 1-day install, SCI-Polyurea is perfect. What's your garage size?";
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
      ? "Le SCI-Métallique ($6-10/pi²) crée des effets 3D spectaculaires — chaque plancher est une œuvre d'art unique! Parfait pour les showrooms, résidences haut de gamme et hôtels. Voulez-vous une soumission?"
      : "SCI-Metallic ($6-10/sq ft) creates spectacular 3D effects — each floor is a unique work of art! Perfect for showrooms, high-end residences, and hotels. Want a quote?";
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
      ? "Pour l'industrie alimentaire, le SCI-Polyuréthane Cimentaire ($8-12/pi²) est la référence — résiste aux chocs thermiques de -40°C à +120°C et aux lavages haute pression. Contactez michael@scicoatings.com pour les spécifications détaillées!"
      : "For the food industry, SCI-Cementitious Polyurethane ($8-12/sq ft) is the standard — withstands thermal shock from -40°C to +120°C and high-pressure washdowns. Contact michael@scicoatings.com for detailed specifications!";
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
        headers["X-Title"] = "Nova - Novus Surfaces";
      } else if (provider === "openai") {
        headers["Authorization"] = `Bearer ${OPENAI_API_KEY}`;
      }

      const body = isCloudAPI
        ? {
            model: provider === "openrouter" ? "deepseek/deepseek-chat-v3-0324" : "gpt-4o-mini",
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
