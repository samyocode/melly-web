// app/api/admin/settings/route.ts
//
// Update an admin_settings key. Middleware has already verified the
// caller is an authenticated admin and stamped x-admin-email.

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const ALLOWED_KEYS = new Set(["expose_seeds_to_real_users"]);

export async function PATCH(req: NextRequest) {
  const adminEmail = req.headers.get("x-admin-email");
  if (!adminEmail) {
    return new NextResponse("Not Found", { status: 404 });
  }

  let key: string;
  let value: unknown;
  try {
    const body = await req.json();
    key = String(body?.key ?? "");
    value = body?.value;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!ALLOWED_KEYS.has(key)) {
    return NextResponse.json(
      { ok: false, error: "unknown setting key" },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdmin();

  const { error: upsertErr } = await admin.from("admin_settings").upsert(
    {
      key,
      value: value as never,
      updated_by: adminEmail,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (upsertErr) {
    console.error("[admin/settings] upsert failed:", upsertErr);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // Best-effort audit log
  admin
    .from("admin_audit_log")
    .insert({
      actor_email: adminEmail,
      action: "update_setting",
      target_id: key,
      details: { value },
    })
    .then(({ error }) => {
      if (error) console.error("[admin/settings] audit log:", error);
    });

  return NextResponse.json({ ok: true });
}
