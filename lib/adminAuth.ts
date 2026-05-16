import { createHmac, timingSafeEqual } from "crypto";

export const adminCookieName = "saabi_admin";

const sessionLengthMs = 1000 * 60 * 60 * 8;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "development-admin-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function safeCompare(a: string, b: string) {
  const first = Buffer.from(a);
  const second = Buffer.from(b);

  if (first.length !== second.length) {
    return false;
  }

  return timingSafeEqual(first, second);
}

export function createAdminToken() {
  const payload = Buffer.from(
    JSON.stringify({
      exp: Date.now() + sessionLengthMs
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token?: string) {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature || !safeCompare(sign(payload), signature)) {
    return false;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function getCookieValue(cookieHeader: string | null, name: string) {
  return cookieHeader
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1];
}
