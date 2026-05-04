// lib/supabase-admin.ts
//
// Service-role Supabase client for admin operations.
// NEVER import this from a Client Component — it has full DB access
// and bypasses all RLS. Server-side only (route handlers, server components,
// middleware via .server context).

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

// Singleton — avoid recreating on every request.
let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. This client cannot run without it.",
    );
  }
  if (!_admin) {
    _admin = createClient(url!, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return _admin;
}
