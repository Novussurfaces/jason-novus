"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import {
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  CheckCircle,
  Star,
  Send,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const inputClasses =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors";

export function GarageLanding() {
  const locale = useLocale() as "fr" | "en";
  const isFr = locale === "fr";
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    surfaceArea: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
          source: "lp-garage",
          projectType: "garage",
          locale,
        }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setFormData({ name: "", email: "", phone: "", surfaceArea: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const benefits = isFr
    ? [
        "Résiste au sel et au calcium québécois",
        "Fini antidérapant et facile à nettoyer",
        "Protection contre l'huile, le sel et les produits chimiques",
        "Transforme votre garage en espace de vie",
        "Durée de vie de 15+ ans",
        "Installation en 1 jour (polyuréa)",
      ]
    : [
        "Resists Quebec's salt and calcium",
        "Anti-slip and easy-to-clean finish",
        "Protection against oil, salt, and chemicals",
        "Transforms your garage into living space",
        "15+ year lifespan",
        "1-day installation (polyurea)",
      ];

  const testimonials = [
    {
      name: "Martin L.",
      location: "Laval",
      text: isFr
        ? "Mon garage a survécu à 2 hivers sans une seule marque. Le sel ne fait rien. Impressionnant."
        : "My garage survived 2 winters without a single mark. Salt does nothing. Impressive.",
    },
    {
      name: "Sophie B.",
      location: "Longueuil",
      text: isFr
        ? "On a fait notre garage double en 1 jour avec la polyuréa. Le lendemain le char était dessus. Parfait."
        : "We did our double garage in 1 day with polyurea. Next day the car was on it. Perfect.",
    },
    {
      name: "Jean-François R.",
      location: "Québec",
      text: isFr
        ? "3 ans plus tard, le plancher est encore comme neuf. Meilleur investissement pour la maison."
        : "3 years later, the floor still looks brand new. Best home investment.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-20 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-[family-name:var(--font-cabinet)] text-xl font-bold">
              Novus<span className="text-accent ml-0.5">Epoxy</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                <Shield size={16} />
                {isFr ? "Fabriqué au Canada" : "Made in Canada"}
              </span>

              <h1 className="font-[family-name:var(--font-cabinet)] text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
                {isFr ? (
                  <>
                    Votre garage mérite un plancher qui{" "}
                    <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                      résiste au sel québécois
                    </span>
                  </>
                ) : (
                  <>
                    Your garage deserves a floor that{" "}
                    <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                      resists Quebec's salt
                    </span>
                  </>
                )}
              </h1>

              <p className="mt-6 text-lg text-muted leading-relaxed">
                {isFr
                  ? "Revêtement époxy professionnel à partir de 3 $/pi². Installation disponible en 1 jour. Garanti contre le sel, le calcium et les produits chimiques."
                  : "Professional epoxy coating starting at $3/sq ft. 1-day installation available. Guaranteed against salt, calcium, and chemicals."}
              </p>

              {/* Benefits */}
              <ul className="mt-8 space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm">
                    <CheckCircle size={18} className="text-success shrink-0 mt-0.5" />
                    <span className="text-muted">{b}</span>
                  </li>
                ))}
              </ul>

              {/* Quick stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center rounded-xl bg-card border border-border p-3">
                  <div className="text-2xl font-bold font-[family-name:var(--font-cabinet)]">3$</div>
                  <div className="text-xs text-muted">{isFr ? "/pi² min" : "/sq ft min"}</div>
                </div>
                <div className="text-center rounded-xl bg-card border border-border p-3">
                  <div className="text-2xl font-bold font-[family-name:var(--font-cabinet)]">1</div>
                  <div className="text-xs text-muted">{isFr ? "jour install" : "day install"}</div>
                </div>
                <div className="text-center rounded-xl bg-card border border-border p-3">
                  <div className="text-2xl font-bold font-[family-name:var(--font-cabinet)]">15+</div>
                  <div className="text-xs text-muted">{isFr ? "ans durée" : "year lifespan"}</div>
                </div>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {status === "success" ? (
                <div className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center">
                  <CheckCircle size={48} className="text-success mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {isFr ? "Demande envoyée!" : "Request sent!"}
                  </h3>
                  <p className="text-muted">
                    {isFr
                      ? "Nous vous contacterons dans les 24 prochaines heures."
                      : "We'll contact you within 24 hours."}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4"
                >
                  <h2 className="text-xl font-semibold text-center mb-2">
                    {isFr ? "Soumission gratuite en 24h" : "Free quote in 24h"}
                  </h2>
                  <p className="text-sm text-muted text-center mb-4">
                    {isFr
                      ? "Recevez une estimation de prix sans engagement"
                      : "Get a no-obligation price estimate"}
                  </p>

                  <input
                    type="text"
                    name="name"
                    required
                    placeholder={isFr ? "Nom complet" : "Full name"}
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={isFr ? "Courriel" : "Email"}
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
                  <input
                    type="text"
                    name="surfaceArea"
                    placeholder={isFr ? "Superficie garage (pi²)" : "Garage area (sq ft)"}
                    value={formData.surfaceArea}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                  <textarea
                    name="message"
                    rows={3}
                    placeholder={isFr ? "Détails du projet (optionnel)" : "Project details (optional)"}
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
                      : isFr ? "Obtenir ma soumission gratuite" : "Get my free quote"}
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-cabinet)] text-2xl font-bold text-center mb-10">
            {isFr ? "Ce que nos clients disent" : "What our clients say"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted leading-relaxed mb-4">"{t.text}"</p>
                <p className="text-sm font-medium">
                  {t.name} — <span className="text-muted">{t.location}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 text-center">
        <p className="text-sm text-muted-foreground">
          {isFr
            ? "© 2026 Novus Surfaces. Fabriqué au Canada. Livraison mondiale."
            : "© 2026 Novus Surfaces. Made in Canada. Worldwide delivery."}
        </p>
      </section>
    </div>
  );
}
