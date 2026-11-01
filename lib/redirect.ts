/**
 * Validates a `next` return address from a query string. Only same-site paths
 * are allowed, so the sign-in page cannot be used to bounce people to another
 * site (an open redirect).
 */
export function safeNextPath(value: string | string[] | undefined | null): string | null {
  if (typeof value !== "string") return null;
  // Must be a single-slash path: "/cart", not "//evil.com" or "https://...".
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  // Browsers treat backslashes like slashes, so "/\evil.com" is also off-site.
  if (value.includes("\\")) return null;
  // No control characters or whitespace tricks.
  if (/[\u0000-\u001f\u007f\s]/.test(value)) return null;
  return value;
}

/** `/signin` or `/signup` with an optional validated return address. */
export function authHref(
  path: "/signin" | "/signup",
  next: string | null,
  reason?: string,
): string {
  const params = new URLSearchParams();
  if (next) params.set("next", next);
  if (reason) params.set("reason", reason);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}
