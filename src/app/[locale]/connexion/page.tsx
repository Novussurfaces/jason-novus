import { setRequestLocale } from "next-intl/server";
import { AuthForms } from "@/components/sections/AuthForms";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Connexion",
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AuthForms mode="login" />;
}
