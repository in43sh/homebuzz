# Backlog

Smaller follow-ups that don't warrant a ROADMAP milestone entry on their own.

- [ ] **WCAG 2.1 AA contrast pass** — `text-gray-500` fails AA contrast on light backgrounds (flagged by the 2026-07-05 Lighthouse audit, see [LIGHTHOUSE_AUDIT.md](LIGHTHOUSE_AUDIT.md)). Fix by darkening the muted token in `app/globals.css` to ≥ 4.5:1 (`~#6b7378`); keep a lighter token for dark surfaces so the footer still passes. See [ACCESSIBILITY_AUDIT.md](ACCESSIBILITY_AUDIT.md) finding #1
- [ ] **Restore focus outlines on search inputs** — `Header.tsx` and `MobileMenu.tsx` search fields use `focus:outline-none` with no replacement, leaving keyboard focus invisible; add a `focus-visible:ring` style ([ACCESSIBILITY_AUDIT.md](ACCESSIBILITY_AUDIT.md) #2)
- [ ] **Fix focus-ring contrast on light backgrounds** — brand-yellow focus ring is ~1.49:1 on white (WCAG 1.4.11 needs 3:1); use a darker ring on light surfaces and drop the `/40` opacity on `Input` ([ACCESSIBILITY_AUDIT.md](ACCESSIBILITY_AUDIT.md) #3)
- [ ] **Mobile drawer focus management** — `MobileMenu.tsx` drawer doesn't move focus in, trap Tab, restore focus on close, or expose `role="dialog"`/`aria-modal` ([ACCESSIBILITY_AUDIT.md](ACCESSIBILITY_AUDIT.md) #4)
- [ ] **Skip-to-content link** — add a visually-hidden-until-focused skip link in `app/layout.tsx` targeting `<main id="main-content">` ([ACCESSIBILITY_AUDIT.md](ACCESSIBILITY_AUDIT.md) #5)
- [ ] **Wire up `NEXT_PUBLIC_SITE_URL` for deploy** — currently falls back to `http://localhost:3000` in `lib/site.ts`; set the real production domain in Vercel env so OpenGraph, canonical URLs, sitemap, and JSON-LD resolve to absolute production URLs
- [ ] **Lighthouse perf polish** — non-blocking opportunities from the 2026-07-05 audit (perf already 99–100, see [LIGHTHOUSE_AUDIT.md](LIGHTHOUSE_AUDIT.md)): serve sized/next-gen images (~107 KiB on home), trim ~28 KiB unused JS + ~13 KiB legacy JS polyfills, and address render-blocking requests. Only worth it if real-world/mobile field numbers regress
