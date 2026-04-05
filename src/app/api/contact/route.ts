import { NextResponse } from "next/server";
import { triggerN8nWebhook } from "@/lib/n8n";
import { pushLeadToCommandCenter } from "@/lib/command-center";
import { triggerInstantResponse } from "@/lib/instant-response";
import { notifyAllTelegram } from "@/lib/telegram-notify";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name || !data.email || !data.message) {
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

    // All notifications fire in parallel, non-blocking
    Promise.allSettled([
      triggerN8nWebhook("contact", payload),
      pushLeadToCommandCenter({ ...payload, type: "contact" }),
      triggerInstantResponse({ ...payload, type: "contact" }),
      notifyAllTelegram(payload),
    ]).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
