type WindowState = { count: number; resetAt: number };
const windows = new Map<string, WindowState>();

/** Per-process guardrail; use an edge/shared store for multi-instance enforcement. */
export function allowRequest(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (windows.size > 10_000) {
    for (const [entry, state] of windows) if (state.resetAt <= now) windows.delete(entry);
  }
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function requestClientKey(request: Request, scope: string) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").map((value) => value.trim()).filter(Boolean);
  const address = request.headers.get("x-real-ip") || forwarded?.at(-1) || "unknown";
  return `${scope}:${address.slice(0, 128)}`;
}
