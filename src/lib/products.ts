export type ProductCategory =
  | "epoxy"
  | "polyurea"
  | "quartz"
  | "metallic"
  | "polyurethane"
  | "membrane"
  | "overlay"
  | "mortar";

export type Product = {
  id: number;
  slug: string;
  sciCode: string;
  category: ProductCategory;
  name: { fr: string; en: string };
  shortDescription: { fr: string; en: string };
  description: { fr: string; en: string };
  applications: { fr: string[]; en: string[] };
  specs: {
    chemistry: string;
    thickness: string;
    cureTime: string;
    trafficReady: string;
  };
  features: { fr: string[]; en: string[] };
  image: string;
};

export const categories: {
  id: ProductCategory | "all";
  label: { fr: string; en: string };
}[] = [
  { id: "all", label: { fr: "Tous", en: "All" } },
  { id: "epoxy", label: { fr: "Époxy", en: "Epoxy" } },
  { id: "polyurea", label: { fr: "Polyuréa", en: "Polyurea" } },
  { id: "quartz", label: { fr: "Quartz", en: "Quartz" } },
  { id: "metallic", label: { fr: "Métallique", en: "Metallic" } },
  { id: "polyurethane", label: { fr: "Polyuréthane", en: "Polyurethane" } },
  { id: "membrane", label: { fr: "Membrane", en: "Membrane" } },
  { id: "overlay", label: { fr: "Recouvrement", en: "Overlay" } },
  { id: "mortar", label: { fr: "Mortier", en: "Mortar" } },
];

