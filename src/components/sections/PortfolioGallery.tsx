"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";

type Project = {
  id: number;
  title: { fr: string; en: string };
  category: "residential" | "commercial" | "industrial";
  system: string;
  image: string;
};

// Placeholder projects — replace with real photos
const projects: Project[] = [
  {
    id: 1,
    title: { fr: "Garage résidentiel — Laval", en: "Residential Garage — Laval" },
    category: "residential",
    system: "SCI-Flake",
    image: "/images/portfolio/project-1.jpg",
  },
  {
    id: 2,
    title: { fr: "Entrepôt commercial — Montréal", en: "Commercial Warehouse — Montreal" },
    category: "commercial",
    system: "SCI-100",
    image: "/images/portfolio/project-2.jpg",
  },
  {
    id: 3,
    title: { fr: "Showroom automobile — Québec", en: "Auto Showroom — Quebec City" },
    category: "commercial",
    system: "SCI-Metallic",
    image: "/images/portfolio/project-3.jpg",
  },
  {
    id: 4,
    title: { fr: "Sous-sol résidentiel — Longueuil", en: "Residential Basement — Longueuil" },
    category: "residential",
    system: "SCI-Flake",
    image: "/images/portfolio/project-4.jpg",
  },
  {
    id: 5,
    title: { fr: "Usine alimentaire — Anjou", en: "Food Processing — Anjou" },
    category: "industrial",
    system: "SCI-CPU",
    image: "/images/portfolio/project-5.jpg",
  },
  {
    id: 6,
    title: { fr: "Restaurant haut de gamme — Vieux-Montréal", en: "Upscale Restaurant — Old Montreal" },
    category: "commercial",
    system: "SCI-Metallic",
    image: "/images/portfolio/project-6.jpg",
  },
];

const filterCategories = ["all", "residential", "commercial", "industrial"] as const;

export function PortfolioGallery() {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("portfolio");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section className="pt-32 pb-24">
      <Container>
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
                activeFilter === cat
                  ? "bg-accent text-white shadow-lg shadow-accent/25"
                  : "bg-card text-muted border border-border hover:text-foreground"
              )}
            >
              {cat === "all" ? t("filterAll") : t(cat)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.button
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProject(project)}
                className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 text-left cursor-pointer"
              >
                {/* Image placeholder */}
                <div className="aspect-[4/3] bg-surface flex items-center justify-center relative overflow-hidden">
                  <div className="text-3xl font-bold text-muted-foreground/10 font-[family-name:var(--font-cabinet)]">
                    {project.system}
                  </div>
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
                </div>
                <div className="p-5">
                  <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent mb-2">
                    {project.system}
                  </span>
                  <h3 className="text-sm font-semibold group-hover:text-accent transition-colors">
                    {project.title[locale]}
                  </h3>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl rounded-2xl bg-card border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
              <div className="aspect-video bg-surface flex items-center justify-center">
                <div className="text-5xl font-bold text-muted-foreground/10 font-[family-name:var(--font-cabinet)]">
                  {selectedProject.system}
                </div>
              </div>
              <div className="p-6">
                <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent mb-2">
                  {selectedProject.system}
                </span>
                <h3 className="text-xl font-semibold">
                  {selectedProject.title[locale]}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
