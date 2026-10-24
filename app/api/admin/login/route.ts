import { NextResponse } from "next/server";
import { adminCookieName, createAdminToken, isValidAdminPassword, safeCompare } from "@/lib/adminAuth";
import { readBoundedJson } from "@/lib/boundedRequest";
import { allowRequest, requestClientKey } from "@/lib/rateLimit";

export async function POST(request: Request) {
  if (!allowRequest(requestClientKey(request, "admin-login"), 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }
  const parsed = await readBoundedJson(request, 4096);
  if (parsed.tooLarge) return NextResponse.json({ error: "Request too large." }, { status: 413 });
  if (!parsed.value) return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  const password = parsed.value && typeof parsed.value === "object" ? (parsed.value as { password?: unknown }).password : null;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const token = createAdminToken();

  if (!isValidAdminPassword(expectedPassword) || !token) {
    return NextResponse.json({ error: "Admin authentication is not configured." }, { status: 503 });
  }
  if (typeof password !== "string" || !safeCompare(password, expectedPassword)) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
