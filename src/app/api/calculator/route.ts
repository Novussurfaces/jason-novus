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

    // Log for now — will be replaced by n8n webhook
    console.log("Calculator lead captured:", {
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
    });

    // TODO: Send to n8n webhook
    // const webhookUrl = process.env.N8N_CALCULATOR_WEBHOOK_URL;
    // if (webhookUrl) {
    //   await fetch(webhookUrl, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(data),
    //   });
    // }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
