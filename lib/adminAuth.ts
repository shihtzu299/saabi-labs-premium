import { createHmac, timingSafeEqual } from "crypto";

export const adminCookieName = "saabi_admin";

const sessionLengthMs = 1000 * 60 * 60 * 8;
const placeholderPrefixes = /^(replace_with_|choose_|your_|example|changeme|change_me|password123)/i;

function isPlaceholder(value: string) {
  return placeholderPrefixes.test(value.trim());
}

export function isValidAdminPassword(value: string | undefined): value is string {
  return Boolean(value && value.length >= 16 && new Set(value).size >= 8 && !isPlaceholder(value));
}

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (
    !secret ||
    secret.length < 43 ||
    !/^[A-Za-z0-9_-]+$/.test(secret) ||
    new Set(secret).size < 24 ||
    isPlaceholder(secret)
  ) {
    return null;
  }

  return secret;
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function safeCompare(a: string, b: string) {
  const first = Buffer.from(a);
  const second = Buffer.from(b);

  if (first.length !== second.length) {
    return false;
  }

  return timingSafeEqual(first, second);
}

export function createAdminToken() {
  const secret = getSecret();
  if (!secret) return null;

  const payload = Buffer.from(
    JSON.stringify({
      exp: Date.now() + sessionLengthMs
    })
  ).toString("base64url");

  return `${payload}.${sign(payload, secret)}`;
}

export function verifyAdminToken(token?: string) {
  if (!token) {
    return false;
  }

  const secret = getSecret();
  if (!secret) return false;

  const [payload, signature] = token.split(".");

  if (!payload || !signature || !safeCompare(sign(payload, secret), signature)) {
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
