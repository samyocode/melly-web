// app/admin/layout.tsx
//
// Passthrough layout. This file was previously empty (0 bytes), which is not a
// valid module and broke `next build` (TS: "is not a module"). Restored to a
// minimal passthrough so the route group compiles; admin auth gating lives in
// the pages / lib/admin-session, not here.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
