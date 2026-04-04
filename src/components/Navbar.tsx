"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CurrencySelector } from "@/components/ui/CurrencySelector";
import { ChevronDown, ArrowRight } from "lucide-react";

/* ── Product categories for dropdown ── */
const productCategories = [
  { key: "epoxy", href: "/produits?cat=epoxy" },
  { key: "polyurea", href: "/produits?cat=polyurea" },
  { key: "metallic", href: "/produits?cat=metallic" },
  { key: "quartz", href: "/produits?cat=quartz" },
  { key: "polyurethane", href: "/produits?cat=polyurethane" },
  { key: "membrane", href: "/produits?cat=membrane" },
] as const;

/* ── Main nav links (Products handled separately with dropdown) ── */
const navLinks = [
  { href: "/", label: "home" },
  { href: "/calculateur", label: "calculator" },
  { href: "/realisations", label: "portfolio" },
  { href: "/installation", label: "installation" },
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

/* ── Mobile menu: full-screen overlay ── */
const mobileMenuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

/* ── Mobile links: staggered fade-up ── */
const mobileLinkVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i + 0.15, duration: 0.35, ease: "easeOut" as const },
  }),
};

/* ── Dropdown animation ── */
const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: 8,
    scale: 0.96,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    y: 4,
    scale: 0.98,
    filter: "blur(2px)",
    transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Scroll-based bottom border opacity ── */
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ── Dropdown hover handlers with delay ── */
  const openDropdown = useCallback(() => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isProductsActive = pathname.startsWith("/produits");

  /* ── All mobile links including Products and its sub-items ── */
  const allMobileLinks = [
    { href: "/" as const, label: "home" },
    { href: "/produits" as const, label: "products", hasChildren: true },
    { href: "/calculateur" as const, label: "calculator" },
    { href: "/realisations" as const, label: "portfolio" },
    { href: "/installation" as const, label: "installation" },
    { href: "/a-propos" as const, label: "about" },
    { href: "/contact" as const, label: "contact" },
  ];

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
          isScrolled
            ? "bg-background/80 backdrop-blur-2xl shadow-[0_1px_24px_rgba(0,0,0,0.25)]"
            : "bg-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Bottom border -- fades in on scroll */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
          style={{ opacity: borderOpacity }}
        />

        <Container>
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 group relative shrink-0">
              <div className="relative rounded-lg">
                <Image
                  src="/logo-icon.svg"
                  alt="Novus Surfaces"
                  width={36}
                  height={36}
                  className="relative z-10 transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <span className="font-[family-name:var(--font-cabinet)] text-xl font-bold tracking-tight text-foreground">
                Novus
                <span className="text-accent ml-0.5">Surfaces</span>
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {/* Home link */}
              <DesktopLink href="/" label={t("home")} isActive={pathname === "/"} />

              {/* Products with dropdown */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                <Link
                  href="/produits"
                  className="relative px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 group inline-flex items-center gap-1"
                >
                  <span
                    className={cn(
                      "relative z-10 transition-colors duration-200",
                      isProductsActive
                        ? "text-accent"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {t("products")}
                  </span>
                  <ChevronDown
                    size={12}
                    className={cn(
                      "transition-all duration-200",
                      isProductsActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground",
                      dropdownOpen && "rotate-180"
                    )}
                  />
                  {/* Gold underline */}
                  <span
                    className={cn(
                      "absolute bottom-0.5 left-3 right-3 h-px rounded-full bg-accent transition-transform duration-300 origin-center",
                      isProductsActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>

                {/* ── Products Dropdown ── */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                    >
                      <div
                        className={cn(
                          "w-[280px] rounded-2xl overflow-hidden",
                          "backdrop-blur-2xl bg-background/95",
                          "border border-white/[0.08]",
                          "shadow-2xl shadow-black/40",
                          "p-2"
                        )}
                      >
                        {/* Category links */}
                        {productCategories.map((cat) => (
                          <Link
                            key={cat.key}
                            href="/produits"
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                              "text-sm text-muted-foreground",
                              "transition-all duration-200",
                              "hover:bg-white/[0.06] hover:text-foreground"
                            )}
                          >
                            {/* Category dot indicator */}
                            <span className="w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0" />
                            <span>{t(`productCategories.${cat.key}`)}</span>
                          </Link>
                        ))}

                        {/* Divider */}
                        <div className="mx-3 my-2 h-px bg-white/[0.06]" />

                        {/* View all products */}
                        <Link
                          href="/produits"
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-xl",
                            "text-sm font-medium text-accent",
                            "transition-all duration-200",
                            "hover:bg-accent/[0.08]",
                            "group/all"
                          )}
                        >
                          <span>{t("productCategories.viewAll")}</span>
                          <ArrowRight
                            size={14}
                            className="transition-transform duration-200 group-hover/all:translate-x-0.5"
                          />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other nav links */}
              {navLinks.slice(1).map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <DesktopLink
                    key={link.href}
                    href={link.href}
                    label={t(link.label)}
                    isActive={isActive}
                  />
                );
              })}
            </div>

            {/* ── Desktop Actions ── */}
            <div className="hidden lg:flex items-center gap-3">
              <CurrencySelector compact />
              <LanguageSwitcher />
              <MagneticButton>
                <Button
                  href="/soumission"
                  size="md"
                  className="relative overflow-hidden group/cta"
                >
                  {/* Shimmer sweep on hover */}
                  <span className="absolute inset-0 pointer-events-none opacity-0 group-hover/cta:opacity-100 transition-opacity duration-200">
                    <span
                      className="absolute inset-0 -translate-x-full group-hover/cta:animate-shimmer"
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
              className="lg:hidden relative z-[60] p-2 rounded-lg text-muted hover:text-foreground transition-colors cursor-pointer"
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
      </motion.header>

      {/* ── Mobile Menu: Full-screen glass overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[55] bg-background/90 backdrop-blur-2xl lg:hidden"
          >
            {/* Subtle radial glow at top center */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.07] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, #C9A84C 0%, transparent 70%)",
              }}
            />

            <div className="flex flex-col items-center justify-center h-full px-8">
              <div className="w-full max-w-sm space-y-1">
                {allMobileLinks.map((link, i) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  if (link.hasChildren) {
                    return (
                      <motion.div
                        key={link.href}
                        custom={i}
                        variants={mobileLinkVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {/* Products parent */}
                        <button
                          onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                          className={cn(
                            "flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-lg font-medium transition-all duration-200 relative overflow-hidden cursor-pointer",
                            isActive
                              ? "text-accent bg-accent/[0.08]"
                              : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                          )}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="mobile-active-indicator"
                              className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-accent"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                          <span className="font-[family-name:var(--font-cabinet)]">
                            {t(link.label)}
                          </span>
                          <ChevronDown
                            size={18}
                            className={cn(
                              "transition-transform duration-200",
                              mobileProductsOpen && "rotate-180"
                            )}
                          />
                        </button>

                        {/* Mobile product sub-links */}
                        <AnimatePresence>
                          {mobileProductsOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pl-8 py-1 space-y-0.5">
                                {productCategories.map((cat) => (
                                  <Link
                                    key={cat.key}
                                    href="/produits"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
                                  >
                                    <span className="w-1 h-1 rounded-full bg-accent/50" />
                                    {t(`productCategories.${cat.key}`)}
                                  </Link>
                                ))}
                                <Link
                                  href="/produits"
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-accent hover:bg-accent/[0.06] transition-colors"
                                >
                                  <ArrowRight size={12} />
                                  {t("productCategories.viewAll")}
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }

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
                          "flex items-center gap-3 px-5 py-3.5 rounded-xl text-lg font-medium transition-all duration-200 relative overflow-hidden",
                          isActive
                            ? "text-accent bg-accent/[0.08]"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="mobile-active-indicator"
                            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-accent"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="font-[family-name:var(--font-cabinet)]">
                          {t(link.label)}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* CTA + selectors */}
                <motion.div
                  custom={allMobileLinks.length}
                  variants={mobileLinkVariants}
                  initial="hidden"
                  animate="visible"
                  className="pt-8 space-y-5"
                >
                  <Button
                    href="/soumission"
                    size="lg"
                    className="relative w-full overflow-hidden group/cta"
                  >
                    <span className="absolute inset-0 pointer-events-none opacity-0 group-hover/cta:opacity-100 transition-opacity duration-200">
                      <span
                        className="absolute inset-0 -translate-x-full group-hover/cta:animate-shimmer"
                        style={{
                          background:
                            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
                        }}
                      />
                    </span>
                    <span className="relative z-10">{t("getQuote")}</span>
                  </Button>

                  <div className="flex items-center justify-center gap-4">
                    <CurrencySelector compact />
                    <div className="w-px h-5 bg-border" />
                    <LanguageSwitcher />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Desktop link helper component ── */
function DesktopLink({
  href,
  label,
  isActive,
}: {
  href: "/" | "/calculateur" | "/realisations" | "/installation" | "/a-propos" | "/contact";
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className="relative px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 group"
    >
      <span
        className={cn(
          "relative z-10 transition-colors duration-200",
          isActive
            ? "text-accent"
            : "text-muted-foreground group-hover:text-foreground"
        )}
      >
        {label}
      </span>

      {/* Underline: scale from center, gold accent */}
      <span
        className={cn(
          "absolute bottom-0.5 left-3 right-3 h-px rounded-full bg-accent transition-transform duration-300 origin-center",
          isActive
            ? "scale-x-100"
            : "scale-x-0 group-hover:scale-x-100"
        )}
      />
    </Link>
  );
}
