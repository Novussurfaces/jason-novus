"use client";

import { useScrollVelocity } from "@/hooks/useScrollVelocity";

/* ─────────────────────────────────────────────
   VelocityEffects — Global scroll-velocity layer

   Activates the useScrollVelocity hook which sets
   the --scroll-velocity CSS custom property on <html>.
   ───────────────────────────────────────────── */

const velocityStyles = `
/* Only keep the custom property — no visual CSS rules */
`;

export function VelocityEffects() {
  // Activate the velocity hook — sets CSS custom properties on <html> each frame
  useScrollVelocity();

  return (
    <>
      {/* Inject minimal velocity CSS */}
      <style dangerouslySetInnerHTML={{ __html: velocityStyles }} />
    </>
  );
}

/* ─────────────────────────────────────────────
   Simple 1px separator for use between sections
   ───────────────────────────────────────────── */
export function VelocitySeparator() {
  return (
    <div className="mx-auto max-w-5xl border-t border-white/[0.06]" aria-hidden="true" />
  );
}
