"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { User, LogOut, MessageSquare, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

type UserData = {
  id: string;
  name: string;
  email: string;
};

export function AuthButton() {
  const t = useTranslations("auth");
  const [user, setUser] = useState<UserData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});

    const handleAuthChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) setUser(detail);
      else setUser(null);
    };
    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("auth-change", { detail: null }));
  };

  if (!user) {
    return (
      <Link
        href="/connexion"
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card"
      >
        <User size={16} />
        <span className="hidden lg:inline">{t("login")}</span>
      </Link>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
          isOpen ? "bg-card text-foreground" : "text-muted hover:text-foreground hover:bg-card"
        )}
      >
        <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
          <span className="text-xs font-bold text-accent">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden lg:inline max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
        <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-xl shadow-black/20 overflow-hidden z-50"
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted truncate">{user.email}</p>
            </div>

            {/* Links */}
            <div className="py-1.5">
              <Link
                href="/connexion"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-surface transition-colors"
              >
                <MessageSquare size={15} />
                {t("myConversations")}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-surface transition-colors cursor-pointer"
              >
                <LogOut size={15} />
                {t("logout")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
