# Lighthouse Audit — Homebuzz

> **Date:** 2026-07-05
> **Tool:** Lighthouse (via `npx lighthouse`), `--preset=desktop`, headless Chrome
> **Build:** production (`npm run build` + `npm start`) on `http://localhost:3000`
> **Next.js:** 16.2.7

## Summary

**All audited pages clear the ≥ 90 target on every category.** Performance, Best Practices, and SEO are effectively perfect; Accessibility sits at 96–97, held back by a single recurring `color-contrast` issue.

| Page | Perf | A11y | Best Practices | SEO |
| ---- | :--: | :--: | :--: | :--: |
| Home (`/`) | 99 | 96 | 100 | 100 |
| Catalog (`/store`) | 100 | 96 | 100 | 100 |
| Category (`/store/appliances`) | 100 | 96 | 100 | 100 |
| Product (`/product/dewalt-20v-cordless-drill-kit-3`) | 100 | 97 | 100 | 100 |

## Core Web Vitals (desktop, lab)

| Page | FCP | LCP | TBT | CLS | Speed Index |
| ---- | :--: | :--: | :--: | :--: | :--: |
| Home | 0.3 s | 0.9 s | 0 ms | 0 | 0.6 s |
| Catalog | 0.2 s | 0.6 s | 0 ms | 0 | 0.2 s |
| Category | 0.2 s | 0.6 s | 0 ms | 0 | 0.2 s |
| Product | 0.2 s | 0.8 s | 0 ms | 0 | 0.4 s |

All vitals are comfortably in the "good" range — zero layout shift, zero blocking time, sub-second LCP.

## Findings

### Accessibility — the one real issue: color contrast (A11y 96/97)

The only scored accessibility failure across all pages. **19 nodes on the home page** fail WCAG 2.1 AA (4.5:1 for normal text). Root cause is the `text-gray-500` utility (`#879095`):

| Foreground | Background | Contrast | Required | Where |
| ---------- | ---------- | :------: | :------: | ----- |
| `#879095` (gray-500) | `#ffffff` white | **3.25:1** | 4.5:1 | Product card meta (`.text-xs`, `.text-sm` in card grid) |
| `#879095` (gray-500) | `#cfd7dc` (gray-200) | **2.23:1** | 4.5:1 | Section eyebrow + subtitle text on the gray hero/section band |

> Note: this differs from the ROADMAP's assumption of "yellow-on-dark." The actual failing pattern is **muted gray text on light backgrounds**, concentrated in product-card metadata and section subtitles.

**Recommended fix:** darken the muted text token by one step — e.g. swap `text-gray-500` → `text-gray-600`/`text-gray-700` for body/meta text, and avoid gray-500 entirely on the gray-200 band. Verify each replacement hits ≥ 4.5:1. This should push Accessibility to 100.

### Performance — minor, non-blocking (Perf 99–100)

Nothing here is dragging the score below target, but for completeness the flagged opportunities:

- **Image delivery** — est. ~107 KiB (home) / ~33 KiB (product). Serve appropriately-sized/next-gen images; largest lever if pursued.
- **Unused JavaScript** — est. ~28 KiB.
- **Legacy JavaScript** — est. ~13 KiB (polyfills/transpilation shipped to modern browsers).
- **Render-blocking requests** & **back/forward cache** (`bf-cache`) — flagged without a quantified saving.

These are optional polish; the pages already render sub-second with no blocking time.

### Best Practices & SEO — 100 across the board

No action needed. The recently-added SEO work (per-page metadata, OpenGraph/Twitter + dynamic OG image, `sitemap.xml`, `robots.txt`, JSON-LD `Product` schema) is reflected in the perfect SEO scores.

## Caveats

- Scores are **desktop preset, lab conditions** on a local production server (no network latency, no real device throttling). Mobile scores and real-world (field) numbers will be somewhat lower, especially for image-heavy pages.
- Product/category pages tested against seeded data.
- Re-run after the color-contrast fix to confirm Accessibility → 100.

## How to reproduce

```bash
npm run build && npm start          # serve production build on :3000
npx lighthouse http://localhost:3000/ \
  --preset=desktop \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless=new" \
  --view
```
