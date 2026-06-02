import { createHmac } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function getSecret() {
  return process.env.ADMIN_SECRET || "fallback-secret";
}

export function createSessionToken(): string {
  const ts = Date.now().toString();
  const hmac = createHmac("sha256", getSecret()).update(ts).digest("hex");
  return Buffer.from(`${ts}:${hmac}`).toString("base64");
}

export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const [ts, hmac] = decoded.split(":");
    const expected = createHmac("sha256", getSecret()).update(ts).digest("hex");
    if (hmac !== expected) return false;
    if (Date.now() - parseInt(ts) > MAX_AGE_MS) return false;
    return true;
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}

export async function setSessionCookie() {
  const token = createSessionToken();
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}
