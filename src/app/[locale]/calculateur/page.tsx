import { setRequestLocale } from "next-intl/server";
import { CalculatorSection } from "@/components/sections/Calculator";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CalculatorSection />;
}
