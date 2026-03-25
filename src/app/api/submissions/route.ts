import { NextResponse } from "next/server";
import { triggerN8nWebhook } from "@/lib/n8n";
import { pushLeadToCommandCenter } from "@/lib/command-center";
import { notifyNewQuote } from "@/lib/email-notify";

// CORS headers for novusepoxy.ca cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(
    { error: "Non autorisé" },
    { status: 401, headers: corsHeaders }
  );
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // novusepoxy.ca form fields: nom, email, telephone, type_surface, surface_estimee, adresse, ville
    const nom = data.nom || data.name || "";
    const email = data.email || "";
    const telephone = data.telephone || data.phone || "";

    if (!nom || !email) {
      return NextResponse.json(
        { ok: false, error: "Champs requis manquants" },
        { status: 400, headers: corsHeaders }
      );
    }

    const payload = {
      name: nom,
      email,
      phone: telephone,
      projectType: data.type_surface || "",
      surfaceArea: data.surface_estimee || "",
      company: "",
      message: data.adresse ? `${data.adresse}, ${data.ville || ""}` : "",
      source: "novusepoxy.ca",
      timestamp: new Date().toISOString(),
    };

    // Fire-and-forget: email notification + n8n + command center
    notifyNewQuote(payload);
    triggerN8nWebhook("quote", payload);
    pushLeadToCommandCenter({ ...payload, type: "quote" });

    return NextResponse.json({ ok: true }, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erreur interne" },
      { status: 500, headers: corsHeaders }
    );
  }
}
