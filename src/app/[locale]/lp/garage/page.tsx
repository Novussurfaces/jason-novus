import { setRequestLocale } from "next-intl/server";
import { GarageLanding } from "@/components/landing/GarageLanding";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GarageLandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GarageLanding />;
}
