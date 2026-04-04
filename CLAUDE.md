@AGENTS.md

# NOVUS SURFACES — $250K Awwwards-Level Site

## WHO YOU ARE
Tu es l'architecte de novussurfaces.com. Tu builds un site qui compete avec Oura Ring, Lusion v3, Vredestein. PAS un template. Un site à $250K. Dark luxury industrial.

## OWNER
Jason Lanthier (Groupe Novus, Quebec). Parle franglais. Veut du résultat, pas du blabla. Maximum 2 phrases d'explication, puis du code.

## BUSINESS CONTEXT
- **Brand:** NOVUS SURFACES (novussurfaces.com)
- **Model:** Private-label reseller of SCI Coatings (Anjou, QC). SCI manufactures, Novus brands + sells worldwide.
- **Products:** 13 SCI coating systems (epoxy, polyurea, quartz, metallic, polyaspartic)
- **Market:** INTERNATIONAL — Quebec + Canada + worldwide shipping (air + sea)
- **Distributor:** Michael at SCI Coatings — michael@scicoatings.com, 514-907-7722

## TECH STACK
- **Framework:** Next.js 16.2.1 (App Router, Turbopack)
- **React:** 19.2.4
- **Styling:** Tailwind CSS 4 (inline theme, NO tailwind.config)
- **i18n:** next-intl 4.8.3 — FR (default, no prefix) + EN (/en/...)
- **Animations:** Framer Motion 12 + GSAP 3.14 + ScrollTrigger
- **3D:** React Three Fiber 9 + Drei 10 + Postprocessing 3
- **Smooth Scroll:** Lenis 1.3
- **Before/After:** react-compare-slider 4
- **Particles:** @tsparticles/react + @tsparticles/slim
- **PDF:** jspdf 4
- **Icons:** lucide-react

## DESIGN SYSTEM

### Theme (defined in globals.css @theme inline)
```
background: #09090b (near-black)
foreground: #fafafa (white)
muted: #a1a1aa
muted-foreground: #71717a
border: #27272a
card: #18181b
card-hover: #1f1f23
accent: #C9A84C (warm gold)
accent-hover: #D4B75E
accent-muted: #5C4A1E
surface: #0f0f12
success: #22c55e
warning: #f59e0b
```

### Fonts
- **Sans (body):** Inter → `var(--font-inter)` → `font-sans`
- **Heading:** Space Grotesk → `var(--font-cabinet)` → `font-heading`
- Usage: `font-[family-name:var(--font-cabinet)]` for headings

### Spacing
- Sections: `py-24 md:py-32`
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

## COMPONENT ARSENAL (44 components)

### Premium UI Primitives (src/components/ui/) — USE THESE
| Component | What it does | When to use |
|-----------|-------------|-------------|
| **SpotlightCard** | Radial gradient follows mouse cursor on hover | Every card that needs premium feel |
| **MagneticButton** | Element follows mouse with spring physics | CTAs, interactive buttons |
| **TextReveal** | Word-by-word opacity reveal on scroll | Section titles, hero text |
| **CustomCursor** | 8px dot + 36px ring, mix-blend-difference | Already in layout, desktop-only |
| **AnimatedCounter** | GSAP ScrollTrigger number animation | Stats, metrics |
| **NumberTicker** | Framer Motion count-up on scroll | Trust bars, stat sections |
| **GlassCard** | Glassmorphism with backdrop-blur | Overlay cards, floating panels |
| **ParallaxImage** | Image moves on scroll (speed 0.3) | Background images, hero |
| **ScrollReveal** | Directional fade-in (up/left/right) | Any content reveal |
| **StaggerGrid** | Children animate in sequence | Card grids, feature lists |
| **InfiniteMovingCards** | Aceternity-style infinite horizontal scroll | Testimonials, partner logos |
| **Meteors** | Animated falling meteor particles | Section backgrounds |
| **LampEffect** | Aceternity lamp/spotlight conic gradients | Premium section headers |
| **BentoGrid** | Masonry-style grid with motion items | Feature showcases |
| **ProductVisual** | Animated gradient bg per chemistry type | ALL product cards/pages |

### Section Components (src/components/sections/)
| Component | Used on | Quality |
|-----------|---------|---------|
| **Hero** | Homepage | PREMIUM — Aurora bg, chrome text, particles, counters |
| **TrustBar** | Homepage | PREMIUM — Animated number tickers |
| **FeaturedProducts** | Homepage | Uses ProductVisual, SpotlightCard |
| **WhyNovus** | Homepage | 4 feature cards with SpotlightCard |
| **BeforeAfter** | Homepage | react-compare-slider |
| **Testimonials** | Homepage | InfiniteMovingCards |
| **WorldwideShipping** | Homepage | 3 shipping regions |
| **CTASection** | Homepage | TextReveal + MagneticButton + glow |
| **ProductsCatalog** | /produits | Filterable grid with ProductVisual |
| **ProductDetail** | /produits/[slug] | Meteors, spec icons, split layout |
| **Calculator** | /calculateur | Multi-step form, PDF generation |
| **QuoteForm** | /soumission | 8-field form with API |

