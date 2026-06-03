// lib/share.ts
//
// The share layer: token-gated read-only access to app entities for the public
// web (see the social-app repo's docs/specs/SHARE_SYSTEM_SPEC.md). A share link
// carries an unguessable `?t=<token>` — the token IS the view grant. All reads
// go through anon-granted, token-gated `get_shared_*` / `resolve_share_token`
// RPCs via the server anon client. No writes, no auth.
//
// The path segments below MUST stay identical to the app's Expo Router routes
// (src/features/share/shareRegistry.ts) and the AASA `paths`, so a universal
// link opens the matching native screen and the web fallback renders the
// matching page.

import { supabaseServer } from "./supabase-server";

export type ShareableType =
  | "list"
  | "place"
  | "plan"
  | "profile"
  | "event"
  | "ranking"
  | "post";

/** URL path segment per type (identical to the app routes). */
export const PATH_SEGMENT: Record<ShareableType, string> = {
  list: "list",
  place: "place",
  plan: "plan",
  profile: "u",
  event: "event",
  ranking: "ranked",
  post: "post",
};

/** Reverse map: URL segment → entity type. */
export const SEGMENT_TO_TYPE: Record<string, ShareableType> = Object.fromEntries(
  Object.entries(PATH_SEGMENT).map(([type, seg]) => [seg, type as ShareableType]),
) as Record<string, ShareableType>;

/** A human noun for copy ("Open this list in Melly"). */
export function shareNoun(type: ShareableType): string {
  switch (type) {
    case "list":
      return "list";
    case "place":
      return "place";
    case "plan":
      return "plan";
    case "profile":
      return "profile";
    case "event":
      return "event";
    case "ranking":
      return "ranking";
    case "post":
      return "post";
  }
}

/** Read the share token from a Next.js searchParams object. */
export function readToken(
  searchParams: Record<string, string | string[] | undefined> | undefined,
): string | null {
  const t = searchParams?.t;
  if (!t) return null;
  return Array.isArray(t) ? (t[0] ?? null) : t;
}

/** Resolve an avatar storage path to a public URL (places' `photo_url` is
 *  already a ready URL; avatar `photo_path` is a raw `user-media` storage path). */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  return `${base}/storage/v1/object/public/user-media/${path}`;
}

// ─── Payload types (mirror 20260621000800_share_tokens.sql in social-app) ─────

export type SharedContributor = {
  display_name: string | null;
  handle: string | null;
  photo_path: string | null;
};

export type SharedMember = {
  display_name: string | null;
  handle: string | null;
  role: string;
  photo_path: string | null;
};

export type SharedItem = {
  place_id: string;
  name: string;
  city: string | null;
  category: string | null;
  photo_url: string | null;
  lat: number | null;
  lng: number | null;
  contributor_count: number;
  is_overlap: boolean;
  contributors: SharedContributor[];
};

export type SharedList = {
  list: { id: string; name: string; description: string | null };
  members: SharedMember[];
  items: SharedItem[];
};

// ─── Token-gated reads ────────────────────────────────────────────────────────

/** Read a shared list by token. Null for an invalid/expired/non-list token. */
export async function getSharedList(token: string): Promise<SharedList | null> {
  const { data, error } = await supabaseServer.rpc("get_shared_list", {
    p_token: token,
  });
  if (error) {
    console.error("get_shared_list failed:", error.message);
    return null;
  }
  return (data as SharedList | null) ?? null;
}

/** Validate a token and learn what it points at (anon). Used to route fallbacks. */
export async function resolveShareToken(
  token: string,
): Promise<{ entity_type: ShareableType; entity_id: string } | null> {
  const { data, error } = await supabaseServer.rpc("resolve_share_token", {
    p_token: token,
  });
  if (error) {
    console.error("resolve_share_token failed:", error.message);
    return null;
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.out_entity_type) return null;
  return {
    entity_type: row.out_entity_type as ShareableType,
    entity_id: row.out_entity_id as string,
  };
}
