// lib/admin-authz.ts
//
// Bridges the signed-cookie session (admin-session.ts) to the REAL `admins`
// table that the mobile app's schema ships (008_admin_misc.sql):
//
//   admins(id, email UNIQUE, display_name, role, is_active, last_login_at, ...)
//   admin_audit_log(id, admin_id, action, target_type, target_id, details, ...)
//
// The env ADMIN_EMAILS allowlist is now a BOOTSTRAP gate only: an email in the
// allowlist that isn't yet a row gets auto-provisioned as `super_admin` on first
// login. After that, role is managed in the table (so a super_admin can add a
// `t_and_s`/`support`/`ops` member via SQL/UI and they sign in WITHOUT being in
// the env var). Source of truth = the table; env = who may bootstrap.
//
// Server-side only — pulls in the service-role client.

import { getSupabaseAdmin } from "./supabase-admin";
import { isAllowedAdminEmail, type AdminRole } from "./admin-session";

export interface AdminRecord {
  id: string;
  email: string;
  display_name: string;
  role: AdminRole;
  is_active: boolean;
}

/**
 * Resolve (and if needed bootstrap-provision) the admins row for a verified
 * email. Returns null when the email is neither an active admin nor in the
 * bootstrap allowlist. Also stamps last_login_at.
 *
 * Call this ONLY after the email has been proven (verified magic-link OTP).
 */
export async function resolveOrProvisionAdmin(
  email: string,
): Promise<AdminRecord | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  const db = getSupabaseAdmin();

  const { data: existing, error } = await db
    .from("admins")
    .select("id, email, display_name, role, is_active")
    .eq("email", normalized)
    .maybeSingle();

  if (error) {
    console.error("[admin-authz] lookup error:", error.message);
    return null;
  }

  if (existing) {
    if (!existing.is_active) return null; // deactivated → no entry, even if allowlisted
    await db
      .from("admins")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", existing.id);
    return existing as AdminRecord;
  }

  // No row yet. Only the bootstrap allowlist may auto-provision (as super_admin).
  if (!isAllowedAdminEmail(normalized)) return null;

  const { data: created, error: insertErr } = await db
    .from("admins")
    .insert({
      email: normalized,
      display_name: normalized.split("@")[0],
      role: "super_admin",
      last_login_at: new Date().toISOString(),
    })
    .select("id, email, display_name, role, is_active")
    .single();

  if (insertErr || !created) {
    console.error("[admin-authz] provision error:", insertErr?.message);
    return null;
  }

  return created as AdminRecord;
}

/**
 * Append an immutable entry to admin_audit_log. Best-effort: never throws —
 * an audit-write failure must not break the action it records (we log it).
 */
export async function logAdminAction(params: {
  adminId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  try {
    const db = getSupabaseAdmin();
    await db.from("admin_audit_log").insert({
      admin_id: params.adminId,
      action: params.action,
      target_type: params.targetType ?? null,
      target_id: params.targetId ?? null,
      details: params.details ?? {},
    });
  } catch (err) {
    console.error("[admin-authz] audit-log write failed:", err);
  }
}

/**
 * Whether an email may be SENT a login link: either an active admins row or in
 * the bootstrap allowlist. (The callback still re-verifies via
 * resolveOrProvisionAdmin before issuing a cookie — this only gates emailing.)
 */
export async function isKnownAdminEmail(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  if (isAllowedAdminEmail(normalized)) return true;

  const { data } = await getSupabaseAdmin()
    .from("admins")
    .select("id")
    .eq("email", normalized)
    .eq("is_active", true)
    .maybeSingle();
  return Boolean(data);
}

// Coarse role gates. Moderation/reports = T&S work; super_admin can do anything.
export function canModerate(role: AdminRole): boolean {
  return role === "super_admin" || role === "t_and_s";
}

export function isSuperAdmin(role: AdminRole): boolean {
  return role === "super_admin";
}
