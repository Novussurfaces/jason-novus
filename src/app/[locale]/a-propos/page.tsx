import { setRequestLocale } from "next-intl/server";
import { AboutContent } from "@/components/sections/AboutContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}
