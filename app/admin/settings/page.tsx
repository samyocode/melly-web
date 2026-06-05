// app/admin/settings/page.tsx
//
// Live app configuration, backed by the REAL `app_config` table (key + JSONB
// value + description + environment + updated_by/updated_at). Super-admin only:
// these flags (moderation_enabled, rate limits, slot counts, …) drive the live
// app, so edits are gated above general moderation access and fully audited.
//
// (Replaces the prior version that read a non-existent `admin_settings` table
//  with a single hardcoded "expose seeds" toggle.)

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isSuperAdmin } from "@/lib/admin-authz";
import { updateConfigAction } from "../_actions";

export const dynamic = "force-dynamic";

interface ConfigRow {
  key: string;
  value: unknown;
  environment: string;
  description: string | null;
  updated_at: string | null;
}

async function load(): Promise<ConfigRow[]> {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from("app_config")
    .select("key, value, environment, description, updated_at")
    .order("key", { ascending: true });
  return (data ?? []) as ConfigRow[];
}

export default async function SettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin-ax7k2/login");
  if (!isSuperAdmin(session.role)) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-4 text-sm text-gray-500">
          App configuration is restricted to super admins.
        </p>
      </div>
    );
  }

  const rows = await load();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Live <code className="text-xs">app_config</code> flags. Values are JSON
          — a bare <code className="text-xs">true</code>,{" "}
          <code className="text-xs">15</code>, or an object. Changes take effect
          immediately.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-sm text-gray-400">
          No config rows found.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <form
              key={r.key}
              action={updateConfigAction}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <input type="hidden" name="key" value={r.key} />
              <div className="flex flex-wrap items-baseline gap-2">
                <code className="text-sm font-semibold">{r.key}</code>
                <span className="text-[10px] uppercase tracking-wider text-gray-400">
                  {r.environment}
                </span>
              </div>
              {r.description && (
                <p className="mt-1 text-xs text-gray-500">{r.description}</p>
              )}
              <div className="mt-3 flex gap-2">
                <input
                  name="value"
                  defaultValue={JSON.stringify(r.value)}
                  spellCheck={false}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-mono"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-700"
                >
                  Save
                </button>
              </div>
              {r.updated_at && (
                <p className="mt-2 text-[11px] text-gray-400">
                  Last changed {new Date(r.updated_at).toLocaleString()}
                </p>
              )}
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
