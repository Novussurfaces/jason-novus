import { setRequestLocale } from "next-intl/server";
import { QuoteTracker } from "@/components/sections/QuoteTracker";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TrackPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <QuoteTracker />;
}
