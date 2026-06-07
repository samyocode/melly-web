// lib/supabase-share.ts
//
// The anon Supabase client for the public share/entity pages (lib/share.ts).
//
// The share + SEO RPCs (get_shared_list / resolve_share_token / seo_get_place /
// seo_get_event) and the app tables they read (place_lists, places, events,
// users, user_media) + the share tokens all live in the *social-app* Supabase
// project, so these reads target that project.
//
// Config: NEXT_PUBLIC_SHARE_SUPABASE_URL / NEXT_PUBLIC_SHARE_SUPABASE_ANON_KEY
// (the social-app project's URL + anon/publishable key). Falls back to
// NEXT_PUBLIC_SUPABASE_* if unset — PRODUCTION should set the SHARE_* vars (or
// point the base vars at social-app), else every entity page 404s.

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
