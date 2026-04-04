import { setRequestLocale } from "next-intl/server";
import { EntrepotLanding } from "@/components/landing/EntrepotLanding";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EntrepotLandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <EntrepotLanding />;
}
