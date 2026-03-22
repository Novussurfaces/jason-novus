"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const navLinks = [
  { href: "/", label: "home" },
  { href: "/produits", label: "products" },
  { href: "/calculateur", label: "calculator" },
  { href: "/realisations", label: "portfolio" },
  { href: "/a-propos", label: "about" },
  { href: "/contact", label: "contact" },
] as const;

/* ── Hamburger line variants for the X animation ── */
const topLine = {
  closed: { rotate: 0, y: 0 },
  open: { rotate: 45, y: 7 },
};
const middleLine = {
  closed: { opacity: 1, scaleX: 1 },
  open: { opacity: 0, scaleX: 0 },
};
const bottomLine = {
  closed: { rotate: 0, y: 0 },
  open: { rotate: -45, y: -7 },
};

/* ── Mobile menu slide-in variants ── */
const mobileMenuVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 30 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.25, ease: "easeIn" as const },
  },
};

const mobileLinkVariants = {
  hidden: { x: 40, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: 0.08 * i, type: "spring" as const, stiffness: 300, damping: 24 },
  }),
};

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/60 backdrop-blur-2xl shadow-lg shadow-black/10"
            : "bg-transparent"
        )}
      >
        {/* Scrolled top border gradient */}
        {isScrolled && (
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.2) 50%, transparent 100%)",
            }}
          />
        )}

        <Container>
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 group relative">
              <motion.div
                className="relative rounded-lg"
                whileHover={{
                  boxShadow: "0 0 20px rgba(37,99,235,0.4), 0 0 40px rgba(37,99,235,0.15)",
                }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/logo-icon.svg"
                  alt="Novus Surfaces"
                  width={36}
                  height={36}
                  className="transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </motion.div>
              <span className="font-[family-name:var(--font-cabinet)] text-xl font-bold tracking-tight">
                Novus
                <span className="text-accent ml-0.5">Surfaces</span>
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 group"
                  >
                    {/* Active gradient glow */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-glow"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background:
                            "radial-gradient(ellipse at center, rgba(37,99,235,0.15) 0%, transparent 70%)",
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

                    <span
                      className={cn(
                        "relative z-10 transition-colors duration-200",
                        isActive
                          ? "text-foreground"
                          : "text-muted group-hover:text-foreground"
                      )}
                    >
                      {t(link.label)}
                    </span>

                    {/* Animated underline on hover & active */}
                    {isActive ? (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    ) : (
                      <span className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── Desktop Actions ── */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher />
              <MagneticButton>
                <Button
                  href="/soumission"
                  size="sm"
                  className="relative overflow-hidden group/cta"
                >
                  {/* Shimmer sweep */}
                  <span className="absolute inset-0 pointer-events-none">
                    <span
                      className="absolute inset-0 -translate-x-full animate-shimmer"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
                      }}
                    />
                  </span>
                  <span className="relative z-10">{t("getQuote")}</span>
                </Button>
              </MagneticButton>
            </div>

            {/* ── Mobile Hamburger ── */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative z-[60] p-2 rounded-lg text-muted hover:text-foreground transition-colors cursor-pointer"
              aria-label="Toggle menu"
              animate={isOpen ? "open" : "closed"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="overflow-visible">
                <motion.line
                  x1="4" y1="5" x2="20" y2="5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  variants={topLine}
                  style={{ originX: "12px", originY: "5px" }}
                />
                <motion.line
                  x1="4" y1="12" x2="20" y2="12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  variants={middleLine}
                />
                <motion.line
                  x1="4" y1="19" x2="20" y2="19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  variants={bottomLine}
                  style={{ originX: "12px", originY: "19px" }}
                />
              </svg>
            </motion.button>
          </nav>
        </Container>
      </header>

      {/* ── Mobile Menu (slide from right with blur backdrop) ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 z-[56] w-[80vw] max-w-sm bg-background/95 backdrop-blur-2xl border-l border-border md:hidden overflow-y-auto"
            >
              <div className="pt-24 pb-8 px-6 space-y-2">
                {navLinks.map((link, i) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      custom={i}
                      variants={mobileLinkVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "block px-4 py-3.5 rounded-xl text-base font-medium transition-colors relative overflow-hidden",
                          isActive
                            ? "text-foreground bg-accent/10 border border-accent/20"
                            : "text-muted hover:text-foreground hover:bg-card"
                        )}
                      >
                        {isActive && (
                          <span
                            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-accent"
                          />
                        )}
                        {t(link.label)}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  custom={navLinks.length}
                  variants={mobileLinkVariants}
                  initial="hidden"
                  animate="visible"
                  className="pt-6 flex items-center gap-3 px-2"
                >
                  <LanguageSwitcher />
                  <Button
                    href="/soumission"
                    size="sm"
                    className="relative flex-1 overflow-hidden"
                  >
                    <span className="absolute inset-0 pointer-events-none">
                      <span
                        className="absolute inset-0 -translate-x-full animate-shimmer"
                        style={{
                          background:
                            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
                        }}
                      />
                    </span>
                    <span className="relative z-10">{t("getQuote")}</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