export const products: Product[] = [
  {
    id: 1,
    slug: "sci-100-coating-system",
    sciCode: "SCI-100",
    category: "epoxy",
    name: {
      fr: "Système de revêtement SCI-100",
      en: "SCI-100 Coating System",
    },
    shortDescription: {
      fr: "Époxy 100% solide haute performance pour milieux industriels et commerciaux",
      en: "100% solid high-performance epoxy for industrial and commercial environments",
    },
    description: {
      fr: "Le système SCI-100 est un revêtement époxy 100% solide conçu pour les environnements industriels et commerciaux les plus exigeants. Sans solvant et à faible odeur, il offre une résistance chimique et mécanique exceptionnelle avec une finition brillante et durable.",
      en: "The SCI-100 system is a 100% solid epoxy coating designed for the most demanding industrial and commercial environments. Solvent-free and low-odor, it provides exceptional chemical and mechanical resistance with a brilliant, long-lasting finish.",
    },
    applications: {
      fr: [
        "Entrepôts",
        "Usines de fabrication",
        "Garages commerciaux",
        "Salles mécaniques",
        "Laboratoires",
      ],
      en: [
        "Warehouses",
        "Manufacturing plants",
        "Commercial garages",
        "Mechanical rooms",
        "Laboratories",
      ],
    },
    specs: {
      chemistry: "100% Solid Epoxy",
      thickness: "10-40 mils",
      cureTime: "12-16 hours",
      trafficReady: "24-72 hours",
    },
    features: {
      fr: [
        "Zéro COV — sans solvant",
        "Résistance chimique supérieure",
        "Fini brillant auto-nivelant",
        "Adhérence exceptionnelle au béton",
      ],
      en: [
        "Zero VOC — solvent-free",
        "Superior chemical resistance",
        "Self-leveling glossy finish",
        "Exceptional concrete adhesion",
      ],
    },
    image: "/images/products/sci-100.jpg",
  },
  {
    id: 2,
    slug: "sci-broadcast-system",
    sciCode: "SCI-Broadcast",
    category: "epoxy",
    name: {
      fr: "Système SCI-Broadcast",
      en: "SCI-Broadcast System",
    },
    shortDescription: {
      fr: "Époxy avec agrégats pour surfaces antidérapantes et décoratives",
      en: "Epoxy with aggregate for anti-slip and decorative surfaces",
    },
    description: {
      fr: "Le système SCI-Broadcast combine une base époxy haute performance avec des agrégats broadcast pour créer des surfaces texturées, antidérapantes et visuellement attrayantes. Idéal pour les zones à fort trafic nécessitant sécurité et esthétique.",
      en: "The SCI-Broadcast system combines a high-performance epoxy base with broadcast aggregates to create textured, anti-slip, and visually appealing surfaces. Ideal for high-traffic areas requiring both safety and aesthetics.",
    },
    applications: {
      fr: [
        "Entrées commerciales",
        "Cuisines industrielles",
        "Aires de chargement",
        "Corridors à fort trafic",
        "Salles de sport",
      ],
      en: [
        "Commercial entrances",
        "Industrial kitchens",
        "Loading areas",
        "High-traffic corridors",
        "Gym floors",
      ],
    },
    specs: {
      chemistry: "Epoxy + Aggregate",
      thickness: "60-125 mils",
      cureTime: "12-16 hours",
      trafficReady: "24-48 hours",
    },
    features: {
      fr: [
        "Surface antidérapante",
        "Résistance à l'abrasion élevée",
        "Multiple options de texture",
        "Facile à nettoyer et entretenir",
      ],
      en: [
        "Anti-slip surface",
        "High abrasion resistance",
        "Multiple texture options",
        "Easy to clean and maintain",
      ],
    },
    image: "/images/products/sci-broadcast.jpg",
  },
  {
    id: 3,
    slug: "sci-cementitious-polyurethane",
    sciCode: "SCI-CPU",
    category: "polyurethane",
    name: {
      fr: "Polyuréthane cimentaire SCI",
      en: "SCI Cementitious Polyurethane",
    },
    shortDescription: {
      fr: "Résistance aux chocs thermiques pour transformation alimentaire et brasseries",
      en: "Thermal shock resistant for food processing and breweries",
    },
    description: {
      fr: "Le polyuréthane cimentaire SCI est la solution ultime pour les environnements soumis à des chocs thermiques extrêmes, des lavages à haute pression et des produits chimiques agressifs. Conçu spécifiquement pour l'industrie alimentaire et les brasseries.",
      en: "SCI Cementitious Polyurethane is the ultimate solution for environments subject to extreme thermal shock, high-pressure washdowns, and aggressive chemicals. Specifically designed for the food industry and breweries.",
    },
    applications: {
      fr: [
        "Usines alimentaires",
        "Brasseries et distilleries",
        "Cuisines commerciales",
        "Laiteries",
        "Abattoirs",
      ],
      en: [
        "Food processing plants",
        "Breweries and distilleries",
        "Commercial kitchens",
        "Dairy facilities",
        "Meat processing",
      ],
    },
    specs: {
      chemistry: "Cementitious Polyurethane",
      thickness: "6-9 mm",
      cureTime: "24 hours",
      trafficReady: "24-48 hours",
    },
    features: {
      fr: [
        "Résiste aux chocs thermiques (-40°C à +120°C)",
        "Certifié contact alimentaire",
        "Résistance aux lavages haute pression",
        "Antimicrobien",
      ],
      en: [
        "Thermal shock resistant (-40°C to +120°C)",
        "Food-contact certified",
        "High-pressure washdown resistant",
        "Antimicrobial",
      ],
    },
    image: "/images/products/sci-cpu.jpg",
  },
  {
    id: 4,
    slug: "sci-cove-quartz-system",
    sciCode: "SCI-COVE",
    category: "quartz",
    name: {
      fr: "Système SCI-COVE Quartz",
      en: "SCI-COVE Quartz System",
    },
    shortDescription: {
      fr: "Système de gorge quartz pour transitions mur-plancher sans joint",
      en: "Quartz cove base system for seamless wall-floor transitions",
    },
    description: {
      fr: "Le système SCI-COVE Quartz crée des transitions sans joint entre le plancher et le mur, éliminant les points de contamination. Essentiel pour les environnements sanitaires où l'hygiène est primordiale.",
      en: "The SCI-COVE Quartz system creates seamless transitions between floor and wall, eliminating contamination points. Essential for sanitary environments where hygiene is paramount.",
    },
    applications: {
      fr: [
        "Usines alimentaires",
        "Hôpitaux et cliniques",
        "Laboratoires",
        "Salles blanches",
        "Cuisines commerciales",
      ],
      en: [
        "Food processing plants",
        "Hospitals and clinics",
        "Laboratories",
        "Clean rooms",
        "Commercial kitchens",
      ],
    },
    specs: {
      chemistry: "Epoxy + Quartz",
      thickness: "4-6 inches height",
      cureTime: "12-16 hours",
      trafficReady: "24 hours",
    },
    features: {
      fr: [
        "Transition sans joint mur-plancher",
        "Élimine les points de contamination",
        "Conforme aux normes sanitaires",
        "Nettoyage facilité",
      ],
      en: [
        "Seamless wall-floor transition",
        "Eliminates contamination points",
        "Sanitary standards compliant",
        "Easy cleaning",
      ],
    },
    image: "/images/products/sci-cove.jpg",
  },
  {
    id: 5,
    slug: "sci-flake-system",
    sciCode: "SCI-Flake",
    category: "epoxy",
    name: {
      fr: "Système SCI-Flocons",
      en: "SCI-Flake System",
    },
    shortDescription: {
      fr: "Flocons décoratifs pour garages, showrooms et commerces — le plus populaire",
      en: "Decorative flake for garages, showrooms, and retail — most popular",
    },
    description: {
      fr: "Le système SCI-Flocons est notre produit le plus populaire. Il combine une base époxy haute performance avec des flocons de vinyle décoratifs pour créer des surfaces magnifiques et durables. Disponible dans une vaste gamme de couleurs et de combinaisons.",
      en: "The SCI-Flake system is our most popular product. It combines a high-performance epoxy base with decorative vinyl flakes to create beautiful and durable surfaces. Available in a wide range of colors and combinations.",
    },
    applications: {
      fr: [
        "Garages résidentiels",
        "Showrooms",
        "Commerces de détail",
        "Sous-sols",
        "Salles d'exposition",
      ],
      en: [
        "Residential garages",
        "Showrooms",
        "Retail stores",
        "Basements",
        "Exhibition halls",
      ],
    },
    specs: {
      chemistry: "Epoxy + Vinyl Flake",
      thickness: "40-80 mils",
      cureTime: "12-16 hours",
      trafficReady: "24-48 hours",
    },
    features: {
      fr: [
        "Vaste choix de couleurs de flocons",
        "Dissimule les imperfections du béton",
        "Surface texturée antidérapante",
        "Résistant aux taches et produits chimiques",
      ],
      en: [
        "Wide selection of flake colors",
        "Hides concrete imperfections",
        "Textured anti-slip surface",
        "Stain and chemical resistant",
      ],
    },
    image: "/images/products/sci-flake.jpg",
  },
  {
    id: 6,
    slug: "sci-membrane-system",
    sciCode: "SCI-Membrane",
    category: "membrane",
    name: {
      fr: "Système SCI-Membrane",
      en: "SCI-Membrane System",
    },
    shortDescription: {
      fr: "Système d'imperméabilisation pour stationnements, balcons et zones humides",
      en: "Waterproofing system for parking, balconies, and wet areas",
    },
    description: {
      fr: "Le système SCI-Membrane offre une imperméabilisation complète et durable pour les surfaces exposées à l'eau et aux intempéries. Sa flexibilité lui permet de ponter les fissures et de résister aux mouvements structuraux.",
      en: "The SCI-Membrane system provides complete and durable waterproofing for surfaces exposed to water and weather. Its flexibility allows it to bridge cracks and resist structural movement.",
    },
    applications: {
      fr: [
        "Stationnements étagés",
        "Balcons et terrasses",
        "Toitures praticables",
        "Rampes d'accès",
        "Zones de lavage",
      ],
      en: [
        "Parking structures",
        "Balconies and terraces",
        "Accessible rooftops",
        "Access ramps",
        "Wash bays",
      ],
    },
    specs: {
      chemistry: "Polyurethane Membrane",
      thickness: "40-80 mils",
      cureTime: "8-12 hours",
      trafficReady: "24-48 hours",
    },
    features: {
      fr: [
        "Imperméabilisation complète",
        "Ponte les fissures jusqu'à 1/8\"",
        "Résistance UV",
        "Flexible — supporte les mouvements",
      ],
      en: [
        "Complete waterproofing",
        "Bridges cracks up to 1/8\"",
        "UV resistant",
        "Flexible — supports movement",
      ],
    },
    image: "/images/products/sci-membrane.jpg",
  },
  {
    id: 7,
    slug: "sci-metallic-system",
    sciCode: "SCI-Metallic",
    category: "metallic",
    name: {
      fr: "Système SCI-Métallique",
      en: "SCI-Metallic System",
    },
    shortDescription: {
      fr: "Époxy métallique luxueux pour showrooms et résidences haut de gamme",
      en: "Luxurious metallic epoxy for showrooms and high-end residences",
    },
    description: {
      fr: "Le système SCI-Métallique crée des planchers spectaculaires avec des effets 3D uniques de marbre, lave et vagues métalliques. Chaque installation est une œuvre d'art unique. Le choix premium pour les espaces où l'esthétique est primordiale.",
      en: "The SCI-Metallic system creates spectacular floors with unique 3D effects of marble, lava, and metallic waves. Each installation is a unique work of art. The premium choice for spaces where aesthetics are paramount.",
    },
    applications: {
      fr: [
        "Showrooms de luxe",
        "Résidences haut de gamme",
        "Halls d'hôtels",
        "Boutiques design",
        "Restaurants",
      ],
      en: [
        "Luxury showrooms",
        "High-end residences",
        "Hotel lobbies",
        "Designer boutiques",
        "Restaurants",
      ],
    },
    specs: {
      chemistry: "Metallic Epoxy",
      thickness: "12-20 mils",
      cureTime: "16-24 hours",
      trafficReady: "48-72 hours",
    },
    features: {
      fr: [
        "Effets 3D uniques à chaque installation",
        "Fini ultra-brillant miroir",
        "Palette de couleurs métalliques étendue",
        "Résistant aux taches et rayures",
      ],
      en: [
        "Unique 3D effects with every installation",
        "Ultra-glossy mirror finish",
        "Extended metallic color palette",
        "Stain and scratch resistant",
      ],
    },
    image: "/images/products/sci-metallic.jpg",
  },
  {
    id: 8,
    slug: "sci-op-system",
    sciCode: "SCI-OP",
    category: "overlay",
    name: {
      fr: "Système SCI-OP",
      en: "SCI-OP System",
    },
    shortDescription: {
      fr: "Recouvrement décoratif et polissage pour rénovation de surfaces existantes",
      en: "Decorative overlay and polish for existing surface renovation",
    },
    description: {
      fr: "Le système SCI-OP est la solution idéale pour rénover et transformer des surfaces de béton existantes sans démolition. Créez des effets de pierre naturelle, terrazzo ou béton poli à une fraction du coût.",
      en: "The SCI-OP system is the ideal solution for renovating and transforming existing concrete surfaces without demolition. Create natural stone, terrazzo, or polished concrete effects at a fraction of the cost.",
    },
    applications: {
      fr: [
        "Rénovation commerciale",
        "Halls d'entrée",
        "Patios et terrasses",
        "Allées de garage",
        "Planchers de sous-sol",
      ],
      en: [
        "Commercial renovation",
        "Entrance lobbies",
        "Patios and terraces",
        "Driveway floors",
        "Basement floors",
      ],
    },
    specs: {
      chemistry: "Polymer Overlay",
      thickness: "1/8\" - 3/8\"",
      cureTime: "12-24 hours",
      trafficReady: "24-48 hours",
    },
    features: {
      fr: [
        "Pas de démolition requise",
        "Effets pierre naturelle et terrazzo",
        "Peut être poli pour fini brillant",
        "Rénovation rapide et économique",
      ],
      en: [
        "No demolition required",
        "Natural stone and terrazzo effects",
        "Can be polished for glossy finish",
        "Quick and economical renovation",
      ],
    },
    image: "/images/products/sci-op.jpg",
  },
  {
    id: 9,
    slug: "sci-polyurea-flake-system",
    sciCode: "SCI-Polyurea",
    category: "polyurea",
    name: {
      fr: "Système SCI-Polyuréa Flocons",
      en: "SCI-Polyurea Flake System",
    },
    shortDescription: {
      fr: "Installation en 1 jour — cure rapide polyuréa avec flocons décoratifs",
      en: "1-day installation — fast-cure polyurea with decorative flakes",
    },
    description: {
      fr: "Le système SCI-Polyuréa Flocons révolutionne l'installation de planchers décoratifs. Grâce à la technologie polyuréa à cure ultra-rapide, votre garage ou commerce est prêt à utiliser le lendemain. Même esthétique que les systèmes époxy, vitesse en plus.",
      en: "The SCI-Polyurea Flake system revolutionizes decorative floor installation. With ultra-fast cure polyurea technology, your garage or retail space is ready to use the next day. Same aesthetics as epoxy systems, with added speed.",
    },
    applications: {
      fr: [
        "Garages résidentiels (1 jour)",
        "Commerces à fort trafic",
        "Installations rapides",
        "Projets avec délais serrés",
        "Condos et multi-logements",
      ],
      en: [
        "Residential garages (1 day)",
        "High-traffic retail",
        "Fast installations",
        "Tight deadline projects",
        "Condos and multi-unit",
      ],
    },
    specs: {
      chemistry: "Polyurea + Vinyl Flake",
      thickness: "40-80 mils",
      cureTime: "2-4 hours",
      trafficReady: "8-12 hours",
    },
    features: {
      fr: [
        "Cure en 2-4 heures",
        "Installation complète en 1 jour",
        "4x plus flexible que l'époxy",
        "Résistant aux UV — pas de jaunissement",
      ],
      en: [
        "Cures in 2-4 hours",
        "Complete installation in 1 day",
        "4x more flexible than epoxy",
        "UV resistant — no yellowing",
      ],
    },
    image: "/images/products/sci-polyurea.jpg",
  },
  {
    id: 10,
    slug: "sci-quartz-broadcast-system",
    sciCode: "SCI-Quartz-B",
    category: "quartz",
    name: {
      fr: "Système SCI-Quartz Broadcast",
      en: "SCI-Quartz Broadcast System",
    },
    shortDescription: {
      fr: "Quartz broadcast pour zones commerciales à très fort trafic",
      en: "Quartz broadcast for ultra high-traffic commercial zones",
    },
    description: {
      fr: "Le système SCI-Quartz Broadcast crée des surfaces ultra-résistantes en combinant des résines haute performance avec du quartz naturel coloré. Le choix de référence pour les environnements commerciaux et institutionnels à très fort trafic.",
      en: "The SCI-Quartz Broadcast system creates ultra-resistant surfaces by combining high-performance resins with colored natural quartz. The reference choice for commercial and institutional environments with very high traffic.",
    },
    applications: {
      fr: [
        "Hôpitaux et centres de santé",
        "Écoles et universités",
        "Centres commerciaux",
        "Aéroports",
        "Installations sportives",
      ],
      en: [
        "Hospitals and health centers",
        "Schools and universities",
        "Shopping centers",
        "Airports",
        "Sports facilities",
      ],
    },
    specs: {
      chemistry: "Epoxy/Urethane + Quartz",
      thickness: "60-125 mils",
      cureTime: "12-16 hours",
      trafficReady: "24-48 hours",
    },
    features: {
      fr: [
        "Résistance à l'abrasion maximale",
        "Variété de couleurs de quartz naturel",
        "Conforme USDA/FDA",
        "Durée de vie 15+ ans",
      ],
      en: [
        "Maximum abrasion resistance",
        "Variety of natural quartz colors",
        "USDA/FDA compliant",
        "15+ year lifespan",
      ],
    },
    image: "/images/products/sci-quartz-broadcast.jpg",
  },
  {
    id: 11,
    slug: "sci-quartz-trowel-system",
    sciCode: "SCI-Quartz-T",
    category: "quartz",
    name: {
      fr: "Système SCI-Quartz Truelle",
      en: "SCI-Quartz Trowel System",
    },
    shortDescription: {
      fr: "Quartz truelle sans joint pour applications lourdes et sans couture",
      en: "Seamless troweled quartz for heavy-duty applications",
    },
    description: {
      fr: "Le système SCI-Quartz Truelle produit une surface monolithique sans joint, idéale pour les environnements exigeant une hygiène absolue et une résistance mécanique supérieure. Application à la truelle pour une épaisseur et uniformité optimales.",
      en: "The SCI-Quartz Trowel system produces a seamless monolithic surface, ideal for environments demanding absolute hygiene and superior mechanical resistance. Trowel-applied for optimal thickness and uniformity.",
    },
    applications: {
      fr: [
        "Usines pharmaceutiques",
        "Transformation alimentaire",
        "Laboratoires de recherche",
        "Installations militaires",
        "Centres de données",
      ],
      en: [
        "Pharmaceutical plants",
        "Food processing",
        "Research laboratories",
        "Military installations",
        "Data centers",
      ],
    },
    specs: {
      chemistry: "Epoxy + Quartz Trowel",
      thickness: "1/4\" - 3/8\"",
      cureTime: "16-24 hours",
      trafficReady: "48-72 hours",
    },
    features: {
      fr: [
        "Surface monolithique sans joint",
        "Résistance aux impacts lourds",
        "Hygiène pharmaceutique",
        "Résistance chimique complète",
      ],
      en: [
        "Seamless monolithic surface",
        "Heavy impact resistance",
        "Pharmaceutical-grade hygiene",
        "Complete chemical resistance",
      ],
    },
    image: "/images/products/sci-quartz-trowel.jpg",
  },
  {
    id: 12,
    slug: "sci-slurry-system",
    sciCode: "SCI-Slurry",
    category: "epoxy",
    name: {
      fr: "Système SCI-Slurry",
      en: "SCI-Slurry System",
    },
    shortDescription: {
      fr: "Système slurry résistant aux produits chimiques pour environnements industriels",
      en: "Chemical-resistant slurry system for industrial environments",
    },
    description: {
      fr: "Le système SCI-Slurry est un revêtement de plancher à base de résine et d'agrégats fins, appliqué en couche épaisse pour créer une surface dense, non poreuse et hautement résistante aux produits chimiques. Conçu pour les environnements industriels agressifs.",
      en: "The SCI-Slurry system is a resin-and-fine-aggregate floor coating applied in thick layers to create a dense, non-porous surface highly resistant to chemicals. Designed for aggressive industrial environments.",
    },
    applications: {
      fr: [
        "Usines chimiques",
        "Salles de batteries",
        "Usines de traitement des eaux",
        "Installations de galvanoplastie",
        "Plateformes de chargement",
      ],
      en: [
        "Chemical plants",
        "Battery rooms",
        "Water treatment plants",
        "Electroplating facilities",
        "Loading docks",
      ],
    },
    specs: {
      chemistry: "Epoxy/Novolac + Aggregate",
      thickness: "1/8\" - 1/4\"",
      cureTime: "16-24 hours",
      trafficReady: "48-72 hours",
    },
    features: {
      fr: [
        "Résistance chimique de grade supérieur",
        "Surface dense non poreuse",
        "Résiste aux acides et solvants",
        "Application en épaisseur",
      ],
      en: [
        "Superior grade chemical resistance",
        "Dense non-porous surface",
        "Acid and solvent resistant",
        "Thick-build application",
      ],
    },
    image: "/images/products/sci-slurry.jpg",
  },
  {
    id: 13,
    slug: "sci-trowel-mortar-system",
    sciCode: "SCI-Mortar",
    category: "mortar",
    name: {
      fr: "Système SCI-Mortier Truelle",
      en: "SCI-Trowel Mortar System",
    },
    shortDescription: {
      fr: "Mortier époxy résistant aux impacts pour usines lourdes",
      en: "Impact-resistant epoxy mortar for heavy-duty factories",
    },
    description: {
      fr: "Le système SCI-Mortier Truelle est le revêtement le plus robuste de notre gamme. Ce mortier époxy à base d'agrégats grossiers est conçu pour résister aux impacts les plus violents, au trafic de chariots élévateurs et aux charges lourdes en continu.",
      en: "The SCI-Trowel Mortar system is the most robust coating in our lineup. This coarse-aggregate epoxy mortar is designed to withstand the most violent impacts, forklift traffic, and continuous heavy loads.",
    },
    applications: {
      fr: [
        "Usines lourdes",
        "Fonderies",
        "Zones de chariots élévateurs",
        "Quais de réception",
        "Installations minières",
      ],
      en: [
        "Heavy manufacturing",
        "Foundries",
        "Forklift zones",
        "Receiving docks",
        "Mining facilities",
      ],
    },
    specs: {
      chemistry: "Epoxy Mortar",
      thickness: "1/4\" - 1/2\"",
      cureTime: "16-24 hours",
      trafficReady: "48-72 hours",
    },
    features: {
      fr: [
        "Résistance aux impacts maximale",
        "Supporte le trafic de chariots élévateurs",
        "Répare et nivelle les bétons endommagés",
        "Épaisseur jusqu'à 1/2 pouce",
      ],
      en: [
        "Maximum impact resistance",
        "Withstands forklift traffic",
        "Repairs and levels damaged concrete",
        "Up to 1/2 inch thickness",
      ],
    },
    image: "/images/products/sci-mortar.jpg",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit)
    .concat(
      products
        .filter((p) => p.id !== product.id && p.category !== product.category)
        .slice(0, limit)
    )
    .slice(0, limit);
}
