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
accent: #2563eb (electric blue)
accent-hover: #3b82f6
accent-muted: #1e3a5f
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
- **ScrollProgress** — Fixed top blue progress bar
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
- Epoxy → blue (#2563eb)
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

## WHAT STILL NEEDS WORK
1. **Real product photos** — Replace ProductVisual placeholders when SCI sends photos
2. **Shopify integration** — Connect headless Storefront API for cart/checkout
3. **Chatbot Nova** — Connect to Ollama (Qwen 2.5:14B on VPS) via /api/chat
4. **n8n webhooks** — Connect forms to automation (quote → CRM → email)
5. **Portfolio photos** — Real before/after project images
6. **Logo** — Replace "N" placeholder with real Novus Surfaces logo
7. **Blog content** — Write real SEO articles (epoxy guides, comparisons)
8. **Google Business Profile** — Set up for local SEO
9. **Structured data** — Product schema.org JSON-LD per product page

## RULES
- NEVER output template-quality code. Every component must use SpotlightCard, Framer Motion, or another premium effect.
- NEVER use plain gray boxes for images. Use ProductVisual or animated gradients.
- ALWAYS add animation (even subtle) to new sections.
- ALWAYS add to BOTH fr.json AND en.json when adding text.
- NEVER hardcode text — always use useTranslations().
- Test with `npm run build` before pushing. 0 errors required.
- Commit with descriptive messages. Push to trigger Vercel auto-deploy.
