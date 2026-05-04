// middleware.ts
//
// Protects the admin section. If you don't have a valid admin cookie
// and you ask for anything under /admin or /api/admin, you get a 404 —
// not a 401 or a redirect to login. The login page lives at an
// unguessable path (/admin-ax7k2/login) and is the only way in.

import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifySession } from "@/lib/admin-session";

const PROTECTED_PREFIXES = ["/admin", "/api/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page itself must remain accessible.
  // Adjust this constant if you ever change the path.
  if (pathname.startsWith("/admin-ax7k2/")) {
    return NextResponse.next();
  }

  // Auth endpoints (request-link, callback, logout) must remain accessible
  // — they don't require an existing session, they CREATE one.
  if (pathname.startsWith("/api/admin-auth/")) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const session = await verifySession(token);
  if (!session) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Pass session email to downstream handlers via request header.
  // (Next removes user-set cookies/headers between middleware and route
  // handlers in some configs; this header is the reliable channel.)
  const headers = new Headers(req.headers);
  headers.set("x-admin-email", session.email);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/api/admin/:path*",
    "/admin-ax7k2/:path*",
    "/api/admin-auth/:path*",
  ],
};
