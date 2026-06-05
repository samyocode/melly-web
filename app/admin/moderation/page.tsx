// app/admin/moderation/page.tsx
//
// Human-review surface for the four-state image moderation pipeline. When the
// Worker returns `rejected`/`flagged`, record_moderation_result INSERTs into
// moderation_queue (entity_type='user_media', flag_source='sightengine'). This
// page lists open items (status pending/reviewing), renders the flagged image
// via a short-lived signed URL from the private `user-media` bucket, and lets a
// T&S admin reject / approve / dismiss — closing the "flagged = terminal,
// awaiting a human, but no human UI" gap.

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { canModerate } from "@/lib/admin-authz";
import { resolveModerationAction } from "../_actions";

export const dynamic = "force-dynamic";

interface QueueRow {
  id: string;
  entity_type: string;
  entity_id: string;
  flag_source: string;
  flag_data: Record<string, unknown> | null;
  severity: string;
  status: string;
  created_at: string;
}

const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-gray-100 text-gray-600",
};

async function load() {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from("moderation_queue")
    .select("id, entity_type, entity_id, flag_source, flag_data, severity, status, created_at")
    .in("status", ["pending", "reviewing"])
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as QueueRow[];

  // Resolve a signed preview URL for each user_media entity.
  const mediaIds = rows
    .filter((r) => r.entity_type === "user_media")
    .map((r) => r.entity_id);

  const previews = new Map<string, string>();
  if (mediaIds.length) {
    const { data: media } = await db
      .from("user_media")
      .select("id, storage_path")
      .in("id", mediaIds);
    for (const m of media ?? []) {
      const { data: signed } = await db.storage
        .from("user-media")
        .createSignedUrl(m.storage_path as string, 300);
      if (signed?.signedUrl) previews.set(m.id as string, signed.signedUrl);
    }
  }

  return { rows, previews };
}

export default async function ModerationPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin-ax7k2/login");
  if (!canModerate(session.role)) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Moderation</h1>
        <p className="mt-4 text-sm text-gray-500">
          Your role ({session.role}) doesn&apos;t have moderation access.
        </p>
      </div>
    );
  }

  const { rows, previews } = await load();

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Moderation</h1>
        <p className="mt-1 text-sm text-gray-500">
          {rows.length} open item{rows.length === 1 ? "" : "s"} awaiting review.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-sm text-gray-400">
          Queue is clear. Nothing awaiting review.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => {
            const preview = previews.get(r.entity_id);
            return (
              <div
                key={r.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt="flagged media"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">
                      {r.entity_type}
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded ${
                        SEVERITY_STYLES[r.severity] ?? SEVERITY_STYLES.low
                      }`}
                    >
                      {r.severity}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {r.flag_source}
                    </span>
                  </div>

                  {r.flag_data && (
                    <pre className="text-[11px] leading-relaxed text-gray-500 bg-gray-50 rounded p-2 max-h-28 overflow-auto">
                      {JSON.stringify(r.flag_data, null, 1)}
                    </pre>
                  )}

                  <div className="mt-auto grid grid-cols-3 gap-2">
                    {(
                      [
                        { d: "reject", label: "Reject", cls: "bg-red-600 text-white hover:bg-red-700" },
                        { d: "approve", label: "Approve", cls: "bg-green-600 text-white hover:bg-green-700" },
                        { d: "dismiss", label: "Dismiss", cls: "border border-gray-200 text-gray-600 hover:bg-gray-50" },
                      ] as const
                    ).map((b) => (
                      <form key={b.d} action={resolveModerationAction}>
                        <input type="hidden" name="queueId" value={r.id} />
                        <input type="hidden" name="entityType" value={r.entity_type} />
                        <input type="hidden" name="entityId" value={r.entity_id} />
                        <input type="hidden" name="decision" value={b.d} />
                        <button
                          type="submit"
                          className={`w-full rounded-lg px-2 py-1.5 text-xs font-medium ${b.cls}`}
                        >
                          {b.label}
                        </button>
                      </form>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
