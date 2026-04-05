// ── Google Analytics 4 + Google Ads Conversion Tracking ──
// Requires env vars:
//   NEXT_PUBLIC_GA_MEASUREMENT_ID  → GA4 measurement ID (G-XXXXXXXXXX)
//   NEXT_PUBLIC_GADS_CONVERSION_ID → Google Ads conversion ID (AW-XXXXXXXXX)
//
// Usage in components:
//   import { gtagEvent } from "@/lib/gtag";
//   gtagEvent("generate_lead", { event_category: "quote", value: 500 });

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
export const GADS_CONVERSION_ID = process.env.NEXT_PUBLIC_GADS_CONVERSION_ID || "";

// Type-safe gtag global
declare global {
  interface Window {
    gtag: (...args: [string, string, Record<string, unknown>?]) => void;
    dataLayer: Record<string, unknown>[];
  }
}

/**
 * Fire a GA4 event. No-op if gtag not loaded.
 */
export function gtagEvent(
  action: string,
  params: Record<string, unknown> = {}
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}

/**
 * Fire a Google Ads conversion event.
 * Call this when a high-value action happens (form submission, quote request).
 */
export function gtagConversion(
  conversionLabel: string,
  value?: number,
  currency = "CAD"
) {
  if (typeof window === "undefined" || !window.gtag || !GADS_CONVERSION_ID) return;
  window.gtag("event", "conversion", {
    send_to: `${GADS_CONVERSION_ID}/${conversionLabel}`,
    value,
    currency,
  });
}

// ── Pre-defined conversion events ──

/** Quote form submitted — highest value lead */
export function trackQuoteSubmission(estimatedValue?: number) {
  gtagEvent("generate_lead", {
    event_category: "quote",
    event_label: "quote_form_submission",
    value: estimatedValue || 5000,
    currency: "CAD",
  });
  gtagConversion("quote_submission", estimatedValue || 5000);
}

/** Calculator used and submitted — warm lead */
export function trackCalculatorSubmission(sqft: number, estimateMin: number) {
  gtagEvent("generate_lead", {
    event_category: "calculator",
    event_label: "calculator_submission",
    value: estimateMin,
    currency: "CAD",
  });
  gtagConversion("calculator_submission", estimateMin);
}

/** Contact form submitted — medium value lead */
export function trackContactSubmission() {
  gtagEvent("generate_lead", {
    event_category: "contact",
    event_label: "contact_form_submission",
    value: 1000,
    currency: "CAD",
  });
  gtagConversion("contact_submission", 1000);
}

/** Chat initiated — engagement signal */
export function trackChatStart() {
  gtagEvent("engagement", {
    event_category: "chat",
    event_label: "chat_initiated",
  });
}

/** Phone click — high intent */
export function trackPhoneClick() {
  gtagEvent("engagement", {
    event_category: "phone",
    event_label: "phone_click",
    value: 2000,
    currency: "CAD",
  });
  gtagConversion("phone_click", 2000);
}
