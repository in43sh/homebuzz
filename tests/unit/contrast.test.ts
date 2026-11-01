import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

// Reads the real design tokens from app/globals.css so a token edit that breaks
// contrast fails here, in milliseconds, before any browser test runs.

const css = readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");

function token(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  // Fail loudly: a missing token must never make a contrast check pass.
  if (!match) throw new Error(`Token --color-${name} not found in app/globals.css`);
  return match[1];
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg: string, bg: string): number {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground token, background token, minimum ratio, what it protects]
// 4.5 is WCAG 1.4.3 (text). 3 is WCAG 1.4.11 (focus indicators).
const PAIRS: [string, string, number, string][] = [
  ["gray-500", "white", 4.5, "muted text on light pages"],
  ["gray-400", "ink-900", 4.5, "footer text on the dark surface"],
  ["slate-700", "gray-200", 4.5, "home hero text on the gray section"],
  ["ink-900", "brand", 4.5, "button and banner text on yellow"],
  ["ink-900", "white", 3, "focus ring on light surfaces"],
  ["brand", "slate-700", 3, "focus ring on the header and drawer"],
];

describe("design token contrast (app/globals.css)", () => {
  it.each(PAIRS)("%s on %s is at least %s:1 (%s)", (fg, bg, min) => {
    expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(min);
  });

  it("fails loudly when a token is missing", () => {
    expect(() => token("does-not-exist")).toThrow(/not found/);
  });
});
