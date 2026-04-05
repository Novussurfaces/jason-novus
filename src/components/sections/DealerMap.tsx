"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MapPin, Search, Navigation, Phone, ExternalLink, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────
   Locations — add real dealers/installers here
   ───────────────────────────────────────────── */
const LOCATIONS = [
  {
    id: "sci-hq",
    lat: 45.5808,
    lon: -73.5632,
    type: "warehouse" as const,
    labelKey: "sciHQ",
  },
  {
    id: "novus-mtl",
    lat: 45.5017,
    lon: -73.5673,
    type: "office" as const,
    labelKey: "novusMTL",
  },
] as const;

/* ─────────────────────────────────────────────
   Google Maps Embed — 100% FREE, no billing
   Dark mode via CSS invert hack
   ───────────────────────────────────────────── */
function DarkGoogleMap({
  lat,
  lon,
  zoom = 10,
  query,
  className,
}: {
  lat: number;
  lon: number;
  zoom?: number;
  query?: string;
  className?: string;
}) {
  const src = query
    ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`
    : `https://www.google.com/maps?q=${lat},${lon}&z=${zoom}&output=embed`;

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <div
        className="relative h-full w-full"
        style={{
          filter:
            "invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.85) saturate(0.3)",
        }}
      >
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: "400px" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Novus Epoxy Map"
        />
      </div>
      {/* Simple border — no heavy vignette */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/[0.06]" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Nominatim geocoding — FREE, no API key
   ───────────────────────────────────────────── */
interface GeoResult {
  lat: string;
  lon: string;
  display_name: string;
}

async function geocodeAddress(query: string): Promise<GeoResult | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=ca,us,fr,gb,de`,
      { headers: { "User-Agent": "NovusEpoxy/1.0" } }
    );
    const data: GeoResult[] = await res.json();
    return data[0] ?? null;
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────
   Distance calculation (Haversine)
   ───────────────────────────────────────────── */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
export function DealerMap() {
  const t = useTranslations("dealerMap");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 45.5017, lon: -73.5673 });
  const [mapZoom, setMapZoom] = useState(6);
  const [mapQuery, setMapQuery] = useState<string | undefined>();
  const [distances, setDistances] = useState<Record<string, number>>({});
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async () => {
    if (!search.trim()) return;
    setSearching(true);
    setSearched(false);

    const result = await geocodeAddress(search);
    if (result) {
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      setMapCenter({ lat, lon });
      setMapZoom(11);
      setMapQuery(search);

      const newDistances: Record<string, number> = {};
      LOCATIONS.forEach((loc) => {
        newDistances[loc.id] = haversineKm(lat, lon, loc.lat, loc.lon);
      });
      setDistances(newDistances);
      setSearched(true);
    }
    setSearching(false);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const sortedLocations = searched
    ? [...LOCATIONS].sort(
        (a, b) => (distances[a.id] ?? 9999) - (distances[b.id] ?? 9999)
      )
    : LOCATIONS;

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <Container className="relative z-10">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        {/* Search bar — centered, clean */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-10 max-w-2xl"
        >
          <div className="flex items-center overflow-hidden rounded-xl border border-white/[0.08] bg-card transition-colors duration-300 focus-within:border-accent/30">
            <Search size={18} className="ml-4 shrink-0 text-muted/50" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent px-3 py-4 text-sm text-foreground placeholder:text-muted/40 outline-none"
            />
            <button
              onClick={handleSearch}
              disabled={searching || !search.trim()}
              className={cn(
                "mr-2 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors duration-300",
                "hover:bg-accent-hover",
                "disabled:cursor-not-allowed disabled:opacity-40"
              )}
            >
              {searching ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                t("searchButton")
              )}
            </button>
          </div>
        </motion.div>

        {/* Map + locations grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Map — takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <DarkGoogleMap
              lat={mapCenter.lat}
              lon={mapCenter.lon}
              zoom={mapZoom}
              query={mapQuery}
              className="h-[400px] lg:h-[500px]"
            />
          </motion.div>

          {/* Location cards — simple list, no AnimatePresence popLayout */}
          <div className="space-y-4">
            {sortedLocations.map((loc, i) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              >
                <div className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors duration-300 hover:border-accent/20">
                  <div className="flex items-start gap-3">
                    {/* Pin icon */}
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                        loc.type === "warehouse"
                          ? "border-amber-500/20 bg-amber-500/10"
                          : "border-accent/20 bg-accent/10"
                      )}
                    >
                      <MapPin
                        size={18}
                        className={
                          loc.type === "warehouse"
                            ? "text-amber-400"
                            : "text-accent"
                        }
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                        {t(`locations.${loc.labelKey}.name`)}
                      </h4>
                      <p className="mt-0.5 truncate text-xs text-muted/60">
                        {t(`locations.${loc.labelKey}.address`)}
                      </p>

                      {/* Distance badge — shows after search */}
                      {distances[loc.id] !== undefined && (
                        <div className="mt-2 flex items-center gap-2">
                          <Navigation size={12} className="text-accent" />
                          <span className="text-xs font-medium text-accent">
                            {distances[loc.id] < 1
                              ? "< 1 km"
                              : `${Math.round(distances[loc.id]!)} km`}
                          </span>
                        </div>
                      )}

                      {/* Contact info */}
                      <div className="mt-2 flex items-center gap-3">
                        <a
                          href={`tel:${t(`locations.${loc.labelKey}.phone`)}`}
                          className="flex items-center gap-1 text-xs text-muted/50 transition-colors hover:text-accent"
                        >
                          <Phone size={10} />
                          {t(`locations.${loc.labelKey}.phone`)}
                        </a>
                      </div>
                    </div>

                    {/* Direction link */}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] transition-colors hover:border-accent/30 hover:bg-accent/10"
                    >
                      <ExternalLink size={12} className="text-muted/50" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* "Become a dealer" CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <a
                href="/soumission"
                className="block rounded-xl border border-dashed border-white/[0.08] py-3 text-center text-sm text-muted/50 transition-colors duration-300 hover:border-accent/30 hover:text-accent"
              >
                {t("becomeDealer")}
              </a>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
