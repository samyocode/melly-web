// app/admin/layout.tsx
//
// Authenticated admin shell: sidebar nav + signed-in identity + logout.
// Middleware already 404s unauthenticated requests under /admin; reading the
// session here is the second line of defense (and how we render the nav + role).

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { canModerate, isSuperAdmin } from "@/lib/admin-authz";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata = {
  title: "Melly Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Defense in depth. Middleware should already have blocked this, but if the
  // cookie is missing/expired we bounce to the (unguessable) login path rather
  // than render a shell with no identity.
  if (!session) {
    redirect("/admin-ax7k2/login");
  }

  return (
    <div className="min-h-screen bg-stone-50 text-gray-900">
      <div className="flex">
        <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-gray-200 bg-white">
          <div className="px-5 py-5 border-b border-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-pink-600" />
              <span className="font-semibold tracking-tight">Melly Admin</span>
            </div>
          </div>

          <AdminNav
            canModerate={canModerate(session.role)}
            isSuperAdmin={isSuperAdmin(session.role)}
          />

          <div className="mt-auto px-5 py-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 truncate" title={session.email}>
              {session.email}
            </div>
            <div className="mt-0.5 text-[11px] uppercase tracking-wider text-pink-600">
              {session.role.replace(/_/g, " ")}
            </div>
            <LogoutButton />
          </div>
        </aside>

        <main className="flex-1 md:pl-60">
          <div className="px-6 py-8 md:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
