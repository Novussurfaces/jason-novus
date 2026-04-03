"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Search,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

/* ──────────────────────────────────────────────
   TYPES
   ────────────────────────────────────────────── */
type WeatherData = {
  temperature: number;
  humidity: number;
  precipitationProbability: number;
  windSpeed: number;
  locationName: string;
};

type CuringStatus = "ideal" | "caution" | "unfavorable";

/* ──────────────────────────────────────────────
   STATUS LOGIC
   ────────────────────────────────────────────── */
function evaluateConditions(data: WeatherData): CuringStatus {
  const { temperature, humidity, precipitationProbability } = data;

  if (temperature < 5 || humidity > 90 || precipitationProbability > 60) {
    return "unfavorable";
  }

  if (temperature > 10 && humidity < 80 && precipitationProbability < 20) {
    return "ideal";
  }

  return "caution";
}

/* ──────────────────────────────────────────────
   STATUS CONFIG
   ────────────────────────────────────────────── */
const STATUS_CONFIG: Record<
  CuringStatus,
  {
    color: string;
    bgColor: string;
    borderColor: string;
    dotColor: string;
    Icon: typeof CheckCircle2;
    labelKey: string;
  }
> = {
  ideal: {
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
    dotColor: "bg-success",
    Icon: CheckCircle2,
    labelKey: "statusIdeal",
  },
  caution: {
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
    dotColor: "bg-warning",
    Icon: AlertTriangle,
    labelKey: "statusCaution",
  },
  unfavorable: {
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    dotColor: "bg-red-500",
    Icon: XCircle,
    labelKey: "statusUnfavorable",
  },
};

/* ──────────────────────────────────────────────
   METRIC CARD — clean: icon, value, label
   ────────────────────────────────────────────── */
