import { setRequestLocale } from "next-intl/server";
import { GymLanding } from "@/components/landing/GymLanding";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GymLandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GymLanding />;
}
