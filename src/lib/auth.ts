import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "reservas_session";
const PROVIDER_COOKIE = "reservas_provider_id";
const SESSION_VALUE = "authenticated";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE;
}

export async function getProviderIdFromSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(PROVIDER_COOKIE)?.value ?? null;
}

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const a = Buffer.from(hashPassword(password));
  const b = Buffer.from(hashPassword(adminPassword));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function setSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function setProviderSession(providerId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(PROVIDER_COOKIE, providerId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(PROVIDER_COOKIE);
}
