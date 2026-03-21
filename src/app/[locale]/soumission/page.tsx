import { setRequestLocale } from "next-intl/server";
import { QuoteForm } from "@/components/sections/QuoteForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function QuotePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <QuoteForm />;
}
