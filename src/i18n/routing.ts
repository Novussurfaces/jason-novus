import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/produits": {
      fr: "/produits",
      en: "/products",
    },
    "/produits/[slug]": {
      fr: "/produits/[slug]",
      en: "/products/[slug]",
    },
    "/realisations": {
      fr: "/realisations",
      en: "/portfolio",
    },
    "/soumission": {
      fr: "/soumission",
      en: "/quote",
    },
    "/a-propos": {
      fr: "/a-propos",
      en: "/about",
    },
    "/contact": {
      fr: "/contact",
      en: "/contact",
    },
    "/calculateur": {
      fr: "/calculateur",
      en: "/calculator",
    },
    "/blog": {
      fr: "/blog",
      en: "/blog",
    },
    "/blog/[slug]": {
      fr: "/blog/[slug]",
      en: "/blog/[slug]",
    },
    "/lp/garage": {
      fr: "/lp/garage",
      en: "/lp/garage",
    },
    "/lp/commercial": {
      fr: "/lp/commercial",
      en: "/lp/commercial",
    },
    "/suivi": {
      fr: "/suivi",
      en: "/track",
    },
  },
});
