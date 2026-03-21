import { setRequestLocale } from "next-intl/server";
import { PortfolioGallery } from "@/components/sections/PortfolioGallery";
import { BeforeAfter } from "@/components/sections/BeforeAfter";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PortfolioGallery />
      <BeforeAfter />
    </>
  );
}
