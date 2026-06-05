// app/admin/users/page.tsx
//
// Searchable user table over the live `users` schema. Search by handle or
// display_name (GET ?q=). Moderators can Remove (soft-delete → 30-day
// reactivation/tombstone flow) or Restore a user. There is no hard-delete or
// ban column in the schema — soft-delete via deleted_at is the only lever.

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { canModerate } from "@/lib/admin-authz";
import { setUserDeletedAction } from "../_actions";

export const dynamic = "force-dynamic";

interface UserRow {
  id: string;
  handle: string;
  display_name: string | null;
  has_completed_onboarding: boolean;
  is_dating_mode: boolean;
  is_verified: boolean;
  created_at: string;
  deleted_at: string | null;
}

async function load(q: string): Promise<UserRow[]> {
  const db = getSupabaseAdmin();
  let query = db
    .from("users")
    .select(
      "id, handle, display_name, has_completed_onboarding, is_dating_mode, is_verified, created_at, deleted_at",
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const term = q.trim();
  if (term) {
    // Match handle OR display_name, case-insensitive.
    query = query.or(
      `handle.ilike.%${term}%,display_name.ilike.%${term}%`,
    );
  }

  const { data } = await query;
  return (data ?? []) as UserRow[];
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin-ax7k2/login");

  const { q = "" } = await searchParams;
  const rows = await load(q);
  const mayModerate = canModerate(session.role);

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search and manage user accounts.
        </p>
      </div>

      <form method="GET" className="flex gap-2 max-w-md">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search handle or name…"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Search
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 uppercase tracking-wider">
            <tr className="border-b border-gray-200">
              <th className="text-left font-medium px-5 py-2.5">Name</th>
              <th className="text-left font-medium px-5 py-2.5">Handle</th>
              <th className="text-left font-medium px-5 py-2.5">Status</th>
              <th className="text-left font-medium px-5 py-2.5">Joined</th>
              {mayModerate && (
                <th className="text-right font-medium px-5 py-2.5">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={mayModerate ? 5 : 4}
                  className="px-5 py-8 text-center text-gray-400"
                >
                  {q ? "No users match that search." : "No users yet."}
                </td>
              </tr>
            ) : (
              rows.map((u) => {
                const removed = Boolean(u.deleted_at);
                return (
                  <tr
                    key={u.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-5 py-3">
                      <span className={removed ? "text-gray-400 line-through" : ""}>
                        {u.display_name ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {u.handle ? `@${u.handle}` : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {removed && (
                          <Badge className="bg-red-100 text-red-700">
                            removed
                          </Badge>
                        )}
                        {!u.has_completed_onboarding && !removed && (
                          <Badge className="bg-gray-100 text-gray-500">
                            onboarding
                          </Badge>
                        )}
                        {u.is_verified && (
                          <Badge className="bg-blue-100 text-blue-700">
                            verified
                          </Badge>
                        )}
                        {u.is_dating_mode && (
                          <Badge className="bg-pink-100 text-pink-700">
                            dating
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    {mayModerate && (
                      <td className="px-5 py-3 text-right">
                        <form
                          action={setUserDeletedAction}
                          className="inline"
                        >
                          <input type="hidden" name="userId" value={u.id} />
                          <input
                            type="hidden"
                            name="decision"
                            value={removed ? "restore" : "remove"}
                          />
                          <button
                            type="submit"
                            className={`rounded-lg px-3 py-1 text-xs font-medium ${
                              removed
                                ? "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                : "text-red-600 hover:bg-red-50"
                            }`}
                          >
                            {removed ? "Restore" : "Remove"}
                          </button>
                        </form>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {mayModerate && (
        <p className="text-xs text-gray-400">
          &ldquo;Remove&rdquo; soft-deletes the account (30-day reactivation
          grace, then PII-scrub + tombstone). It does not hard-delete.
        </p>
      )}
    </div>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${className}`}
    >
      {children}
    </span>
  );
}
