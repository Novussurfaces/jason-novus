import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Inter, Space_Grotesk } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { FilmGrain } from "@/components/three/FilmGrain";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SocialProof } from "@/components/ui/SocialProof";
import { ExitIntent } from "@/components/ui/ExitIntent";
import { StickyCTA } from "@/components/ui/StickyCTA";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-cabinet",
  display: "swap",
  weight: ["700"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("title"),
      template: `%s | Novus Surfaces`,
    },
    description: t("description"),
    metadataBase: new URL("https://novussurfaces.com"),
    icons: {
      icon: "/favicon.svg",
      apple: "/logo-icon.svg",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "Novus Surfaces",
      locale: locale === "fr" ? "fr_CA" : "en_CA",
      type: "website",
      images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Novus Surfaces" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.svg"],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScroll>
            <ScrollProgress />
            <FilmGrain />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatBot />
            <SocialProof />
            <ExitIntent />
            <StickyCTA />
            <CustomCursor />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
