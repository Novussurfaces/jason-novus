import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { jwtVerify } from "jose";

const intlMiddleware = createMiddleware(routing);

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "MISSING-JWT-SECRET-SET-ENV-VAR"
);

// const PROTECTED_PATHS = ["/hq", "/en/hq", "/fr/hq"]; // TODO: re-enable auth when env vars set

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── ALL /api routes bypass intl middleware (it breaks webhooks + API routes) ──
  if (pathname.startsWith("/api/")) {
    // TODO: re-enable API auth when env vars set
    // All API routes skip intlMiddleware — return directly
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
