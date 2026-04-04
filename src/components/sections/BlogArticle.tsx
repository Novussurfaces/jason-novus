"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { type BlogPost } from "@/lib/blog";
import { CTASection } from "./CTASection";

function formatDate(dateStr: string, locale: "fr" | "en") {
  return new Date(dateStr).toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogArticle({ post }: { post: BlogPost }) {
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("blog");

  return (
    <>
      <article className="pt-16 pb-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {/* Back */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              {t("backToBlog")}
            </Link>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-muted mb-6">
              <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent">
                {post.category[locale]}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(post.date, locale)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {post.readTime} {t("minRead")}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-[family-name:var(--font-cabinet)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              {post.title[locale]}
            </h1>

            {/* Content */}
            <div
              className="mt-10 prose prose-invert prose-lg max-w-none
                prose-headings:font-[family-name:var(--font-cabinet)] prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-muted prose-p:leading-relaxed
                prose-strong:text-foreground
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-table:text-sm
                prose-th:bg-card prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-medium prose-th:border prose-th:border-border
                prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-border prose-td:text-muted
                prose-li:text-muted
                prose-ul:my-4 prose-ol:my-4
                prose-hr:border-border"
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(post.content[locale]),
              }}
            />
          </motion.div>
        </Container>
      </article>
      <CTASection />
    </>
  );
}

// Simple markdown to HTML converter for blog content
function markdownToHtml(md: string): string {
  return md
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Tables
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      if (cells.every(c => /^[\s-:]+$/.test(c))) return ''; // separator row
      const isHeader = cells.some(c => c.includes('**'));
      const tag = isHeader ? 'th' : 'td';
      const row = cells.map(c => `<${tag}>${c.trim().replace(/\*\*/g, '')}</${tag}>`).join('');
      return `<tr>${row}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (match) => `<table><tbody>${match}</tbody></table>`)
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // Paragraphs
    .replace(/^(?!<[hultao])((?!<).+)$/gm, '<p>$1</p>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr>')
    // Clean up empty paragraphs
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<p><\/p>/g, '');
}
