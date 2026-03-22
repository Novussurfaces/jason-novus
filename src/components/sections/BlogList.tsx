"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Link } from "@/i18n/navigation";
import { blogPosts } from "@/lib/blog";

function formatDate(dateStr: string, locale: "fr" | "en") {
  return new Date(dateStr).toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogList() {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("blog");

  return (
    <section className="pt-32 pb-24">
      <Container>
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {blogPosts.map((post, i) => (
            <AnimatedSection key={post.slug} delay={i * 0.1}>
              <Link
                href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                className="group block rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 h-full"
              >
                {/* Image placeholder */}
                <div className="aspect-[16/9] bg-surface flex items-center justify-center">
                  <span className="text-2xl font-bold text-muted-foreground/10 font-[family-name:var(--font-cabinet)]">
                    {post.category[locale]}
                  </span>
                </div>

                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-muted mb-3">
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-medium text-accent">
                      {post.category[locale]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime} {t("minRead")}
                    </span>
                    <span>{formatDate(post.date, locale)}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-semibold group-hover:text-accent transition-colors leading-snug">
                    {post.title[locale]}
                  </h2>

                  {/* Excerpt */}
                  <p className="mt-2 text-sm text-muted line-clamp-2">
                    {post.excerpt[locale]}
                  </p>

                  {/* CTA */}
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-accent">
                    {t("readMore")}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
