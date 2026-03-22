import { NextResponse } from "next/server";
import { triggerN8nWebhook } from "@/lib/n8n";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name || !data.email || !data.product || !data.sqft) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      product: data.product,
      sqft: data.sqft,
      projectType: data.projectType,
      estimateMin: data.estimateMin,
      estimateMax: data.estimateMax,
      locale: data.locale,
      timestamp: new Date().toISOString(),
      source: "calculator",
    };

    // Send to n8n (non-blocking)
    triggerN8nWebhook("calculator", payload);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
