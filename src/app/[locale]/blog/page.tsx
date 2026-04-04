import { setRequestLocale } from "next-intl/server";
import { BlogList } from "@/components/sections/BlogList";
import { MultiStructuredData } from "@/components/StructuredData";
import { getBreadcrumbSchema } from "@/lib/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "fr" | "en";

  return (
    <>
      <MultiStructuredData
        schemas={[
          getBreadcrumbSchema(
            [
              { name: loc === "fr" ? "Accueil" : "Home", href: "" },
              { name: "Blog", href: "/blog" },
            ],
            loc
          ),
        ]}
      />
      <BlogList />
    </>
  );
}
