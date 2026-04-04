import { NextResponse } from "next/server";
import { triggerN8nWebhook } from "@/lib/n8n";
import { pushLeadToCommandCenter } from "@/lib/command-center";

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

    // Send to n8n + Command Center (non-blocking)
    triggerN8nWebhook("calculator", payload);
    pushLeadToCommandCenter({ ...payload, type: "calculator", area: data.sqft });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
