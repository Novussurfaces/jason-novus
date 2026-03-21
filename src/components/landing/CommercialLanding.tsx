"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Factory,
  Warehouse,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const inputClasses =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors";

const sectors = [
  { icon: Warehouse, key: "warehouse" },
  { icon: Building2, key: "commercial" },
  { icon: Factory, key: "industrial" },
  { icon: UtensilsCrossed, key: "food" },
];

export function CommercialLanding() {
  const locale = useLocale() as "fr" | "en";
  const isFr = locale === "fr";
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    surfaceArea: "",
    projectType: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "lp-commercial",
          locale,
        }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok)
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          surfaceArea: "",
          projectType: "",
          message: "",
        });
    } catch {
      setStatus("error");
    }
  };

  const sectorLabels: Record<string, { fr: string; en: string }> = {
    warehouse: { fr: "Entrepôts", en: "Warehouses" },
    commercial: { fr: "Commerces", en: "Retail" },
    industrial: { fr: "Usines", en: "Factories" },
    food: { fr: "Alimentaire", en: "Food Processing" },
  };

  const valueProps = isFr
    ? [
        {
          icon: ShieldCheck,
          title: "Qualité industrielle certifiée",
          desc: "Systèmes testés et certifiés USDA/FDA pour les environnements les plus exigeants.",
        },
        {
          icon: TrendingUp,
          title: "Rabais volume jusqu'à 15%",
          desc: "2 500+ pi² = -10%. 5 000+ pi² = -15%. Plus le projet est gros, plus vous économisez.",
        },
        {
          icon: Clock,
          title: "Livraison directe usine",
          desc: "Fabriqué à Montréal par SCI Coatings. Expédition directe, délais minimaux.",
        },
        {
          icon: Building2,
          title: "Support technique complet",
          desc: "Guides d'installation, fiches techniques, support téléphonique pour chaque système.",
        },
      ]
    : [
        {
          icon: ShieldCheck,
          title: "Certified industrial quality",
          desc: "Systems tested and USDA/FDA certified for the most demanding environments.",
        },
        {
          icon: TrendingUp,
          title: "Volume discounts up to 15%",
          desc: "2,500+ sq ft = -10%. 5,000+ sq ft = -15%. Bigger projects save more.",
        },
        {
          icon: Clock,
          title: "Direct factory delivery",
          desc: "Manufactured in Montreal by SCI Coatings. Direct shipping, minimal delays.",
        },
        {
          icon: Building2,
          title: "Complete technical support",
          desc: "Installation guides, data sheets, phone support for every system.",
        },
      ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-background to-background" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-20 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-[family-name:var(--font-cabinet)] text-xl font-bold">
              Novus<span className="text-accent ml-0.5">Epoxy</span>
            </span>
            <span className="ml-2 rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent">
              B2B
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left — Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-[family-name:var(--font-cabinet)] text-4xl font-bold tracking-tight sm:text-5xl leading-tight">
                {isFr ? (
                  <>
                    Revêtements de planchers{" "}
                    <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                      de grade industriel
                    </span>{" "}
                    pour votre entreprise
                  </>
                ) : (
                  <>
                    Industrial-grade floor coatings{" "}
                    <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                      for your business
                    </span>
                  </>
                )}
              </h1>

              <p className="mt-6 text-lg text-muted leading-relaxed">
                {isFr
                  ? "13 systèmes professionnels. Fabriqué à Montréal. Livré partout au Québec. Rabais volume disponibles."
                  : "13 professional systems. Made in Montreal. Delivered across Quebec. Volume discounts available."}
              </p>

              {/* Sectors */}
              <div className="mt-8 grid grid-cols-4 gap-3">
                {sectors.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.key}
                      className="text-center rounded-xl bg-card border border-border p-4"
                    >
                      <Icon size={24} className="text-accent mx-auto mb-2" />
                      <span className="text-xs font-medium text-muted">
                        {sectorLabels[s.key][locale]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Value Props */}
              <div className="mt-10 space-y-6">
                {valueProps.map((vp, i) => {
                  const Icon = vp.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{vp.title}</h3>
                        <p className="text-sm text-muted mt-0.5">{vp.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-8"
            >
              {status === "success" ? (
                <div className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center">
                  <CheckCircle size={48} className="text-success mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {isFr ? "Demande envoyée!" : "Request sent!"}
                  </h3>
                  <p className="text-muted">
                    {isFr
                      ? "Notre équipe commerciale vous contactera sous 24h."
                      : "Our sales team will contact you within 24h."}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4"
                >
                  <h2 className="text-xl font-semibold text-center mb-1">
                    {isFr ? "Soumission commerciale" : "Commercial Quote"}
                  </h2>
                  <p className="text-sm text-muted text-center mb-4">
                    {isFr
                      ? "Réponse de notre équipe B2B en 24h"
                      : "Response from our B2B team in 24h"}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder={isFr ? "Nom" : "Name"}
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                    <input
                      type="text"
                      name="company"
                      required
                      placeholder={isFr ? "Entreprise" : "Company"}
                      value={formData.company}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={isFr ? "Courriel professionnel" : "Business email"}
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder={isFr ? "Téléphone" : "Phone"}
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      name="projectType"
                      required
                      value={formData.projectType}
                      onChange={handleChange}
                      className={cn(inputClasses, "appearance-none")}
                    >
                      <option value="">{isFr ? "Type de projet" : "Project type"}</option>
                      <option value="commercial">{isFr ? "Commercial" : "Commercial"}</option>
                      <option value="industrial">{isFr ? "Industriel" : "Industrial"}</option>
                      <option value="food">{isFr ? "Alimentaire" : "Food processing"}</option>
                      <option value="warehouse">{isFr ? "Entrepôt" : "Warehouse"}</option>
                      <option value="institutional">{isFr ? "Institutionnel" : "Institutional"}</option>
                    </select>
                    <input
                      type="text"
                      name="surfaceArea"
                      placeholder={isFr ? "Superficie (pi²)" : "Area (sq ft)"}
                      value={formData.surfaceArea}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder={isFr ? "Détails du projet" : "Project details"}
                    value={formData.message}
                    onChange={handleChange}
                    className={cn(inputClasses, "resize-none")}
                  />

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-sm text-red-400">
                      <AlertCircle size={16} />
                      {isFr ? "Erreur, réessayez." : "Error, try again."}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full rounded-xl bg-accent text-white py-3.5 font-medium text-base flex items-center justify-center gap-2 hover:bg-accent-hover transition-all shadow-lg shadow-accent/25 cursor-pointer disabled:opacity-50"
                  >
                    {status === "sending"
                      ? isFr ? "Envoi..." : "Sending..."
                      : isFr ? "Demander une soumission commerciale" : "Request commercial quote"}
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          {isFr
            ? "© 2026 Novus Surfaces. Fabriqué au Canada. Livraison mondiale."
            : "© 2026 Novus Surfaces. Made in Canada. Worldwide delivery."}
        </p>
      </section>
    </div>
  );
}
