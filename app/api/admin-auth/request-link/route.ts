// app/api/admin-auth/request-link/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requestAdminLoginLink } from "@/lib/admin-magic-link";

export async function POST(req: NextRequest) {
  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "");
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Build absolute callback URL. The user clicks the email link, lands at
  // Supabase's confirmation endpoint, which then redirects here.
  const origin = req.nextUrl.origin;
  const redirectTo = `${origin}/api/admin-auth/callback`;

  const result = await requestAdminLoginLink(email, redirectTo);
  return NextResponse.json(result);
}
