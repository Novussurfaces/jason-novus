import { setRequestLocale } from "next-intl/server";
import { CommercialLanding } from "@/components/landing/CommercialLanding";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CommercialLandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CommercialLanding />;
}
