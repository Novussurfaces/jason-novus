import { NextResponse } from "next/server";
import { triggerN8nWebhook } from "@/lib/n8n";
import { pushLeadToCommandCenter } from "@/lib/command-center";

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

    // Forward to n8n + Command Center (non-blocking, fire-and-forget)
    triggerN8nWebhook("contact", payload);
    pushLeadToCommandCenter({ ...payload, type: "contact" });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
