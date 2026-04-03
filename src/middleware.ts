import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { jwtVerify } from "jose";

const intlMiddleware = createMiddleware(routing);

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "novus-surfaces-secret-key-change-in-production-2026"
);

const PROTECTED_PATHS = ["/hq", "/en/hq", "/fr/hq"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Protect /hq — admin only ──
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get("novus-session")?.value;

    if (!token) {
      // No session → redirect to login or return 401
      const loginUrl = new URL("/", req.url);
      loginUrl.searchParams.set("auth", "required");
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.role !== "admin") {
        // Not admin → redirect home
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      // Invalid token → redirect
      const loginUrl = new URL("/", req.url);
      loginUrl.searchParams.set("auth", "expired");
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Skip intl middleware for webhook endpoints (Twilio + Telegram) ──
  if (pathname.startsWith("/api/sms") || pathname.startsWith("/api/telegram")) {
    return NextResponse.next();
  }

  // ── Protect API routes for agents/claw/hq — admin only ──
  if (
    pathname.startsWith("/api/agents") ||
    pathname.startsWith("/api/claw") ||
    pathname.startsWith("/api/hq")
  ) {
    const token = req.cookies.get("novus-session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
