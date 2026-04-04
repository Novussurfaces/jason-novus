"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Ruler,
  Layers,
  Building2,
  Home,
  Factory,
  ArrowRight,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { StaggerGrid, StaggerGridItem } from "@/components/ui/StaggerGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/*  Project data                                                       */
/* ------------------------------------------------------------------ */

type ProjectCategory = "residential" | "commercial" | "industrial";

interface Project {
  id: string;
  translationKey: string;
  category: ProjectCategory;
  sciCode: string;
  chemistry: string;
  area: number;
}

const projects: Project[] = [
  {
    id: "garage-laval",
    translationKey: "project1",
    category: "residential",
    sciCode: "SCI-FLK",
    chemistry: "Epoxy-Flake",
    area: 650,
  },
  {
    id: "warehouse-mtl",
    translationKey: "project2",
    category: "industrial",
    sciCode: "SCI-PUA",
    chemistry: "Polyurea",
    area: 12800,
  },
  {
    id: "showroom-qc",
    translationKey: "project3",
    category: "commercial",
    sciCode: "SCI-MET",
    chemistry: "Epoxy-Metallic",
    area: 3200,
  },
  {
    id: "restaurant-sherb",
    translationKey: "project4",
    category: "commercial",
    sciCode: "SCI-QTZ",
    chemistry: "Epoxy-Quartz",
    area: 1800,
  },
  {
    id: "basement-bross",
    translationKey: "project5",
    category: "residential",
    sciCode: "SCI-100",
    chemistry: "100% Solid Epoxy",
    area: 480,
  },
  {
    id: "factory-anjou",
    translationKey: "project6",
    category: "industrial",
    sciCode: "SCI-PPA",
    chemistry: "Polyurea-Polyaspartic",
    area: 15000,
  },
  {
    id: "gym-gatineau",
    translationKey: "project7",
    category: "commercial",
    sciCode: "SCI-PAS",
    chemistry: "Polyaspartic",
    area: 4500,
  },
  {
    id: "condo-longueuil",
    translationKey: "project8",
    category: "residential",
    sciCode: "SCI-MET",
    chemistry: "Epoxy-Metallic",
    area: 920,
  },
  {
    id: "pharma-mirabel",
    translationKey: "project9",
    category: "industrial",
    sciCode: "SCI-QTZ",
    chemistry: "Epoxy-Quartz",
    area: 8600,
  },
  {
    id: "boutique-tremb",
    translationKey: "project10",
    category: "commercial",
    sciCode: "SCI-FLK",
    chemistry: "Epoxy-Flake",
    area: 2100,
  },
  {
    id: "garage-repent",
    translationKey: "project11",
    category: "residential",
    sciCode: "SCI-PUA",
    chemistry: "Polyurea",
    area: 780,
  },
  {
    id: "food-plant-drum",
    translationKey: "project12",
    category: "industrial",
    sciCode: "SCI-100",
    chemistry: "100% Solid Epoxy",
    area: 11200,
  },
];

const filterCategories = ["all", "residential", "commercial", "industrial"] as const;

const categoryIcons: Record<ProjectCategory, typeof Home> = {
  residential: Home,
  commercial: Building2,
  industrial: Factory,
};

/* ------------------------------------------------------------------ */
/*  Stats bar                                                          */
/* ------------------------------------------------------------------ */

