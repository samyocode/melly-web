// lib/admin-session.ts
//
// Self-contained admin session using signed cookies.
// We deliberately don't reuse the user's Supabase auth session because:
//   1) The admin and the app are different trust domains.
//   2) We don't want anyone with a Supabase account to even *attempt*
//      access — they'd have to know an admin email exists first.
//   3) Avoids dragging @supabase/ssr in for one feature.
//
// Cookie format: base64url(payload).base64url(hmac)
// Payload: { email, exp } (exp in unix seconds)

import { cookies } from "next/headers";

const COOKIE_NAME = "melly_admin_session";
const SESSION_TTL_HOURS = 12;

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set to a random string of 32+ characters",
    );
  }
  return secret;
}

function b64urlEncode(data: Uint8Array | string): string {
  const buf = typeof data === "string" ? new TextEncoder().encode(data) : data;
  let str = "";
  for (let i = 0; i < buf.length; i++) str += String.fromCharCode(buf[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const padding =
    padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const bin = atob(padded + padding);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(payloadB64: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64),
  );
  return b64urlEncode(new Uint8Array(sig));
}

// Constant-time string compare
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export interface AdminSession {
  email: string;
  exp: number;
}

export async function signSession(email: string): Promise<string> {
  const payload: AdminSession = {
    email: email.toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_HOURS * 3600,
  };
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  const sig = await hmac(payloadB64);
  return `${payloadB64}.${sig}`;
}

export async function verifySession(
  token: string,
): Promise<AdminSession | null> {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;

  const expected = await hmac(payloadB64);
  if (!timingSafeEqual(sig, expected)) return null;

  try {
    const payload: AdminSession = JSON.parse(
      new TextDecoder().decode(b64urlDecode(payloadB64)),
    );
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// Server Component / Route Handler: get current admin or null
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const cookie = store.get(COOKIE_NAME);
  if (!cookie?.value) return null;
  return verifySession(cookie.value);
}

// Route handlers: set/clear cookie
export async function setAdminCookie(email: string): Promise<void> {
  const token = await signSession(email);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_HOURS * 3600,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

// Allowlist check
export function isAllowedAdminEmail(email: string): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
