import { NextResponse } from "next/server";
import { triggerN8nWebhook } from "@/lib/n8n";
import { pushLeadToCommandCenter } from "@/lib/command-center";
import { notifyNewQuote } from "@/lib/email-notify";
import { triggerInstantResponse } from "@/lib/instant-response";

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

    // Forward to n8n + Command Center + direct email + instant response (non-blocking)
    triggerN8nWebhook("quote", payload);
    pushLeadToCommandCenter({ ...payload, type: "quote" });
    notifyNewQuote(payload);
    triggerInstantResponse({ ...payload, type: "quote" });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
