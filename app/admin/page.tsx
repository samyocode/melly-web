// app/admin/page.tsx
//
// Overview dashboard, queried against the REAL mobile-app schema:
//   users(id, handle, display_name, has_completed_onboarding, is_dating_mode,
//         created_at, deleted_at, ...)
//
// (The previous version queried a `profiles`/`is_seed`/`admin_settings` schema
//  that does not exist in this database — it would have errored against live
//  data. See the admins/moderation tables in supabase migration 008.)

import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

interface Stat {
  label: string;
  value: number;
  hint?: string;
}

function sinceIso(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

async function getStats(): Promise<Stat[]> {
  const db = getSupabaseAdmin();

  const [total, onboarded, dating, last7, pendingMod, openReports] =
    await Promise.all([
      db
        .from("users")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null),
      db
        .from("users")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .eq("has_completed_onboarding", true),
      db
        .from("users")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .eq("is_dating_mode", true),
      db
        .from("users")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .gte("created_at", sinceIso(7)),
      db
        .from("moderation_queue")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      db
        .from("reports")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);

  return [
    { label: "Users", value: total.count ?? 0, hint: "Active (not deleted)" },
    {
      label: "Onboarded",
      value: onboarded.count ?? 0,
      hint: "Completed onboarding",
    },
    { label: "New (7d)", value: last7.count ?? 0, hint: "Signed up this week" },
    { label: "Dating mode", value: dating.count ?? 0, hint: "Opted in" },
    {
      label: "Mod queue",
      value: pendingMod.count ?? 0,
      hint: "Pending review",
    },
    {
      label: "Open reports",
      value: openReports.count ?? 0,
      hint: "Awaiting triage",
    },
  ];
}

async function getRecentSignups() {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from("users")
    .select("id, handle, display_name, created_at, has_completed_onboarding")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(10);
  return data ?? [];
}

export default async function OverviewPage() {
  const [stats, recent] = await Promise.all([getStats(), getRecentSignups()]);

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Snapshot of the Melly user base.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <div className="text-xs uppercase tracking-wider text-gray-400">
              {s.label}
            </div>
            <div className="mt-2 text-3xl font-semibold tabular-nums">
              {s.value.toLocaleString()}
            </div>
            {s.hint && (
              <div className="mt-1 text-xs text-gray-500">{s.hint}</div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold">Recent signups</h2>
          <p className="mt-0.5 text-xs text-gray-500">Latest 10 to join.</p>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 uppercase tracking-wider">
            <tr className="border-b border-gray-200">
              <th className="text-left font-medium px-5 py-2.5">Name</th>
              <th className="text-left font-medium px-5 py-2.5">Handle</th>
              <th className="text-left font-medium px-5 py-2.5">Onboarded</th>
              <th className="text-left font-medium px-5 py-2.5">Joined</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                  No users yet.
                </td>
              </tr>
            ) : (
              recent.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-5 py-3">{u.display_name ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {u.handle ? `@${u.handle}` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    {u.has_completed_onboarding ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
