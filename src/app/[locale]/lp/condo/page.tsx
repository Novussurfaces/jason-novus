import { setRequestLocale } from "next-intl/server";
import { CondoLanding } from "@/components/landing/CondoLanding";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CondoLandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CondoLanding />;
}
