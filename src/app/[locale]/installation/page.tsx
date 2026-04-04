import { setRequestLocale } from "next-intl/server";
import { Installation } from "@/components/sections/Installation";

type Props = { params: Promise<{ locale: string }> };

export default async function InstallationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Installation />;
}
