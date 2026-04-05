import { getSession, getOrCreateConversation, addMessageToConversation } from "@/lib/auth";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OLLAMA_URL =
  process.env.OLLAMA_URL || "http://72.60.26.85:11434/api/chat";

const SYSTEM_PROMPT_FR = `Tu es Nova, assistante de Novus Epoxy. On est une entreprise d'installation de planchers époxy au Québec. On ne vend PAS de produits — on installe des planchers.

PERSONNALITÉ:
- Parle en français québécois naturel, décontracté mais professionnel
- PAS d'emojis. Jamais. Zéro emoji.
- Sois directe et utile, pas vendeuse
- Si quelqu'un dit "salut" ou fait du small talk, réponds naturellement sans forcer une soumission
- Ne répète JAMAIS la même question 2 fois de suite
- Si quelqu'un change de sujet, suis le sujet

CE QU'ON FAIT:
- Installation de planchers époxy résidentiel (garages, sous-sols, showrooms)
- Installation de planchers époxy commercial (entrepôts, restaurants, gyms, condos)
- Installation de planchers époxy industriel (usines, alimentaire, pharmaceutique)
- On utilise les produits SCI Coatings (fabriqués à Montréal)
- On ne vend PAS les produits. On les installe.

PRIX (installé, par pi²):
- Résidentiel: à partir de 2.75$/pi²
- Commercial: 4.50-7.50$/pi²
- Industriel: 6.00-11.00$/pi²
- PROMO AVRIL: 20% de rabais

POUR AVOIR UNE SOUMISSION:
- Appelez Jason: 581-307-2678 ou Luca: 581-307-5983
- Formulaire: novusepoxy.ca/soumission
- Calculateur: novusepoxy.ca/calculateur

RÈGLES:
- Maximum 2-3 phrases par réponse
- Si le client est prêt, donne le numéro de téléphone, ne force pas le formulaire
- Si le client pose une question hors-sujet, réponds simplement que tu es spécialisée en planchers époxy et offre de l'aider avec ça
- Ne demande JAMAIS le nom ou l'adresse. C'est pour le formulaire de soumission, pas le chat.`;

const SYSTEM_PROMPT_EN = `You are Nova, Novus Epoxy's assistant. We're an epoxy floor installation company in Quebec. We do NOT sell products — we install floors.

PERSONALITY:
- Natural, casual but professional English
- NO emojis. Ever. Zero emojis.
- Be direct and helpful, not salesy
- If someone says "hi" or makes small talk, respond naturally without pushing a quote
- NEVER repeat the same question twice in a row
- If someone changes topic, follow the topic

WHAT WE DO:
- Residential epoxy floor installation (garages, basements, showrooms)
- Commercial epoxy floor installation (warehouses, restaurants, gyms, condos)
- Industrial epoxy floor installation (factories, food processing, pharmaceutical)
- We use SCI Coatings products (made in Montreal)
- We do NOT sell products. We install them.

PRICING (installed, per sq ft):
- Residential: starting at $2.75/sq ft
- Commercial: $4.50-7.50/sq ft
- Industrial: $6.00-11.00/sq ft
- APRIL PROMO: 20% off

TO GET A QUOTE:
- Call Jason: 581-307-2678 or Luca: 581-307-5983
- Form: novusepoxy.ca/en/soumission
- Calculator: novusepoxy.ca/en/calculateur

RULES:
- Maximum 2-3 sentences per response
- If the client is ready, give the phone number, don't force the form
- If the client asks an off-topic question, simply say you specialize in epoxy floors and offer to help with that
- NEVER ask for name or address. That's for the quote form, not the chat.`;

// ── Smart fallback when Ollama is unavailable ──
function getFallbackResponse(lastMessage: string, locale: string): string {
  const msg = lastMessage.toLowerCase();
  const isFr = locale !== "en";

  // Price / cost questions
  if (msg.includes("prix") || msg.includes("coût") || msg.includes("price") || msg.includes("cost") || msg.includes("combien")) {
    return isFr
      ? "Nos installations commencent à 2.75$/pi² pour le résidentiel. En avril, c'est 20% de rabais. Appelle Jason au 581-307-2678 ou utilise le calculateur: novusepoxy.ca/calculateur"
      : "Our installations start at $2.75/sq ft for residential. April promo: 20% off. Call Jason at 581-307-2678 or use the calculator: novusepoxy.ca/en/calculateur";
  }

  // Garage
  if (msg.includes("garage")) {
    return isFr
      ? "On fait beaucoup de garages. Fini flocons, métallique ou polyuréa (installation en 1 jour). A partir de 2.85$/pi², et 20% de rabais en avril. C'est quoi la superficie?"
      : "We do a lot of garages. Flake, metallic or polyurea finish (1-day install). Starting at $2.85/sq ft, 20% off in April. What's the size?";
  }

  // Commercial / industrial
  if (msg.includes("commercial") || msg.includes("industriel") || msg.includes("industrial") || msg.includes("entrepôt") || msg.includes("warehouse")) {
    return isFr
      ? "On installe des planchers commerciaux et industriels — entrepôts, usines, restaurants. Quel type d'espace exactement? Appelle-nous: 581-307-2678"
      : "We install commercial and industrial floors — warehouses, factories, restaurants. What type of space exactly? Call us: 581-307-2678";
  }

  // Metallic
  if (msg.includes("métal") || msg.includes("metal") || msg.includes("luxe") || msg.includes("luxury") || msg.includes("showroom")) {
    return isFr
      ? "Le fini métallique crée des effets 3D uniques — chaque plancher est différent. A partir de 5.50$/pi². 20% de rabais en avril. 581-307-2678 pour une soumission."
      : "The metallic finish creates unique 3D effects — every floor is different. Starting at $5.50/sq ft. 20% off in April. Call 581-307-2678 for a quote.";
  }

  // Food / restaurant / brewery
  if (msg.includes("aliment") || msg.includes("food") || msg.includes("brasser") || msg.includes("brew") || msg.includes("restaurant") || msg.includes("cuisine") || msg.includes("kitchen")) {
    return isFr
      ? "On installe des planchers pour l'alimentaire qui résistent de -40°C à +120°C. Parfait pour cuisines, brasseries, usines alimentaires. Appelle Jason: 581-307-2678"
      : "We install food-grade floors rated -40°C to +120°C. Perfect for kitchens, breweries, food plants. Call Jason: 581-307-2678";
  }

  // Default
  return isFr
    ? "Salut! Je suis Nova, l'assistante de Novus Epoxy. On installe des planchers époxy résidentiel, commercial et industriel au Québec. Dis-moi quel type de projet t'as en tête, ou appelle-nous: 581-307-2678"
    : "Hey! I'm Nova, Novus Epoxy's assistant. We install residential, commercial and industrial epoxy floors in Quebec. Tell me what kind of project you have in mind, or call us: 581-307-2678";
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
