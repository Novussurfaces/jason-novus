import { NextResponse } from "next/server";
import { triggerN8nWebhook } from "@/lib/n8n";
import { pushLeadToCommandCenter } from "@/lib/command-center";
import { notifyNewQuote } from "@/lib/email-notify";
import { triggerInstantResponse } from "@/lib/instant-response";
import { notifyAllTelegram } from "@/lib/telegram-notify";
import { sendCustomerConfirmation } from "@/lib/resend-confirm";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent") || "";

    const payload = {
      ...data,
      timestamp: new Date().toISOString(),
      locale: data.locale || "fr",
      userAgent,
    };

    // All notifications fire in parallel, non-blocking.
    // Each handler has its own try/catch — a failure in one
    // never affects the others or the form submission response.
    Promise.allSettled([
      // Existing integrations
      triggerN8nWebhook("quote", payload),
      pushLeadToCommandCenter({ ...payload, type: "quote" }),
      notifyNewQuote(payload),
      triggerInstantResponse({ ...payload, type: "quote" }),

      // Telegram alerts: Jason (bridge bot) + Aria (follow-up bot)
      notifyAllTelegram(payload),

      // Customer confirmation email via Resend (with April 20% promo)
      sendCustomerConfirmation(payload),
    ]).catch(() => {
      // Swallow any unexpected rejection from allSettled itself
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
