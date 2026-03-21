"use client";

import { useEffect } from "react";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Hide Navbar and Footer on landing pages
    document.body.classList.add("lp-mode");
    return () => document.body.classList.remove("lp-mode");
  }, []);

  return <>{children}</>;
}
