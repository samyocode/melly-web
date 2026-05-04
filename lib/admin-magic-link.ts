// lib/admin-magic-link.ts
//
// Generate one-time login links via Supabase Admin API.
// We use Supabase only as a link generator + email sender; the actual
// admin session is our own signed cookie (see admin-session.ts).
//
// Flow:
//   1. POST /api/admin-auth/request-link  with { email }
//      → check allowlist, generate magiclink, email it via Supabase
//   2. User clicks link → arrives at /api/admin-auth/callback?token_hash=...
//      → we verify the OTP with Supabase, double-check email is allowed,
//         then set our own admin cookie and redirect into /admin.

import { getSupabaseAdmin } from "./supabase-admin";
import { isAllowedAdminEmail } from "./admin-session";

interface RequestLinkResult {
  ok: boolean;
  message: string;
}

/**
 * Generate a magic link for the given email and ask Supabase to email it.
 * Always returns ok:true publicly to avoid leaking which emails are admins.
 */
export async function requestAdminLoginLink(
  email: string,
  redirectTo: string,
): Promise<RequestLinkResult> {
  const trimmed = email.trim().toLowerCase();
  const generic = {
    ok: true,
    message: "If this email is authorized, a sign-in link has been sent.",
  };

  if (!trimmed || !trimmed.includes("@")) {
    return generic;
  }

  // Allowlist check happens server-side BEFORE we touch Supabase.
  // Strangers don't trigger any email, don't burn rate limits, and
  // can't enumerate which addresses are valid.
  if (!isAllowedAdminEmail(trimmed)) {
    // Constant time-ish: do a small delay so the response timing doesn't
    // leak whether allowlist matched. (Not bulletproof but cheap.)
    await new Promise((r) => setTimeout(r, 250));
    return generic;
  }

  const admin = getSupabaseAdmin();

  // Use generateLink with type=magiclink. This both creates the link AND
  // (when SMTP is configured in Supabase) emails it to the user.
  const { error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: trimmed,
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error("[admin-auth] generateLink error:", error.message);
    // Still return generic OK to caller — log the real error server-side.
    return generic;
  }

  return generic;
}