function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  status,
  delay,
}: {
  icon: typeof Thermometer;
  label: string;
  value: number;
  unit: string;
  status: CuringStatus;
  delay: number;
}) {
  const config = STATUS_CONFIG[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div
        className={cn(
          "rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5",
          "transition-colors duration-300",
          "hover:border-accent/20"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              {label}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {Math.round(value)}
              </span>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
          </div>
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              config.bgColor
            )}
          >
            <Icon size={20} className={config.color} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────── */
export function CuringConditions() {
  const t = useTranslations("curingConditions");
  const [postalCode, setPostalCode] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(
    async (code: string) => {
      if (!code.trim()) return;

      setLoading(true);
      setError(null);
      setWeather(null);

      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            code.trim()
          )}+Canada&format=json&limit=1`,
          {
            headers: {
              "User-Agent": "NovusSurfaces/1.0 (info@novusepoxy.ca)",
            },
          }
        );

        if (!geoRes.ok) throw new Error("GEO_FAIL");

        const geoData = await geoRes.json();
        if (!geoData || geoData.length === 0) {
          setError(t("errorNotFound"));
          setLoading(false);
          return;
        }

        const { lat, lon, display_name } = geoData[0];
        const locationName =
          display_name?.split(",").slice(0, 2).join(",").trim() || code;

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m&forecast_days=1&timezone=America/Montreal`
        );

        if (!weatherRes.ok) throw new Error("WEATHER_FAIL");

        const weatherJson = await weatherRes.json();
        const hourly = weatherJson.hourly;

        if (!hourly) throw new Error("WEATHER_FAIL");

        const now = new Date();
        const currentHour = now.getHours();
        const idx = Math.min(currentHour, hourly.temperature_2m.length - 1);

        const maxPrecip = Math.max(...hourly.precipitation_probability);

        setWeather({
          temperature: hourly.temperature_2m[idx],
          humidity: hourly.relative_humidity_2m[idx],
          precipitationProbability: maxPrecip,
          windSpeed: hourly.wind_speed_10m[idx],
          locationName,
        });
      } catch {
        setError(t("errorGeneric"));
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(postalCode);
  };

  const status = weather ? evaluateConditions(weather) : null;
  const statusConfig = status ? STATUS_CONFIG[status] : null;

  return (
    <section className="relative py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 sm:mb-14"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
              <Thermometer size={14} className="text-accent" />
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                {t("badge")}
              </span>
            </div>

            <h2 className="font-[family-name:var(--font-cabinet)] text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8"
          >
            {/* Search form — centered, constrained width */}
            <form onSubmit={handleSubmit} className="mx-auto max-w-md">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <MapPin
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                  />
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                    placeholder={t("placeholder")}
                    maxLength={7}
                    className={cn(
                      "w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3.5 pl-11 pr-4",
                      "text-sm text-foreground placeholder:text-muted-foreground/50",
                      "transition-colors duration-300",
                      "focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                      "font-mono tracking-widest"
                    )}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !postalCode.trim()}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-6 py-3.5",
                    "bg-accent font-medium text-white transition-colors duration-300",
                    "hover:bg-accent-hover",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Search size={18} />
                  )}
                  <span className="hidden sm:inline">{t("search")}</span>
                </button>
              </div>
            </form>

            {/* Error */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mx-auto mt-4 flex max-w-md items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400"
                >
                  <XCircle size={16} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading skeleton */}
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 space-y-6"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-5 w-5 animate-pulse rounded-full bg-white/10" />
                    <div className="h-6 w-48 animate-pulse rounded-lg bg-white/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-24 animate-pulse rounded-xl bg-white/[0.03]"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence mode="wait">
              {weather && status && statusConfig && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                  className="mt-8 space-y-6"
                >
                  {/* Status banner — simple solid badge */}
                  <div
                    className={cn(
                      "rounded-xl border p-5 sm:p-6",
                      statusConfig.borderColor,
                      statusConfig.bgColor
                    )}
                  >
                    <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "inline-block h-3 w-3 rounded-full",
                            statusConfig.dotColor
                          )}
                        />
                        <statusConfig.Icon
                          size={24}
                          className={statusConfig.color}
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={cn(
                            "font-[family-name:var(--font-cabinet)] text-lg font-bold sm:text-xl",
                            statusConfig.color
                          )}
                        >
                          {t(statusConfig.labelKey)}
                        </h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {t(`statusDesc_${status}`)}
                        </p>
                      </div>
                    </div>

                    {/* Location tag */}
                    <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:justify-start">
                      <MapPin size={12} />
                      <span>{weather.locationName}</span>
                    </div>
                  </div>

                  {/* Metrics grid — centered, equal width */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <MetricCard
                      icon={Thermometer}
                      label={t("metricTemp")}
                      value={weather.temperature}
                      unit="°C"
                      status={
                        weather.temperature > 10
                          ? "ideal"
                          : weather.temperature >= 5
                            ? "caution"
                            : "unfavorable"
                      }
                      delay={0.1}
                    />
                    <MetricCard
                      icon={Droplets}
                      label={t("metricHumidity")}
                      value={weather.humidity}
                      unit="%"
                      status={
                        weather.humidity < 80
                          ? "ideal"
                          : weather.humidity <= 90
                            ? "caution"
                            : "unfavorable"
                      }
                      delay={0.15}
                    />
                    <MetricCard
                      icon={CloudRain}
                      label={t("metricPrecip")}
                      value={weather.precipitationProbability}
                      unit="%"
                      status={
                        weather.precipitationProbability < 20
                          ? "ideal"
                          : weather.precipitationProbability <= 60
                            ? "caution"
                            : "unfavorable"
                      }
                      delay={0.2}
                    />
                    <MetricCard
                      icon={Wind}
                      label={t("metricWind")}
                      value={weather.windSpeed}
                      unit="km/h"
                      status={
                        weather.windSpeed < 30
                          ? "ideal"
                          : weather.windSpeed <= 50
                            ? "caution"
                            : "unfavorable"
                      }
                      delay={0.25}
                    />
                  </div>

                  {/* Refresh / tip */}
                  <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <p className="text-xs text-muted-foreground/60">
                      {t("tip")}
                    </p>
                    <button
                      onClick={() => fetchWeather(postalCode)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-accent-hover"
                    >
                      <RefreshCw size={12} />
                      {t("refresh")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state */}
            {!weather && !loading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-col items-center gap-3 py-6 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                  <CloudRain size={24} className="text-muted-foreground/40" />
                </div>
                <p className="max-w-xs text-sm text-muted-foreground/60">
                  {t("emptyState")}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center text-xs text-muted-foreground/40"
          >
            {t("disclaimer")}
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
