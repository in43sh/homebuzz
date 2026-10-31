# Naming Research: Replacing Homebuzz

Research run on 2026-10-31 from
[naming_research_prompt.md](naming_research_prompt.md). This was a research-only
exercise: no code was renamed, and no domain or account was registered.

## Executive summary

**Provisional recommendation: Brush & Bit (86.6/100).** It beats Homebuzz
(53.2/100) by naming the two most visible sides of the seeded catalog: paint
and drill accessories. Exact-match `.com`, `.store`, and `.co` queries all
returned unregistered responses, and exact GitHub and X handles returned the
validated not-found response. The USPTO search found no live exact mark; its
closest exact spelling, `BRUSHBIT`, is dead/abandoned.

**Runner-up: Drill & Dwell (83.4/100).** It pairs a concrete product cue with
an equally clear home cue, while all three checked exact domains and both
validated handles returned unregistered/not-found responses. Its trademark
screen is incomplete because the USPTO began returning a CloudFront `403` and
timed out after the earlier searches.

These are portfolio-demo recommendations, not legal clearance. WIPO blocked
automated access with an ALTCHA challenge, Instagram could not distinguish a
real profile from a random control, and three replacement names could not be
completed at the USPTO after the session was throttled. Do not use any name for
a real business until the unchecked items in [Next steps](#next-steps) are
cleared.

## Assumptions used

The owner did not answer the five questions before this run, so the prompt's
defaults control the report:

| Question | Assumption |
| --- | --- |
| Why rename? | Use the diagnosis below; no owner preference was inferred |
| Intended use | Portfolio demo; active conflicts are still hard failures |
| Social platforms | Instagram, X, and GitHub |
| Domains | `.com`, `.shop`, `.store`, or `.co`; no premium budget |
| Preferred or banned styles | None beyond the prompt's banned patterns |

## Diagnosis of Homebuzz

1. **The exact name is already used in adjacent home categories.**
   [HomeBuzz.io](https://homebuzz.io/) offers home-makeover content and lead
   generation, [HomeBuzz.co](https://www.homebuzz.co/collections/all) sells
   kitchen and home goods, and
   [another Homebuzz](https://ww2.homebuzz.me/about-us/) serves property
   managers.
   This is a hard business-name conflict and maps to **distinctiveness**.
2. **It is crowded by stronger `Home + word` brands.**
   [Houzz](https://www.houzz.com/aboutUs) serves home design and remodeling,
   [Home Depot](https://corporate.homedepot.com/page/about-us) is a home
   improvement retailer, and
   [Homebase](https://www.ccpc.ie/business/wp-content/uploads/sites/3/2024/12/M.24.079-Determination.pdf)
   is a home-improvement and garden retailer. `Homebuzz` also echoes `Houzz`
   in spelling and final sound. This maps to **distinctiveness**.
3. **“Buzz” does not identify the shopping job.**
   [Dictionary meanings](https://www.dictionary.com/browse/buzz) include a
   sound, excitement, and rumor or gossip. None says paint, tools, hardware,
   electrical, garden, storage, or home projects. This maps to **relevance**.
4. **The say-it-once result is not unique.** Plausible forms are `Homebuzz`,
   `Home Buzz`, `HomeBuzz`, and the misspelling `Homebuz`; the code itself uses
   title-case prose but a split lowercase `home` + `buzz` wordmark. This maps
   to **spellability and pronounceability**.
5. **The current name has two real strengths.** It is short, and it already
   fits the heavy Inter wordmark with a yellow second half. Replacements must
   beat it without pretending those advantages do not exist. This maps to
   **length** and **brand fit**.

## Criteria and weights

### Hard requirements

A discovered failure drops a candidate:

- no live same or confusingly similar trademark in retail or relevant goods;
- no business using the name in home improvement, hardware, or home services;
- no offensive or embarrassing English, slang, or common-language meaning;
- at least one checked exact acceptable domain is unregistered.

An unavailable check is **unchecked**, not a pass. A candidate with an
unchecked hard requirement may remain in this portfolio shortlist, but is not
cleared for real-world use.

### Weighted criteria

The total is `sum(weight × score / 5)`. Intermediate scores of 2 and 4 are
allowed when the evidence falls between the anchors.

| Criterion | Weight | 1 means | 3 means | 5 means |
| --- | ---: | --- | --- | --- |
| Distinctiveness | 25 | Exact or sound-alike active name in the field | Shared root or several adjacent names, but no exact conflict found | No exact or sound-alike conflict in completed checks |
| Relevance | 20 | Suggests another category | General making or repair cue; needs a descriptor | Immediately reads as broad home-improvement retail |
| Spell/pronounce | 15 | Multiple likely spellings or pronunciations | One material ambiguity | One obvious spelling and pronunciation |
| Domain quality | 15 | No checked acceptable exact domain | Exact fallback only (`.shop`, `.store`, or `.co`) | Exact `.com` unregistered |
| Brand fit | 10 | Requires a new visual system | Works with minor typography changes | Natural heavy wordmark and accent split |
| Length | 8 | More than 20 domain characters | 12–16 domain characters | At most 11 domain characters |
| Handles | 7 | Two or more chosen handles taken or unvalidated | One free, one taken, one unchecked | All three exact handles confirmed unregistered |

The diagnosis-to-criterion mapping is complete: problems 1–2 are tested by
distinctiveness, problem 3 by relevance, problem 4 by spellability, and the
baseline strengths in problem 5 by length and brand fit.

## Candidate generation

The pool contains 50 names across five styles. The rationale is what earned a
name entry into the pool, not a claim that it passed screening.

| Name | Style | One-line rationale |
| --- | --- | --- |
| Project Supply | Descriptive | Directly frames the store around projects |
| Home Project Supply | Descriptive | Explicit home-project retail cue |
| Fix & Finish Supply | Descriptive | Covers repair and decorative completion |
| Housework Supply | Descriptive | Suggests products for work around a house |
| Wholehouse Supply | Descriptive | Signals breadth across rooms and systems |
| Task & Timber | Descriptive | Combines jobs with a building material |
| Bolt & Brush | Descriptive | Pairs hardware and paint |
| Rivet & Roller | Descriptive | Pairs fastening and painting |
| Brush & Bit | Descriptive | Pairs paint and drill accessories |
| Drill & Dwell | Descriptive | Pairs a tool with the home itself |
| Plank & Plug | Descriptive | Pairs flooring/building and electrical |
| Brush & Breaker | Descriptive | Pairs paint and electrical systems |
| Taskstead | Suggestive | Stable place for project tasks |
| Fixstead | Suggestive | Stable place for repairs |
| Buildward | Suggestive | Implies forward project progress |
| Makeward | Suggestive | Implies progress through making |
| Workstead | Suggestive | A dependable place for work |
| Handspan | Suggestive | Human-scale making and measurement |
| Mend & Measure | Suggestive | Repair plus careful preparation |
| Room & Rafter | Suggestive | Interior space plus structure |
| Level & Latch | Suggestive | Accuracy plus home hardware |
| Patch & Power | Suggestive | Repair plus tools/electrical |
| Bit & Basin | Suggestive | Tools plus bath/plumbing |
| Rafter & Rail | Suggestive | Structure plus finish hardware |
| Measure & Make | Suggestive | A simple project sequence |
| Homewright | Compound | A craftsperson for the whole home |
| Toolmark | Compound | A concise mark for tools and projects |
| Projectry | Blend | A place or practice built around projects |
| Makecroft | Blend | Making joined to a home-and-land word |
| Plankwell | Compound | Material plus durability/craft cue |
| Squarehouse | Compound | Accuracy joined to the home |
| Buildmark | Compound | A mark of completed construction |
| Housekit | Compound | Everything needed for a house project |
| Dwellbit | Blend | Home plus tool-accessory cue |
| Projectbolt | Compound | Project breadth plus hardware energy |
| Fixfield | Compound | A broad field of repairs |
| Workspan | Compound | Breadth across many project types |
| Craftward | Blend | Progress through craft |
| Toolstead | Compound | Dependable place for tools |
| Homecraft Supply | Compound | Home-focused craftsmanship and retail |
| Haldo | Invented | Short, pronounceable abstract word |
| Tavro | Invented | Short, sturdy consonant structure |
| Bricca | Invented | Suggests brick without describing one category |
| Ondel | Invented | Compact neutral wordmark candidate |
| Torven | Invented | Strong consonants for the heavy identity |
| Trestra | Invented | Hints at trestles and structure |
| Northline Supply | Place-style | Directional, established-supply tone |
| Westward Supply | Place-style | Forward movement with a regional feel |
| Millbrook Home | Place-style | Familiar workshop/place imagery |
| Oakridge Supply | Place-style | Durable material and place imagery |

## Narrowing and rejection log

No-lookup scoring removed names that were generic, too narrow, hard to spell,
too long, or weak in the existing wordmark. Screening then exposed conflicts.
When an attractive candidate failed, a replacement batch was screened rather
than lowering the hard requirement.

| Stage | Names | Evidence-based reason |
| --- | --- | --- |
| Pre-score | Project Supply; Home Project Supply; Wholehouse Supply; Northline Supply; Westward Supply; Millbrook Home; Oakridge Supply | Generic/place-style construction scored 1–2 on distinctiveness |
| Pre-score | Fix & Finish Supply; Homecraft Supply | Too long for the header and domain; length 1–2 |
| Pre-score | Housework Supply | “Housework” suggests cleaning/chores, not improvement retail; relevance 2 |
| Pre-score | Task & Timber; Rafter & Rail; Bit & Basin; Brush & Breaker | Each overweights one or two departments; relevance 2–3 |
| Pre-score | Patch & Power; Measure & Make; Buildmark; Housekit; Dwellbit; Projectbolt; Fixfield; Workspan; Craftward; Toolstead | Lower relevance or say-it-once score than the retained name in the same style |
| Pre-score | Workstead; Tavro; Bricca; Ondel; Torven; Trestra | Abstract or invented words required a descriptor and added spelling risk |
| Business | Taskstead | [Taskstead Studio](https://tasksteadstudio.com/about/) serves home-service businesses |
| Business | Fixstead | Active [home and outdoor services](https://www.fixstead.co.uk/) and renovation-property marketplace brands |
| Business | Homewright | Multiple active remodelers/builders, including [HomeWright Builders](https://www.homewrightbuilders.com/) |
| Business | Toolmark | Active [DIY and household tool retailer](https://www.linkedin.com/company/tool-mark) and registered hand-tool retailer |
| Business | Projectry | Active exact-name businesses include [an interiors/construction company](https://www.indiafilings.com/search/projectry-interio-private-limited-cin-U45309MH2019PTC320648) and software/project services |
| Business | Buildward; Makeward | Exact-name active [Buildward](https://buildward.ai/) and [Makeward](https://makeward.co/) technology businesses lowered distinctiveness |
| Product/business | Handspan | `HandSpan` is an existing [adjustable-spanner, screwdriver, and caliper tool](https://www.usesi.com/media/product-media/catalogs/USESI_686650_catalog.pdf) |
| Product/business | Plankwell | Active [porcelain tile product](https://architessa.com/products/plankwell) and flooring-service use in the same field |
| Business | Squarehouse | Exact-name [electrical-appliance/construction business](https://www.firmo.be/en/0426784459/squarehouse) found |
| Business | Haldo | Long-running [manufacturer of electrical enclosures and feeder pillars](https://haldo.com/our-story/) |
| Trademark | Bolt & Brush | Live `BOLT BRUSH`, serial 90906574, for paintbrushes |
| Trademark | Rivet & Roller | Live `RIVET` marks cover floor sealant (75593562), metal rivets (77283172), and plumbing sinks (90546348) |
| Similar sound | Makecroft | Confusingly close to active [architecture/interiors firm Makecraft](https://makecraft.co/) and an [international `MAKECRAFT` registration](https://www.portalchile.org/detalle-marca/makecraft-1440747) covering brushes/art materials |
| Similar sound | Plumb & Post | Live `PLUM & POST`, serial 87613657, for class-35 online home-décor retail |
| Screened out | Room & Rafter | `.com` registered, X handle occupied, and several live `RAFTER` tool marks; lower distinctiveness/domain/handle score |
| Screened out | Level & Latch | `.com` registered and the phrase is dominated by generic hardware terms; lower domain/distinctiveness score |
| Screened out | Brush & Breaker; Bit & Basin | Exact domains passed, but category breadth and linguistic ambiguity scored below the four finalists |

## Screening method and controls

All checks in this section were run on 2026-10-31.

### Domains

- `.com` and `.store`: `https://rdap.org/domain/<name>.<tld>` with redirects.
  The controls differed: `google.com` and `google.store` returned `200`; a
  random `homebuzz-research-9f4c2e7b` name returned `404`.
- `.co`: `whois -h whois.registry.co <name>.co`. `google.co` returned a domain
  record; the random control returned `DOMAIN NOT FOUND`.
- `.shop`: **unchecked**. Both the known and random controls returned `429`, so
  the method did not distinguish registered from unregistered names.
- `404`/`DOMAIN NOT FOUND` is reported as **unregistered**, not “available” or
  “standard price.” No registrar pricing was checked.

| Name | `.com` | `.store` | `.co` | `.shop` | Source/date |
| --- | --- | --- | --- | --- | --- |
| Brush & Bit | Unregistered | Unregistered | Unregistered | Unchecked | RDAP/registry WHOIS, 2026-10-31 |
| Drill & Dwell | Unregistered | Unregistered | Unregistered | Unchecked | RDAP/registry WHOIS, 2026-10-31 |
| Plank & Plug | Unregistered | Unregistered | Unregistered | Unchecked | RDAP/registry WHOIS, 2026-10-31 |
| Mend & Measure | Unregistered | Unregistered | Unregistered | Unchecked | RDAP/registry WHOIS, 2026-10-31 |
| Homebuzz | Registered | Unregistered | Registered | Unchecked | RDAP/registry WHOIS, 2026-10-31 |

### Businesses, trademarks, handles, and language

- Exact quoted web searches were run for every screened phrase plus home,
  hardware, tools, construction, and business modifiers. No exact trading
  business was returned for the four finalists. Ordinary phrase hits (for
  example CNC “drill with dwell”) are reflected in distinctiveness scores.
- The official [USPTO search](https://tmsearch.uspto.gov/) worked for Homebuzz,
  Brush & Bit, and several rejected names. `BRUSHBIT` serial 97354237 was
  dead/abandoned; no live exact Brush & Bit result was observed. All four exact
  `HOMEBUZZ` results were dead/abandoned. The site later timed out in browser
  automation and returned CloudFront `403` to direct requests, leaving the
  other three finalists unchecked.
- [WIPO Global Brand Database](https://branddb.wipo.int/) presented an ALTCHA
  challenge, so every WIPO result is unchecked.
- Handle controls distinguished `200` for known GitHub/X accounts from `404`
  for a random handle. Instagram returned `200` for both controls, so every
  Instagram result is unchecked.
- Exact phrase searches with `meaning`, `slang`, and `offensive` found no
  concerning meaning for the finalists. `Brush`, `bit`, `drill`, `dwell`,
  `plank`, `plug`, `mend`, and `measure` are ordinary English words with one
  standard pronunciation each; the `&` versus `and` rendering is the common
  spelling ambiguity. This is a first-pass language check, not a native-speaker
  review across every market.

## Ranked shortlist

All status dates are 2026-10-31. Scores use the weights above: **D**
distinctiveness, **R** relevance, **S** spellability/pronunciation, **Dom**
domain quality, **B** brand fit, **L** length, and **H** handles.

| Name | Style | D | R | S | Dom | B | L | H | Total | Domain summary | Handle summary | Trademark screen |
| --- | --- | --: | --: | --: | --: | --: | --: | --: | --: | --- | --- | --- |
| **Brush & Bit** | Descriptive pair | 4 | 4 | 4 | 5 | 5 | 5 | 4 | **86.6** | Exact `.com/.store/.co` unregistered | GitHub/X unregistered; Instagram unchecked | USPTO: no live exact observed; WIPO unchecked |
| **Drill & Dwell** | Suggestive pair | 4 | 4 | 4 | 5 | 5 | 3 | 4 | **83.4** | Exact `.com/.store/.co` unregistered | GitHub/X unregistered; Instagram unchecked | USPTO/WIPO unchecked |
| **Plank & Plug** | Descriptive pair | 4 | 4 | 4 | 5 | 4 | 3 | 4 | **81.4** | Exact `.com/.store/.co` unregistered | GitHub/X unregistered; Instagram unchecked | USPTO/WIPO unchecked |
| **Mend & Measure** | Suggestive pair | 4 | 3 | 4 | 5 | 4 | 3 | 4 | **77.4** | Exact `.com/.store/.co` unregistered | GitHub/X unregistered; Instagram unchecked | USPTO/WIPO unchecked |
| Homebuzz | Compound baseline | 1 | 2 | 3 | 3 | 5 | 5 | 3 | **53.2** | `.store` unregistered; `.com/.co` registered | X unregistered; GitHub taken; Instagram unchecked | USPTO exact marks dead; WIPO unchecked; business hard fail |

Reproducible arithmetic:

- Brush & Bit: `(25×4 + 20×4 + 15×4 + 15×5 + 10×5 + 8×5 + 7×4) ÷ 5 = 86.6`.
- Drill & Dwell: `(25×4 + 20×4 + 15×4 + 15×5 + 10×5 + 8×3 + 7×4) ÷ 5 = 83.4`.
- Plank & Plug: `(25×4 + 20×4 + 15×4 + 15×5 + 10×4 + 8×3 + 7×4) ÷ 5 = 81.4`.
- Mend & Measure: `(25×4 + 20×3 + 15×4 + 15×5 + 10×4 + 8×3 + 7×4) ÷ 5 = 77.4`.
- Homebuzz: `(25×1 + 20×2 + 15×3 + 15×3 + 10×5 + 8×5 + 7×3) ÷ 5 = 53.2`.

Brush & Bit beats the baseline on distinctiveness, relevance, spellability,
domain quality, and handles while tying it on brand fit and length. Homebuzz
remains stronger only in continuity: its wordmark already exists.

## Rename impact for the top three

The implementation cost is **M** for each top-three name. The code edits are
small, but the seeded identity domain, documentation, generated graph artifacts,
repository name, and deployment URL require coordination.

| Area | Every affected location found | Care needed | Effort |
| --- | --- | --- | --- |
| User-facing wordmark/copy | `components/blocks/Header.tsx`; `components/blocks/MobileMenu.tsx`; `components/blocks/Footer.tsx`; `app/privacy/page.tsx`; `app/store/[category]/page.tsx` | Header/mobile render separate `home` and `buzz` nodes, so plain exact grep misses them | S |
| Metadata/social | `app/layout.tsx`; `app/admin/layout.tsx`; `app/opengraph-image.tsx`; `lib/site.ts` | Centralize hardcoded strings through `siteName`; redraw the generated Open Graph wordmark | S |
| URLs/SEO | `lib/site.ts`; `app/sitemap.ts`; `app/robots.ts`; `app/product/[slug]/page.tsx`; deployment `NEXT_PUBLIC_SITE_URL` | Sitemap, robots, and product JSON-LD derive from the URL rather than the name; update the deployment env value | S |
| Brand assets | `app/favicon.ico`; generated `app/opengraph-image.tsx`; header/mobile text wordmarks | No standalone logo file exists; favicon needs visual review even though it contains no searchable text | S |
| Code/config | `package.json`; `package-lock.json`; `.env.example`; `lib/categories.ts` legacy comment | Suggested package slugs: `brush-and-bit`, `drill-and-dwell`, or `plank-and-plug`; the real database name need not change | S |
| Seed data/tests | `db/seed.ts`; account references in `AGENTS.md`, `README.md`, `docs/testing.md`, `docs/technical_guide.md`, `docs/walkthrough.md`, and `docs/redesign_research_prompt.md` | Changing `homebuzz.test` requires reseeding; existing local DB rows retain old emails until reseeded. No unit/e2e assertion currently checks the brand | M |
| Current docs | `README.md`; `SETUP.md`; `docs/audits/lighthouse_audit.md`; `docs/concepts.md`; `docs/graphify.md`; `docs/graphify_plan.md`; `docs/questions.md`; `docs/roadmap.md`; `docs/technical_guide.md`; `docs/testing.md`; `docs/walkthrough.md` | Mechanical update plus review for prose and test-account references | S |
| Historical/research docs | `docs/naming_research_prompt.md`; this report; `docs/redesign_research_prompt.md`; `docs/plan_original.md` | Preserve historical names where they describe the old project; do not blind-replace | S |
| Generated architecture docs | `docs/system-graph/README.md`; `docs/system-graph/data.json`; `docs/system-graph/index.html` | Regenerate or update together to avoid inconsistent labels | S |
| Repository/deployment | Directory `homebuzz`; GitHub remote `git@github.com:in43sh/homebuzz.git`; GitHub repository; deployment project/domain | Coordinate redirects and CI/deployment settings; no remote change was made | M |

Top-three wordmark notes:

- **Brush & Bit:** yellow `Bit` or yellow `&`; package/domain slug
  `brush-and-bit` / `brushandbit`.
- **Drill & Dwell:** yellow `Dwell` gives the home cue visual priority;
  package/domain slug `drill-and-dwell` / `drillanddwell`.
- **Plank & Plug:** yellow `Plug` preserves the two-part rhythm; package/domain
  slug `plank-and-plug` / `plankandplug`.

## Open questions

- Is the owner comfortable with a paired trade-term name, or should a second
  round seek a single invented word despite its lower immediate relevance?
- Should `homebuzz.test` be renamed with the brand or kept as stable test data?
- Should the visible wordmark use `&` while domains/packages use `and`?
- Is the goal still portfolio-only? Any real-business ambition raises the
  trademark and international-language standard substantially.

## Next steps

1. Manually search the exact words, spacing variants, plurals, and sound-alikes
   for all four finalists in USPTO classes 2, 6, 7, 8, 9, 35, plus directly
   relevant classes 11 and 16. Start with Brush & Bit despite its provisional
   lead.
2. Repeat at WIPO and, for any intended operating country, the national
   trademark registry. A trademark attorney should clear the chosen finalist
   before real-world use.
3. Have native speakers review the finalist in intended markets; the present
   language check is only an English/search-engine screen.
4. Confirm Instagram manually while signed out. Recheck GitHub, X, RDAP, WHOIS,
   and registrar price immediately before committing; statuses can change.
5. Choose the name and wordmark treatment. Only then buy a domain and reserve
   handles; “unregistered” in this report is not a guarantee of standard-price
   registration.
6. If renaming the repo, use the impact table as the checklist, decide the seed
   email migration first, and verify with `npm test`, `npm run lint`, and
   `npm run build` after implementation.
