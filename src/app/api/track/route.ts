import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ found: false });
  }

  // Mock data — replace with real DB/CRM lookup later
  const mockQuotes: Record<string, {
    id: string;
    status: string;
    date: string;
    products: string[];
    estimatedResponse: string;
    clientName: string;
  }> = {
    "demo@novusepoxy.ca": {
      id: "NVS-2026-001",
      status: "processing",
      date: "2026-03-21",
      products: ["SCI-Metallic System", "SCI-Primer 100%"],
      estimatedResponse: "24h",
      clientName: "Demo Client",
    },
  };

  const quote = mockQuotes[email.toLowerCase()];

  if (quote) {
    return NextResponse.json({ found: true, quote });
  }

  return NextResponse.json({ found: false });
}
