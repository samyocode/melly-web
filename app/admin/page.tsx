// app/admin/page.tsx

import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

interface Stat {
  label: string;
  value: string | number;
  hint?: string;
}

async function getStats(): Promise<Stat[]> {
  const admin = getSupabaseAdmin();

  // Counts. We use head:true + count:'exact' to avoid pulling rows.
  const [realUsers, seedUsers, onboarded, readyToMatch, settingsRow] =
    await Promise.all([
      admin
        .from("profiles")
        .select("user_id", { count: "exact", head: true })
        .eq("is_seed", false),
      admin
        .from("profiles")
        .select("user_id", { count: "exact", head: true })
        .eq("is_seed", true),
      admin
        .from("profiles")
        .select("user_id", { count: "exact", head: true })
        .eq("is_onboarded", true)
        .eq("is_seed", false),
      admin
        .from("profiles")
        .select("user_id", { count: "exact", head: true })
        .eq("ready_to_match", true)
        .eq("is_seed", false),
      admin
        .from("admin_settings")
        .select("value")
        .eq("key", "expose_seeds_to_real_users")
        .maybeSingle(),
    ]);

  const exposeSeeds = settingsRow.data?.value === true;

  return [
    {
      label: "Real users",
      value: realUsers.count ?? 0,
    },
    {
      label: "Onboarded",
      value: onboarded.count ?? 0,
      hint: "Real users who completed onboarding",
    },
    {
      label: "Ready to match",
      value: readyToMatch.count ?? 0,
      hint: "Real users with ready_to_match = true",
    },
    {
      label: "Seed profiles",
      value: seedUsers.count ?? 0,
      hint: exposeSeeds
        ? "Visible in real users' feeds"
        : "Hidden from real users",
    },
  ];
}

async function getRecentSignups() {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("profiles")
    .select("user_id, name, email, created_at, is_onboarded, is_seed")
    .eq("is_seed", false)
    .order("created_at", { ascending: false })
    .limit(8);
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          <p className="mt-0.5 text-xs text-gray-500">
            Latest 8 real users to join.
          </p>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 uppercase tracking-wider">
            <tr className="border-b border-gray-200">
              <th className="text-left font-medium px-5 py-2.5">Name</th>
              <th className="text-left font-medium px-5 py-2.5">Email</th>
              <th className="text-left font-medium px-5 py-2.5">Onboarded</th>
              <th className="text-left font-medium px-5 py-2.5">Joined</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                  No real users yet.
                </td>
              </tr>
            ) : (
              recent.map((u) => (
                <tr
                  key={u.user_id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-5 py-3">{u.name ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-500 truncate max-w-xs">
                    {u.email ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    {u.is_onboarded ? (
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
