"use server";

// app/admin/_actions.ts
//
// Server actions for the moderation surfaces. Every action RE-CHECKS the
// session + role server-side (never trust the client / hidden form fields for
// authorization), performs the privileged write via the service-role client,
// writes an immutable admin_audit_log entry, and revalidates the page.

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { canModerate, isSuperAdmin, logAdminAction } from "@/lib/admin-authz";

async function requireModerator() {
  const session = await getAdminSession();
  if (!session || !canModerate(session.role)) {
    throw new Error("Not authorized");
  }
  return session;
}

async function requireSuperAdmin() {
  const session = await getAdminSession();
  if (!session || !isSuperAdmin(session.role)) {
    throw new Error("Not authorized");
  }
  return session;
}

// ---- Moderation queue -----------------------------------------------------
// decision: 'reject' (hide media + close), 'approve' (restore media + close),
//           'dismiss' (close item, leave media as-is).
export async function resolveModerationAction(formData: FormData) {
  const session = await requireModerator();
  const db = getSupabaseAdmin();

  const queueId = String(formData.get("queueId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const entityType = String(formData.get("entityType") ?? "");
  const entityId = String(formData.get("entityId") ?? "");
  if (!queueId || !decision) throw new Error("Missing fields");

  // Mirror the verdict onto the underlying entity (currently user_media is the
  // only flag_source=sightengine entity, but guard by entity_type anyway).
  if (entityType === "user_media" && entityId) {
    if (decision === "reject") {
      await db
        .from("user_media")
        .update({ moderation_status: "rejected", updated_at: new Date().toISOString() })
        .eq("id", entityId);
    } else if (decision === "approve") {
      await db
        .from("user_media")
        .update({ moderation_status: "approved", updated_at: new Date().toISOString() })
        .eq("id", entityId);
    }
  }

  const queueStatus = decision === "reject" ? "actioned" : "dismissed";
  await db
    .from("moderation_queue")
    .update({
      status: queueStatus,
      assigned_to: session.adminId,
      actioned_at: new Date().toISOString(),
      action_taken: decision,
    })
    .eq("id", queueId);

  await logAdminAction({
    adminId: session.adminId,
    action: `moderation.${decision}`,
    targetType: entityType || "moderation_queue",
    targetId: entityId || queueId,
    details: { queueId, decision },
  });

  revalidatePath("/admin/moderation");
}

// ---- Reports --------------------------------------------------------------
// decision: 'action' | 'dismiss'
export async function resolveReportAction(formData: FormData) {
  const session = await requireModerator();
  const db = getSupabaseAdmin();

  const reportId = String(formData.get("reportId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const resolution = String(formData.get("resolution") ?? "").slice(0, 500);
  if (!reportId || !decision) throw new Error("Missing fields");

  const status = decision === "action" ? "actioned" : "dismissed";
  await db
    .from("reports")
    .update({
      status,
      resolution: resolution || null,
      resolved_by: session.adminId,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", reportId);

  await logAdminAction({
    adminId: session.adminId,
    action: `report.${decision}`,
    targetType: "reports",
    targetId: reportId,
    details: { decision, resolution: resolution || undefined },
  });

  revalidatePath("/admin/reports");
}

// ---- Imported events ------------------------------------------------------
// decision: 'approve' | 'reject'
export async function resolveEventAction(formData: FormData) {
  const session = await requireModerator();
  const db = getSupabaseAdmin();

  const eventId = String(formData.get("eventId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!eventId || !decision) throw new Error("Missing fields");

  const moderation_status = decision === "approve" ? "approved" : "rejected";
  await db
    .from("events")
    .update({ moderation_status, updated_at: new Date().toISOString() })
    .eq("id", eventId);

  await logAdminAction({
    adminId: session.adminId,
    action: `event.${decision}`,
    targetType: "events",
    targetId: eventId,
    details: { decision },
  });

  revalidatePath("/admin/events");
}

// ---- Users ----------------------------------------------------------------
// decision: 'remove' (soft-delete → enters the 30-day reactivation/tombstone
//           flow) | 'restore' (clear deleted_at). No hard delete here.
export async function setUserDeletedAction(formData: FormData) {
  const session = await requireModerator();
  const db = getSupabaseAdmin();

  const userId = String(formData.get("userId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!userId || !["remove", "restore"].includes(decision)) {
    throw new Error("Missing/invalid fields");
  }

  await db
    .from("users")
    .update({
      deleted_at: decision === "remove" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  await logAdminAction({
    adminId: session.adminId,
    action: `user.${decision}`,
    targetType: "users",
    targetId: userId,
    details: { decision },
  });

  revalidatePath("/admin/users");
}

// ---- App config (super_admin only) ----------------------------------------
// Edits a single app_config row's JSONB value. Sensitive (e.g.
// moderation_enabled) → gated to super_admin, not all moderators.
export async function updateConfigAction(formData: FormData) {
  const session = await requireSuperAdmin();
  const db = getSupabaseAdmin();

  const key = String(formData.get("key") ?? "");
  const rawValue = String(formData.get("value") ?? "");
  if (!key) throw new Error("Missing key");

  // The form submits the JSON text. Parse it so we store real JSONB
  // (a bare `true`, number, string, object, etc.) — never a quoted string.
  let value: unknown;
  try {
    value = JSON.parse(rawValue);
  } catch {
    throw new Error(`Invalid JSON for "${key}": ${rawValue}`);
  }

  // Only update existing keys — never invent config rows from the UI.
  const { data: existing } = await db
    .from("app_config")
    .select("key")
    .eq("key", key)
    .maybeSingle();
  if (!existing) throw new Error(`Unknown config key: ${key}`);

  await db
    .from("app_config")
    .update({
      value: value as never,
      updated_by: session.adminId,
      updated_at: new Date().toISOString(),
    })
    .eq("key", key);

  await logAdminAction({
    adminId: session.adminId,
    action: "config.update",
    targetType: "app_config",
    targetId: key,
    details: { key, value },
  });

  revalidatePath("/admin/settings");
}
