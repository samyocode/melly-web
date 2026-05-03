// lib/supabase-server.ts
//
// Server-side Supabase client for SSR/SSG queries. Uses the public anon
// key — only data exposed by RLS policies (or the venue_seo_aggregates
// materialized view) is reachable. No service-role key here.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}

export const supabaseServer = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    fetch: (input, init) =>
      fetch(input, { ...init, next: { revalidate: 3600 } }),
  },
});
