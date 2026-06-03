// lib/supabase-share.ts
//
// SECOND Supabase client, used ONLY by the share feature (lib/share.ts).
//
// Why a separate client: this site's primary client (lib/supabase-server.ts)
// points at the marketing/date-spots Supabase project. But the share RPCs
// (get_shared_list / resolve_share_token) and the app tables they read
// (place_lists, places, users, user_media) + the share tokens themselves live
// in the *social-app* project — a different Supabase project. So share reads
// MUST target that project, not the date-spots one.
//
// Config: NEXT_PUBLIC_SHARE_SUPABASE_URL / NEXT_PUBLIC_SHARE_SUPABASE_ANON_KEY
// (the social-app project's URL + anon/publishable key). Falls back to the
// primary NEXT_PUBLIC_SUPABASE_* if unset, so local dev keeps working when the
// primary already points at social-app — but PRODUCTION MUST set the SHARE_*
// vars (its primary points at the date-spots project, where share would 404).

import { createClient } from "@supabase/supabase-js";

const usingFallback = !process.env.NEXT_PUBLIC_SHARE_SUPABASE_URL;

export const SHARE_SUPABASE_URL = (
  process.env.NEXT_PUBLIC_SHARE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ""
).replace(/\/$/, "");

const anonKey =
  process.env.NEXT_PUBLIC_SHARE_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SHARE_SUPABASE_URL || !anonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SHARE_SUPABASE_URL / NEXT_PUBLIC_SHARE_SUPABASE_ANON_KEY " +
      "(the social-app Supabase project, where the share RPCs live)",
  );
}

if (usingFallback) {
  // Loud in logs so a production misconfig (sharing the date-spots project) is
  // obvious — that project has no get_shared_list and every link will 404.
  console.warn(
    "[share] NEXT_PUBLIC_SHARE_SUPABASE_URL not set — falling back to the primary " +
      "Supabase project. Share links will only work if that project is social-app.",
  );
}

export const supabaseShare = createClient(SHARE_SUPABASE_URL, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