### 3D Components (src/components/three/)
| Component | What |
|-----------|------|
| **HeroBlob** | R3F icosahedron with MeshDistortMaterial + Bloom |
| **AuroraBackground** | 3 animated radial gradient blobs |
| **FilmGrain** | SVG turbulence noise overlay (3% opacity) |

### Global Components (already in layout.tsx)
- **SmoothScroll** — Lenis wrapper (duration 1.2s)
- **ScrollProgress** — Fixed top gold progress bar
- **FilmGrain** — Subtle noise texture
- **CustomCursor** — Premium cursor (desktop only)
- **Navbar** — Sticky with scroll blur
- **Footer** — Multi-column
- **ChatBot** — AI chat widget (connects to /api/chat)

## CODING PATTERNS

### Every component MUST:
1. Start with `"use client";`
2. Import from `@/` aliases (never relative `../`)
3. Use `useTranslations()` from next-intl for ALL user-facing text
4. Use Framer Motion for entrance animations (opacity 0→1, y 20→0)
5. Use `cn()` from `@/lib/cn` for conditional classNames
6. Be responsive (mobile-first: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`)

### Animation patterns (copy these exactly):
```tsx
// Entrance animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: 0.1 }}
>

// Stagger children
{items.map((item, i) => (
  <AnimatedSection delay={i * 0.1}>

// Scroll-triggered counter
<NumberTicker value={500} suffix="+" delay={0.2} />

// Premium card
<SpotlightCard className="h-full">
  <ProductVisual sciCode="SCI-MET" chemistry="Epoxy-Metallic" className="aspect-[4/3] mb-5" />
  ...
</SpotlightCard>

// CTA with magnetic effect
<MagneticButton>
  <Button href="/soumission" size="lg">
    {t("cta")}
    <ArrowRight size={18} />
  </Button>
</MagneticButton>
```

### ProductVisual chemistry → color mapping:
- Epoxy → gold (#C9A84C)
- Polyurea → purple (#7c3aed)
- Polyaspartic → indigo (#6366f1)
- Epoxy-Quartz → cyan (#0891b2)
- Epoxy-Metallic → amber (#d97706)
- Epoxy-Flake → emerald (#059669)

### i18n pattern:
```tsx
// In component:
const t = useTranslations("sectionName");
<h2>{t("title")}</h2>

// In messages/fr.json + messages/en.json:
"sectionName": {
  "title": "Le titre"
}
```
Both files MUST have identical key structures. Always add keys to BOTH files.

## PREMIUM REPOS TO STUDY/STEAL FROM
- **itsjwill/nextjs-animated-components** (155+ components) — LiquidMetal, ShaderDistortion, ParticleMorph
- **vercel/commerce** (14K+ stars) — Headless Shopify + Next.js patterns
- **pmndrs/react-three-next** — R3F + Next.js starter
- **Aceternity UI** (ui.aceternity.com) — Premium effects (copy-paste OK)
- **Magic UI** (magicui.design) — Number tickers, spotlights, shimmer

## AWWWARDS REFERENCES (our benchmarks)
1. **Oura Ring** — Headless Shopify + Next.js, dark premium, +42% sales
2. **Lusion v3** — Dark WebGL masterpiece
3. **Vredestein** — Industrial product (tires) presented as luxury art = OUR MODEL

## FILE STRUCTURE
```
src/
├── app/
│   ├── [locale]/           # All pages (FR default, EN /en/...)
│   │   ├── page.tsx         # Homepage
│   │   ├── produits/        # Products catalog + detail
│   │   ├── soumission/      # Quote form
│   │   ├── calculateur/     # Price calculator
│   │   ├── realisations/    # Portfolio
│   │   ├── a-propos/        # About
│   │   ├── contact/         # Contact
│   │   ├── blog/            # Blog list + detail
│   │   └── lp/              # Landing pages (garage, commercial)
│   ├── api/                 # API routes (quote, contact, chat, calculator)
│   └── globals.css          # Theme + global styles
├── components/
│   ├── sections/            # Page sections (Hero, Products, etc.)
│   ├── ui/                  # Reusable primitives (SpotlightCard, etc.)
│   ├── three/               # R3F/Three.js components
│   └── landing/             # Landing page components
├── lib/                     # Utilities (products, pricing, PDF, cn)
├── i18n/                    # next-intl config (routing, navigation)
└── messages/                # fr.json + en.json translations
```

## AGENTIC LAYER (AI-enhanced features)

### Live Features (implemented)
- **CuringConditions** — Real-time weather widget (Open-Meteo + Nominatim geocoding). Customer enters postal code → sees if conditions are safe for coating application (temp >10°C, humidity <80%, no rain).
- **CurrencySelector** — Live CAD→USD/EUR/GBP conversion (Frankfurter API). `useCurrency()` hook in `src/lib/currency.ts`. Rates cached 1h in localStorage.
- **Google Maps Embed** — Free unlimited dealer/installer map (no API key needed). Iframe embed + Nominatim geocoding for search.

### Free APIs in use
- **Open-Meteo** — Weather data, no auth, 10K/day
- **Nominatim** — Geocoding, no auth, 1 req/s
- **Frankfurter** — Currency rates, no auth, no limits
- **Google Maps Embed** — Free iframe embed, no API key, unlimited loads

### Prompt Engineering Standards (Anthropic 10 Elements)
Every agent system prompt MUST include ALL 10 elements:

| # | Element | What | Example |
|---|---------|------|---------|
| 1 | **Task** | What the agent does | "You answer product questions about SCI coating systems" |
| 2 | **Persona** | Role + expertise + tone | "You are Nova, a coating specialist with 15 years of experience" |
| 3 | **Context** | Business rules, product data | Product specs, pricing rules, shipping zones |
| 4 | **Output format** | Exact response structure | JSON, markdown table, bullet points |
| 5 | **Examples** | 3-5 few-shot input→output pairs | Customer asks about garage → recommend SCI-GAR |
| 6 | **Constraints** | Hard limits | "NEVER reveal wholesale pricing" |
| 7 | **XML tags** | Structured input wrapping | `<user_query>`, `<product_context>` |
| 8 | **Prefilling** | Start assistant response | `{"recommendation": "` |
| 9 | **Chain-of-thought** | Internal reasoning | `<thinking>` tags before answering |
| 10 | **Tool use** | Available tools | Weather check, price lookup, inventory |

Template for every new agent:
```xml
<system>
You are [PERSONA]. [TASK].
<context>[RULES + DATA]</context>
<output_format>[FORMAT]</output_format>
<examples><example><input>X</input><output>Y</output></example></examples>
<constraints>NEVER X. ALWAYS Y.</constraints>
<tools>[TOOL DEFINITIONS]</tools>
</system>
```

### Agentic Patterns
- **CodeAgent > ToolCallingAgent** — agents generate Python code, not JSON (30% better completion)
- **Agentic RAG** — agent decides WHEN to retrieve vs answer directly (saves tokens)
- **Think-Act-Observe** — reason → act → observe → loop until done
- **Self-improvement** — `feedback_lessons.md` in memory persists patterns across sessions

### Strategic Vision
See `docs/AGENTIC-VISION.md` for the full 6-stage agentic architecture (660 lines):
Discovery → First Contact → Engagement → Conversion → Post-Sale → Growth
16+ agents, infrastructure map, implementation roadmap P0→P3, success metrics.

## WHAT STILL NEEDS WORK
1. **Real product photos** — Replace ProductVisual placeholders when SCI sends photos
2. **Shopify integration** — Connect headless Storefront API for cart/checkout
3. **Chatbot Nova** — Connect to Ollama (Qwen 2.5:14B on VPS) via /api/chat
4. **n8n webhooks** — Connect forms to automation (quote → CRM → email)
5. **Portfolio photos** — Real before/after project images
6. **Logo** — Replace "N" placeholder with real Novus Surfaces logo
7. **Google Business Profile** — Set up for local SEO
10. **Dealer locator** — Interactive map with Mapbox + LocationIQ geocoding
11. **B2B lead gen** — Tomba API integration for contractor outreach
12. **Multi-agent Zeniva** — 5 specialized agents (SEO, CS, Sales, Content, Manager)

## RULES
- NEVER output template-quality code. Every component must use SpotlightCard, Framer Motion, or another premium effect.
- NEVER use plain gray boxes for images. Use ProductVisual or animated gradients.
- ALWAYS add animation (even subtle) to new sections.
- ALWAYS add to BOTH fr.json AND en.json when adding text.
- NEVER hardcode text — always use useTranslations().
- Test with `npm run build` before pushing. 0 errors required.
- Commit with descriptive messages. Push to trigger Vercel auto-deploy.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **novus-epoxy** (7918 symbols, 15976 relationships, 300 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/novus-epoxy/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/novus-epoxy/context` | Codebase overview, check index freshness |
| `gitnexus://repo/novus-epoxy/clusters` | All functional areas |
| `gitnexus://repo/novus-epoxy/processes` | All execution flows |
| `gitnexus://repo/novus-epoxy/process/{name}` | Step-by-step execution trace |

## Self-Check Before Finishing

Before completing any code modification task, verify:
1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Claude Code users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
