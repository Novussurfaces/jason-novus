import { setRequestLocale } from "next-intl/server";
import { RestaurantLanding } from "@/components/landing/RestaurantLanding";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RestaurantLandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RestaurantLanding />;
}
