"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: "fr" | "en") => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace(pathname as any, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border p-1">
      <button
        onClick={() => switchLocale("fr")}
        className={cn(
          "rounded-md px-2.5 py-1 text-sm font-medium transition-all duration-200 cursor-pointer",
          locale === "fr"
            ? "bg-accent text-white"
            : "text-muted hover:text-foreground"
        )}
      >
        FR
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={cn(
          "rounded-md px-2.5 py-1 text-sm font-medium transition-all duration-200 cursor-pointer",
          locale === "en"
            ? "bg-accent text-white"
            : "text-muted hover:text-foreground"
        )}
      >
        EN
      </button>
    </div>
  );
}
