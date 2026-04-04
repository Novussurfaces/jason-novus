const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1591950812051738";

export function pageview(): void {
  if (typeof window === "undefined" || !FB_PIXEL_ID) return;
  window.fbq?.("track", "PageView");
}

export function event(name: string, options: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || !FB_PIXEL_ID) return;
  window.fbq?.("track", name, options);
}

// Pre-built conversion events
export function trackLead(data?: { content_name?: string; value?: number; currency?: string }): void {
  event("Lead", { currency: "CAD", ...data });
}

export function trackContact(): void {
  event("Contact");
}

export function trackViewContent(data: { content_name: string; content_category?: string; value?: number }): void {
  event("ViewContent", { currency: "CAD", ...data });
}

export function trackInitiateCheckout(data?: { value?: number; currency?: string }): void {
  event("InitiateCheckout", { currency: "CAD", ...data });
}

// Augment window type
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}
