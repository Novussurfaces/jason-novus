import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { blogPosts, getBlogPostBySlug } from "@/lib/blog";
import { BlogArticle } from "@/components/sections/BlogArticle";
import { MultiStructuredData } from "@/components/StructuredData";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  const loc = locale as "fr" | "en";
  return {
    title: post.title[loc],
    description: post.excerpt[loc],
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const loc = locale as "fr" | "en";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title[loc],
    description: post.excerpt[loc],
    datePublished: post.date,
    inLanguage: loc === "fr" ? "fr-CA" : "en-CA",
    url: `https://novusepoxy.ca/${loc}/blog/${post.slug}`,
    author: {
      "@type": "Organization",
      name: "Novus Epoxy",
      url: "https://novusepoxy.ca",
    },
    publisher: {
      "@type": "Organization",
      name: "Novus Epoxy",
      url: "https://novusepoxy.ca",
      logo: {
        "@type": "ImageObject",
        url: "https://novusepoxy.ca/logo-icon.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://novusepoxy.ca/${loc}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <MultiStructuredData
        schemas={[
          articleSchema,
          getBreadcrumbSchema(
            [
              { name: loc === "fr" ? "Accueil" : "Home", href: "" },
              { name: "Blog", href: "/blog" },
              { name: post.title[loc], href: `/blog/${post.slug}` },
            ],
            loc
          ),
        ]}
      />
      <BlogArticle post={post} />
    </>
  );
}