function StatsBar() {
  const t = useTranslations("realisations");

  return (
    <ScrollReveal delay={0.2}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-16 md:mb-20">
        {(["totalProjects", "totalArea", "cities", "systems"] as const).map(
          (stat, i) => (
            <div
              key={stat}
              className="relative text-center py-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
            >
              {/* Subtle corner glow */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-cabinet)] text-foreground">
                  <NumberTicker
                    value={[150, 85000, 12, 8][i]}
                    suffix={["+", "+", "+", ""][i]}
                    prefix={["", "", "", ""][i]}
                    delay={0.3 + i * 0.1}
                  />
                </div>
                <div className="mt-1 text-xs text-foreground/40 uppercase tracking-widest">
                  {t(`stats.${stat}`)}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </ScrollReveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter bar                                                         */
/* ------------------------------------------------------------------ */

interface FilterBarProps {
  active: string;
  onFilter: (cat: string) => void;
}

function FilterBar({ active, onFilter }: FilterBarProps) {
  const t = useTranslations("realisations");

  return (
    <ScrollReveal delay={0.1}>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12 md:mb-16">
        {filterCategories.map((cat) => {
          const isActive = active === cat;
          const Icon =
            cat === "all" ? Layers : categoryIcons[cat as ProjectCategory];

          return (
            <motion.button
              key={cat}
              onClick={() => onFilter(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer",
                isActive
                  ? "bg-accent text-white shadow-[0_0_24px_rgba(201,168,76,0.3)]"
                  : "bg-white/[0.04] text-foreground/50 border border-white/[0.08] hover:text-foreground hover:border-white/[0.15] hover:bg-white/[0.06]"
              )}
            >
              {/* Active glow ring */}
              {isActive && (
                <motion.div
                  layoutId="filter-glow"
                  className="absolute inset-0 rounded-full bg-accent/20 blur-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={15} className="relative z-10" />
              <span className="relative z-10">
                {cat === "all" ? t("filterAll") : t(`filters.${cat}`)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </ScrollReveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Project card                                                       */
/* ------------------------------------------------------------------ */

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const t = useTranslations("realisations");
  const Icon = categoryIcons[project.category];

  const handleSelect = useCallback(() => {
    onSelect(project);
  }, [onSelect, project]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        onClick={handleSelect}
        className="block w-full text-left group cursor-pointer"
      >
        <SpotlightCard className="h-full p-0 overflow-hidden">
          {/* Visual header */}
          <div className="relative">
            <ProductVisual
              sciCode={project.sciCode}
              chemistry={project.chemistry}
              className="aspect-[16/10]"
            />

            {/* Category badge */}
            <div className="absolute top-3 left-3 z-20">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 border border-white/[0.12] px-2.5 py-1 text-[10px] font-semibold text-foreground/70 backdrop-blur-md uppercase tracking-wider">
                <Icon size={11} />
                {t(`filters.${project.category}`)}
              </span>
            </div>

            {/* System badge */}
            <div className="absolute top-3 right-3 z-20">
              <span className="inline-flex items-center rounded-full bg-accent/15 border border-accent/25 px-2.5 py-1 text-[10px] font-bold text-accent backdrop-blur-md tracking-wide">
                {project.sciCode}
              </span>
            </div>

            {/* Bottom fade for readability */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#18181b] to-transparent z-10 pointer-events-none" />
          </div>

          {/* Info section */}
          <div className="relative z-20 px-5 pb-5 -mt-4">
            {/* Title */}
            <h3 className="text-base font-semibold font-[family-name:var(--font-cabinet)] text-foreground group-hover:text-accent transition-colors duration-300 leading-snug">
              {t(`projects.${project.translationKey}.title`)}
            </h3>

            {/* System name */}
            <p className="mt-1 text-xs text-accent/60 font-medium">
              {t(`projects.${project.translationKey}.system`)}
            </p>

            {/* Meta row */}
            <div className="mt-3 flex items-center gap-4 text-[11px] text-foreground/40">
              <span className="flex items-center gap-1">
                <Ruler size={12} className="text-foreground/30" />
                {project.area.toLocaleString()} pi\u00B2
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-foreground/30" />
                {t(`projects.${project.translationKey}.city`)}
              </span>
            </div>

            {/* Hover CTA */}
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-accent/0 group-hover:text-accent/70 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
              {t("viewDetails")}
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>
          </div>
        </SpotlightCard>
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project lightbox / modal                                           */
/* ------------------------------------------------------------------ */

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const t = useTranslations("realisations");
  const Icon = categoryIcons[project.category];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl rounded-3xl bg-[#111114] border border-white/[0.08] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/[0.06] border border-white/[0.10] text-foreground/60 hover:text-foreground hover:bg-white/[0.12] transition-all duration-200 cursor-pointer backdrop-blur-sm"
        >
          <X size={18} />
        </button>

        {/* Visual */}
        <ProductVisual
          sciCode={project.sciCode}
          chemistry={project.chemistry}
          className="aspect-[21/9]"
        />

        {/* Content */}
        <div className="relative px-6 sm:px-8 py-6 sm:py-8">
          {/* Accent line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

          <div className="flex flex-wrap items-start gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-semibold text-accent">
              {project.sciCode}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] border border-white/[0.10] px-3 py-1 text-xs text-foreground/50">
              <Icon size={12} />
              {t(`filters.${project.category}`)}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-cabinet)] text-foreground leading-tight">
            {t(`projects.${project.translationKey}.title`)}
          </h2>

          <p className="mt-2 text-sm text-foreground/50 leading-relaxed max-w-2xl">
            {t(`projects.${project.translationKey}.description`)}
          </p>

          {/* Detail grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: t("modal.system"),
                value: t(`projects.${project.translationKey}.system`),
              },
              {
                label: t("modal.area"),
                value: `${project.area.toLocaleString()} pi\u00B2`,
              },
              {
                label: t("modal.city"),
                value: t(`projects.${project.translationKey}.city`),
              },
              {
                label: t("modal.category"),
                value: t(`filters.${project.category}`),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              >
                <div className="text-[10px] text-foreground/30 uppercase tracking-widest mb-1">
                  {item.label}
                </div>
                <div className="text-sm font-medium text-foreground/80">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-wrap gap-3">
            <MagneticButton>
              <Button href="/soumission" size="md">
                {t("modal.cta")}
                <ArrowRight size={16} />
              </Button>
            </MagneticButton>
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
            >
              {t("modal.close")}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function Realisations() {
  const t = useTranslations("realisations");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? projects
        : projects.filter((p) => p.category === activeFilter),
    [activeFilter]
  );

  const handleSelect = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 1200,
          height: 800,
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(201,168,76,0.04) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute right-0 bottom-0"
        style={{
          width: 600,
          height: 600,
          background:
            "radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.02) 0%, transparent 60%)",
        }}
      />

      <Container className="relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.06] px-4 py-1.5 text-xs text-foreground/48 backdrop-blur-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {t("badge")}
          </span>
        </motion.div>

        {/* Header */}
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
          gradient
        />

        {/* Stats */}
        <StatsBar />

        {/* Filters */}
        <FilterBar active={activeFilter} onFilter={setActiveFilter} />

        {/* Project grid */}
        <StaggerGrid
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          stagger={0.08}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <StaggerGridItem key={project.id}>
                <ProjectCard
                  project={project}
                  onSelect={handleSelect}
                />
              </StaggerGridItem>
            ))}
          </AnimatePresence>
        </StaggerGrid>

        {/* Empty state */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-foreground/40 text-sm">
                {t("noResults")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 md:mt-20 text-center"
        >
          <p className="text-sm text-foreground/40 mb-5 max-w-md mx-auto">
            {t("ctaText")}
          </p>
          <MagneticButton className="inline-block">
            <Button href="/soumission" size="lg" className="group/btn">
              {t("ctaButton")}
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover/btn:translate-x-1"
              />
            </Button>
          </MagneticButton>
        </motion.div>
      </Container>

      {/* Lightbox modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
