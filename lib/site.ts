/**
 * Canonical site origin, used for metadataBase, sitemap, robots and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://basehardware.store).
 * Falls back to localhost for local development.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const siteName = "Base Hardware";

/** Compose an absolute URL from a site-relative path. */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
