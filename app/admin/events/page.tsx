// app/admin/events/page.tsx
//
// Approval surface for imported events. The host-crawl/import mouth lands events
// `moderation_status='pending'` → invisible to non-creators until approved, but
// there was no flip-to-approved UI (TestFlight blocker #7). This lists pending
// events and lets a T&S admin approve or reject them.

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { canModerate } from "@/lib/admin-authz";
import { resolveEventAction } from "../_actions";

export const dynamic = "force-dynamic";

interface EventRow {
  id: string;
  host_name: string;
  category: string | null;
  city: string | null;
  starts_at: string;
  source_url: string | null;
  source_platform: string | null;
  created_at: string;
}

async function load(): Promise<EventRow[]> {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from("events")
    .select(
      "id, host_name, category, city, starts_at, source_url, source_platform, created_at",
    )
    .eq("moderation_status", "pending")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data ?? []) as EventRow[];
}

export default async function EventsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin-ax7k2/login");
  if (!canModerate(session.role)) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
        <p className="mt-4 text-sm text-gray-500">
          Your role ({session.role}) doesn&apos;t have moderation access.
        </p>
      </div>
    );
  }

  const rows = await load();

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
        <p className="mt-1 text-sm text-gray-500">
          {rows.length} imported event{rows.length === 1 ? "" : "s"} pending
          approval.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-sm text-gray-400">
          Nothing pending. Imported events appear here for approval.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {rows.map((e) => (
            <div
              key={e.id}
              className="p-5 flex flex-wrap items-center gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">
                  {e.host_name || e.category || "Event"}
                </div>
                <div className="mt-0.5 text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5">
                  {e.category && <span>{e.category}</span>}
                  {e.city && <span>{e.city}</span>}
                  <span>{new Date(e.starts_at).toLocaleString()}</span>
                  {e.source_platform && (
                    <span className="text-gray-400">via {e.source_platform}</span>
                  )}
                </div>
                {e.source_url && (
                  <a
                    href={e.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs text-pink-600 hover:underline truncate max-w-full"
                  >
                    {e.source_url}
                  </a>
                )}
              </div>

              <div className="flex gap-2">
                <form action={resolveEventAction}>
                  <input type="hidden" name="eventId" value={e.id} />
                  <input type="hidden" name="decision" value="approve" />
                  <button
                    type="submit"
                    className="rounded-lg bg-green-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                  >
                    Approve
                  </button>
                </form>
                <form action={resolveEventAction}>
                  <input type="hidden" name="eventId" value={e.id} />
                  <input type="hidden" name="decision" value="reject" />
                  <button
                    type="submit"
                    className="rounded-lg border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Reject
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
