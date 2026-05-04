// app/admin/settings/page.tsx

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import ExposeSeedsToggle from "./ExposeSeedsToggle";

export const dynamic = "force-dynamic";

async function getSetting(key: string) {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("admin_settings")
    .select("value, updated_at, updated_by")
    .eq("key", key)
    .maybeSingle();
  return data;
}

export default async function SettingsPage() {
  const exposeSeeds = await getSetting("expose_seeds_to_real_users");
  const exposeValue = exposeSeeds?.value === true;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Global flags that affect the live app.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-sm font-semibold">
              Show seed profiles to real users
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              When ON, AI-generated seed profiles appear in real users&apos;
              match feeds. Turn OFF as the real user base grows.
            </p>
            {exposeSeeds?.updated_at && (
              <p className="mt-2 text-xs text-gray-400">
                Last changed {new Date(exposeSeeds.updated_at).toLocaleString()}
                {exposeSeeds.updated_by ? ` by ${exposeSeeds.updated_by}` : ""}
              </p>
            )}
          </div>
          <ExposeSeedsToggle initialValue={exposeValue} />
        </div>
      </div>
    </div>
  );
}
