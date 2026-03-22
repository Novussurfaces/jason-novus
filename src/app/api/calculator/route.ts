import { NextResponse } from "next/server";

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

    console.log("Calculator lead captured:", payload);

    // Send to n8n webhook (non-blocking)
    const webhookUrl = process.env.N8N_CALCULATOR_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
