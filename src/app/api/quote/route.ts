import { NextResponse } from "next/server";
import { triggerN8nWebhook } from "@/lib/n8n";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = {
      ...data,
      timestamp: new Date().toISOString(),
      source: data.source || "quote-form",
    };

    // Send to n8n (non-blocking)
    triggerN8nWebhook("quote", payload);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
