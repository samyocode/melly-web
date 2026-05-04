// app/api/admin-auth/callback/route.ts
//
// Receives the magic link click. The link in the email points
// directly here with ?token_hash=...&type=magiclink, configured via
// the Supabase email template (see README, "Configure Supabase email").
//
// We verify the token_hash with Supabase, re-check the email against
// our allowlist, and if both pass, issue our own signed admin cookie
// and redirect to /admin.

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isAllowedAdminEmail, setAdminCookie } from "@/lib/admin-session";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const token_hash = url.searchParams.get("token_hash");
  // The Supabase email template controls this value. Default to "email"
  // (the modern OTP type) since "magiclink" is deprecated.
  const rawType = url.searchParams.get("type") ?? "email";
  // Normalize the deprecated "magiclink" → "email" mapping.
  const type = rawType === "magiclink" ? "email" : rawType;

  if (!token_hash) {
    return notFound();
  }

  const admin = getSupabaseAdmin();

  // Verify the OTP. This consumes the token (single use).
  // verifyOtp with token_hash works with the supabase-js v2 admin client
  // even though it doesn't store a session for us — we just need the
  // user identity, not the Supabase session.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await admin.auth.verifyOtp({
    type: type as "email",
    token_hash,
  });

  if (error || !data?.user?.email) {
    console.warn("[admin-auth] verifyOtp failed:", error?.message);
    return notFound();
  }

  const email = data.user.email.toLowerCase();

  // Belt and suspenders: even if Supabase verified, re-check the
  // allowlist before issuing our admin cookie. This prevents anyone
  // who happens to have a Supabase auth account from gaining admin.
  if (!isAllowedAdminEmail(email)) {
    return notFound();
  }

  await setAdminCookie(email);

  // Best-effort: revoke the Supabase auth session that verifyOtp just
  // created. We don't want admin login to leave behind a consumer-app
  // session for this email. Non-fatal if it fails.
  if (data.session?.access_token) {
    admin.auth.admin
      .signOut(data.session.access_token)
      .catch((err) =>
        console.warn("[admin-auth] signOut failed:", err?.message ?? err),
      );
  }

  return NextResponse.redirect(new URL("/admin", url.origin));
}

function notFound() {
  return new NextResponse("Not Found", { status: 404 });
}
