"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, User, Mail, Lock, Phone, Building2, ArrowRight, CheckCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { LampEffect } from "@/components/ui/LampEffect";
import { cn } from "@/lib/cn";

type AuthMode = "login" | "register";

function InputField({
  icon: Icon,
  type = "text",
  ...props
}: {
  icon: typeof User;
  type?: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative group">
      <Icon
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors"
      />
      <input
        {...props}
        type={isPassword && showPassword ? "text" : type}
        className="w-full rounded-xl border border-border bg-surface/80 pl-11 pr-12 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all backdrop-blur-sm"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
}

export function AuthForms({ mode: initialMode = "login" }: { mode?: AuthMode }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(t(`errors.${data.error}` as Parameters<typeof t>[0]));
        return;
      }

      setSuccess(true);
      // Dispatch event so Navbar updates
      window.dispatchEvent(new CustomEvent("auth-change", { detail: data.user }));
      setTimeout(() => router.push("/"), 1000);
    } catch {
      setError(t("errors.SERVER_ERROR"));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <LampEffect className="min-h-screen bg-[#09090b] pt-32 pb-24">
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-success" />
            </div>
            <h1 className="font-[family-name:var(--font-cabinet)] text-3xl font-bold mb-3">
              {mode === "login" ? t("welcomeBack") : t("accountCreated")}
            </h1>
            <p className="text-muted">{t("redirecting")}</p>
          </motion.div>
        </Container>
      </LampEffect>
    );
  }

  return (
    <LampEffect className="min-h-screen bg-[#09090b] pt-32 pb-24">
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-[family-name:var(--font-cabinet)] text-4xl font-bold tracking-tight"
            >
              {mode === "login" ? t("loginTitle") : t("registerTitle")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-muted"
            >
              {mode === "login" ? t("loginSubtitle") : t("registerSubtitle")}
            </motion.p>
          </div>

          {/* Form card */}
          <SpotlightCard className="relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <InputField
                  icon={User}
                  name="name"
                  placeholder={t("form.name")}
                  value={form.name}
                  onChange={update("name")}
                  required
                />
              )}

              <InputField
                icon={Mail}
                type="email"
                name="email"
                placeholder={t("form.email")}
                value={form.email}
                onChange={update("email")}
                required
              />

              <InputField
                icon={Lock}
                type="password"
                name="password"
                placeholder={t("form.password")}
                value={form.password}
                onChange={update("password")}
                required
              />

              {mode === "register" && (
                <>
                  <InputField
                    icon={Phone}
                    type="tel"
                    name="phone"
                    placeholder={t("form.phone")}
                    value={form.phone}
                    onChange={update("phone")}
                  />
                  <InputField
                    icon={Building2}
                    name="company"
                    placeholder={t("form.company")}
                    value={form.company}
                    onChange={update("company")}
                  />
                </>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full rounded-xl bg-accent text-white font-medium py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer",
                  isLoading
                    ? "opacity-60"
                    : "hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
                )}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? t("form.login") : t("form.register")}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Switch mode */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted">
                {mode === "login" ? t("noAccount") : t("hasAccount")}{" "}
                <button
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setError("");
                  }}
                  className="text-accent font-medium hover:text-accent-hover transition-colors cursor-pointer"
                >
                  {mode === "login" ? t("createAccount") : t("loginInstead")}
                </button>
              </p>
            </div>
          </SpotlightCard>
        </motion.div>
      </Container>
    </LampEffect>
  );
}
