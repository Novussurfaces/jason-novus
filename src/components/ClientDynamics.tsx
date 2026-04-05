"use client";

import dynamic from "next/dynamic";

export const ChatBot = dynamic(
  () => import("@/components/ChatBot").then((m) => m.ChatBot),
  { ssr: false }
);

export const FloatingCall = dynamic(
  () => import("@/components/ui/FloatingCall").then((m) => m.FloatingCall),
  { ssr: false }
);

export const FilmGrain = dynamic(
  () => import("@/components/three/FilmGrain").then((m) => m.FilmGrain),
  { ssr: false }
);

export const CustomCursor = dynamic(
  () => import("@/components/ui/CustomCursor").then((m) => m.CustomCursor),
  { ssr: false }
);

export const ExitIntent = dynamic(
  () => import("@/components/ui/ExitIntent").then((m) => m.ExitIntent),
  { ssr: false }
);

export const StickyCTA = dynamic(
  () => import("@/components/ui/StickyCTA").then((m) => m.StickyCTA),
  { ssr: false }
);

export const Preloader = dynamic(
  () => import("@/components/ui/Preloader").then((m) => m.Preloader),
  { ssr: false }
);

export const FacebookPixel = dynamic(
  () => import("@/components/FacebookPixel").then((m) => m.FacebookPixel),
  { ssr: false }
);
