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
      const loginUrl = new URL("/", req.url);
      loginUrl.searchParams.set("auth", "required");
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      const loginUrl = new URL("/", req.url);
      loginUrl.searchParams.set("auth", "expired");
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── ALL /api routes bypass intl middleware (it breaks webhooks + API routes) ──
  if (pathname.startsWith("/api/")) {
    // Protect admin-only API routes
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
    // All API routes skip intlMiddleware — return directly
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
