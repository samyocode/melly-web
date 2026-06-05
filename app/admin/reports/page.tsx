// app/admin/reports/page.tsx
//
// Triage surface for user-filed reports (reports table, 008_admin_misc.sql).
// Lists open reports (pending/reviewing) with reporter + reported-entity context
// and lets a T&S admin action or dismiss, stamping resolved_by/resolved_at.

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { canModerate } from "@/lib/admin-authz";
import { resolveReportAction } from "../_actions";

export const dynamic = "force-dynamic";

interface ReportRow {
  id: string;
  reporter_id: string | null;
  reported_user_id: string | null;
  reported_plan_id: string | null;
  reported_message_id: string | null;
  reported_media_id: string | null;
  category: string;
  description: string | null;
  status: string;
  created_at: string;
}

async function load() {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from("reports")
    .select(
      "id, reporter_id, reported_user_id, reported_plan_id, reported_message_id, reported_media_id, category, description, status, created_at",
    )
    .in("status", ["pending", "reviewing"])
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as ReportRow[];

  // Resolve display names for the people involved.
  const userIds = new Set<string>();
  for (const r of rows) {
    if (r.reporter_id) userIds.add(r.reporter_id);
    if (r.reported_user_id) userIds.add(r.reported_user_id);
  }
  const names = new Map<string, string>();
  if (userIds.size) {
    const { data: users } = await db
      .from("users")
      .select("id, display_name, handle")
      .in("id", [...userIds]);
    for (const u of users ?? []) {
      names.set(
        u.id as string,
        (u.display_name as string) || `@${u.handle as string}`,
      );
    }
  }

  return { rows, names };
}

function targetSummary(r: ReportRow): string {
  if (r.reported_user_id) return "user";
  if (r.reported_plan_id) return "plan";
  if (r.reported_message_id) return "message";
  if (r.reported_media_id) return "media";
  return "—";
}

export default async function ReportsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin-ax7k2/login");
  if (!canModerate(session.role)) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="mt-4 text-sm text-gray-500">
          Your role ({session.role}) doesn&apos;t have moderation access.
        </p>
      </div>
    );
  }

  const { rows, names } = await load();

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          {rows.length} open report{rows.length === 1 ? "" : "s"} awaiting
          triage.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-sm text-gray-400">
          No open reports.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-700">
                  {r.category.replace(/_/g, " ")}
                </span>
                <span className="text-[11px] text-gray-400">
                  on {targetSummary(r)}
                </span>
                <span className="ml-auto text-[11px] text-gray-400">
                  {new Date(r.created_at).toLocaleString()}
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <span className="text-gray-400">Reporter:</span>{" "}
                {r.reporter_id ? (names.get(r.reporter_id) ?? "—") : "—"}
                {r.reported_user_id && (
                  <>
                    {"  ·  "}
                    <span className="text-gray-400">Reported:</span>{" "}
                    {names.get(r.reported_user_id) ?? "—"}
                  </>
                )}
              </div>

              {r.description && (
                <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  {r.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-end gap-2">
                <form action={resolveReportAction} className="flex items-end gap-2 flex-1">
                  <input type="hidden" name="reportId" value={r.id} />
                  <input type="hidden" name="decision" value="action" />
                  <label className="flex-1">
                    <span className="block text-[11px] text-gray-400 mb-1">
                      Resolution note (optional)
                    </span>
                    <input
                      name="resolution"
                      type="text"
                      placeholder="e.g. Removed media, warned user"
                      className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                  >
                    Action
                  </button>
                </form>
                <form action={resolveReportAction}>
                  <input type="hidden" name="reportId" value={r.id} />
                  <input type="hidden" name="decision" value="dismiss" />
                  <button
                    type="submit"
                    className="rounded-lg border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Dismiss
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
