import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Novus Epoxy",
  description: "Premium surface coatings — Worldwide delivery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
