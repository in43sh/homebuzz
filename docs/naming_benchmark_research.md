# Naming Benchmark Review: Is Base Hardware the Best Name?

Research run on 2026-11-01 from
[naming_benchmark_research_prompt.md](naming_benchmark_research_prompt.md). This
was a research-only exercise: no code was changed, and no domain or account was
registered.

## Owner decision

On 2026-11-01 the owner chose to **keep Base Hardware**. Still open: the
say-it-once test and the manual USPTO check in [Next steps](#next-steps), and
registering `basehardware.store`. No further naming research is planned.

## Executive summary

**Recommendation: keep Base Hardware, and run two quick manual checks before
buying the domain.** No challenger is robustly better, but the review found one
real weakness that earlier reports under-weighted.

- **The weakness:** `basehardware` is two letter-edits from `acehardware`. The
  two names also rhyme and share the `<word> Hardware` structure with Ace
  Hardware and Home Hardware. Under the closeness measure defined before
  scoring, that is the lowest Distinctiveness score (1). It lowers Base
  Hardware's total from the earlier 80 to **77**. Ace is a century-old chain, so
  this matters if the name is ever used for a real business.
- **One challenger clears the pre-declared bar, by one point.** The rule
  required a total at least 5 points above Base Hardware (so 82 or more) with no
  hard failure. **Ashworth scores 83.** The margin is inside the noise of the
  scoring: a one-point disagreement on tone or category fit removes it (see
  [Sensitivity](#sensitivity)).
- **Why not switch:** Ashworth is a surname that says nothing about the store,
  has a live `ASHWORTH` mark in class 7 and a conveyor-belt company holding
  `ashworth.com`, and earns its lead almost entirely from one criterion. A
  rename also costs a new wordmark, favicon, docs, and Stitch screens.
- **If the checks go badly, switch to Nailbrook** (81), the cleanest name found:
  all three domains free including `.com`, no USPTO results, no business found.
  Ashworth (83, with cautions) and Whitlock (81) are the surname alternatives.

Everything here is a first-pass screen, not legal clearance.

### Corrections to earlier reports

- [naming_research.md](naming_research.md) scored Plankwell, Squarehouse, and
  Haldo as passing and gave Plumb & Post the highest score (84). The
  [first alternate report](naming_research_2026-10-31.md) had already found an
  active porcelain-tile product named Plankwell, an electrical-appliance business
  named Squarehouse, a manufacturer named Haldo, and a live `PLUM & POST`
  trademark. One web search per name, as used in the first report, missed them.
  This round used differently worded searches and a working USPTO check.
- Base Hardware's earlier score of 80 is replaced by 77 (see
  [Scores](#scores)).

## Method and controls

All checks ran on 2026-11-01.

- **Chain facts** come from the search-result summaries of the pages linked in
  the benchmark table. I did not open every page. Where a summary said a claim
  is unconfirmed or comes from a weak source, the table says so.
- **Domains:** RDAP through `rdap.org` with `curl -sL`. Controls passed:
  `google.com`, `google.shop`, and `google.store` returned registered, and a
  random string returned unregistered on all three. Registered `.com` domains
  were fetched once to read the page title.
- **Businesses:** one quoted web search per challenger with category words
  (hardware, home improvement, tools, paint). This is the check that missed
  conflicts last time, so "none found" means only that the search returned none.
- **Trademarks:** the [USPTO search](https://tmsearch.uspto.gov) through browser
  automation. Typing into the search box works. Loading the results URL directly
  returns "No results found" even for known marks, which explains the earlier
  contradictory runs. The control passed: `HOUZZ` returned live registered
  marks. Only the first page of results (up to 50) was read. "Core classes" are
  2, 6, 7, 8, 9, and 35. WIPO's database blocks automation and is **unchecked**.
- **Language check:** my own reading of each name plus the search results. It was
  not reviewed by native speakers.

## Benchmark: 24 chains

Name types: **S** surname or founder, **A** abbreviation, **D** descriptive
(category words only), **W** word or place plus category word, **P** phrase or
claim, **T** trade term plus number, **B** invented blend. "Letters" counts
letters and digits only.

| Chain | Type | Letters | Name origin and notes | Source |
| --- | --- | --- | --- | --- |
| The Home Depot | D | 9 | Founded 1978. The working name was Bad Bernie's Buildall, and an early investor pushed for the change (accounts differ, aggregator sources) | [House Digest](https://housedigest.com/911642/the-unexpected-name-home-depot-was-almost-given) |
| Lowe's | S | 5 | Lucius Smith Lowe, 1921. First store was North Wilkesboro Hardware, and the Lowe's name was kept after later ownership changes | [Wikipedia](https://en.wikipedia.org/wiki/Lowe%27s) |
| Menards | S | 7 | John Menard Jr.'s first store was Menard Cashway Lumber. No source found for the name's origin beyond that | [Wikipedia](https://en.wikipedia.org/wiki/Menards) |
| Ace Hardware | W | 11 | Founded 1924 as Ace Stores by Chicago store owners. "Ace" reportedly honors World War I pilots (a long-told story, not confirmed by a primary source). Renamed Ace Hardware Corporation in 1931 | [Wikipedia](https://en.wikipedia.org/wiki/Ace_Hardware) |
| True Value | P | 9 | Brand introduced in 1932 by a Chicago wholesaler for a hand-tool line. The co-op was renamed TruServ in 1997 and True Value Company in 2006. Do it Best completed its purchase in November 2024 | [Wikipedia](https://en.wikipedia.org/wiki/True_Value) |
| Do it Best | P | 8 | Founded 1945 as Hardware Wholesalers, Inc. (HWI). Renamed after a 1998 merger to unify members, private brands, and advertising | [Wikipedia](https://en.wikipedia.org/wiki/Do_It_Best) |
| Harbor Freight Tools | W | 17 | Founded 1977 by Eric and Allan Smidt as a mail-order business, originally called Harbor Freight Salvage. No source found for why "Harbor" | [Wikipedia](https://en.wikipedia.org/wiki/Harbor_Freight_Tools) |
| Tractor Supply | D | 13 | Began in 1938 as a mail-order tractor-parts business. The name matches the original product. Sources differ on the founding city | [Wikipedia](https://en.wikipedia.org/wiki/Tractor_Supply_Company) |
| Floor & Decor | D | 10 | Founded 2000 as FDO Holdings, renamed Floor & Decor Holdings in 2017. No source found for the store name's origin | [Wikipedia](https://en.wikipedia.org/wiki/Floor_%26_Decor) |
| Sherwin-Williams | S | 15 | Bears the surnames of founders Henry Sherwin and Edward Williams. Company history dates it to 1866 | [Company history](https://corporate.sherwin-williams.com/our-company/history.html) |
| Northern Tool + Equipment | D | 21 | Founded 1981 as Northern Hydraulics, selling log splitters from a garage. Renamed to its current name (infobox dates the old name 1981–1998) | [Wikipedia](https://en.wikipedia.org/wiki/Northern_Tool) |
| Fastenal | B | 8 | Founded 1967. One source says "Fasten All", another says "fastener" plus "national" (weaker source). No primary confirmation | [Wikipedia](https://en.wikipedia.org/wiki/Fastenal) |
| Screwfix | B | 8 | Began in 1979 as the Woodscrew Company, whose first catalogue was one page of screws. No source states where "Screwfix" came from | [Wikipedia](https://en.wikipedia.org/wiki/Screwfix) |
| B&Q | A | 2 | Originally Block & Quayle (founders Richard Block and David Quayle, 1969). Shortened after the abbreviation appeared on delivery notes and invoices | [Wikipedia](https://en.wikipedia.org/wiki/B%26Q) |
| Homebase | D | 8 | Founded 1979 as a Sainsbury's joint venture. No source found for the name choice. Went into administration in November 2024, and the last original stores closed in March 2025 | [Company history](https://www.homebase.co.uk/en-uk/our-history) |
| Bunnings | S | 8 | Named for brothers Arthur and Robert Bunning, who started in Western Australia in 1886 | [Wikipedia](https://en.wikipedia.org/wiki/Bunnings) |
| Canadian Tire | D | 12 | Brothers John and Alfred Billes bought a garage in 1922. The name was incorporated in 1927, and A.J. Billes said it was chosen because it sounded big | [Wikipedia](https://en.wikipedia.org/wiki/Canadian_Tire) |
| Home Hardware | D | 12 | Founded 1964 in St. Jacobs, Ontario. The name came from a back-to-back "H" logo that could also stand for Hollinger Hardware | [Wikipedia](https://en.wikipedia.org/wiki/Home_Hardware) |
| Grainger | S | 8 | W.W. Grainger, founded 1927 in Chicago, kept his own name as the trade name. No source for any naming rationale | [Wikipedia](https://en.wikipedia.org/wiki/W._W._Grainger) |
| 84 Lumber | W | 8 | Founded 1956 by Joseph Hardy and named after Eighty Four, Pennsylvania, where he bought property | [Company history](https://84lumber.com/about/history/) |
| Wickes | S | 6 | Traces to the 1854 Michigan lumber business of Henry Dunn Wickes. The first UK Wickes opened in 1972, a loose link | [Company history](https://www.wickes.co.uk/companyhistory) |
| Mitre 10 | T | 7 | Company history gives two accounts: the carpentry mitre joint, or a Melbourne pub called the Mitre Tavern | [Company history](https://www.mitre10.com.au/company) |
| Leroy Merlin | S | 11 | Adolphe Leroy and Rose Merlin. The name combining both surnames was adopted in 1960 | [Wikipedia](https://en.wikipedia.org/wiki/Leroy_Merlin) |
| LL Flooring | A | 10 | Lumber Liquidators rebranded in 2020 ("No lumber. No liquidation."), with the legal name changed on 1 January 2022 | [Business Wire](https://businesswire.com/news/home/20211210005065/en/LL-Flooring-to-Complete-Corporate-Name-Change) |

The Menards page, per its search summary, describes it as the third-largest US
home-improvement chain behind Lowe's and The Home Depot.

## Patterns

What the 24 names show, and what they do not prove (a sample of 24 shows
patterns, not causes):

1. **No single type dominates.** Surnames are the largest group (7 of 24, or 8
   counting B&Q's initials), then descriptive names (7), then a word or place
   plus a category word (3). Of the three largest US chains, one is descriptive
   (The Home Depot) and two are surnames (Lowe's and Menards). This supports
   surname-style names being a legitimate option, as you decided.
2. **Names are short.** The median is 8.5 letters (range 2–21), and 20 of 24 are
   12 letters or fewer. Base Hardware is at 12; every challenger screened is 6–9.
3. **The "brand word plus category word" structure is uncommon.** Only Ace
   Hardware, Harbor Freight Tools, and 84 Lumber use it. Base Hardware's
   structure is legitimate but sits next to the single most famous example.
4. **A few category words are crowded:** "Home" appears in 3 names, and
   "Hardware" and "Tool(s)" in 2 each. Two of the best-known "Hardware" names,
   Ace and Home Hardware, are retailer cooperatives, so `<word> Hardware` is a
   pattern shoppers have met many times.
5. **Names tied to one department age badly.** HWI became Do it Best (1998),
   Northern Hydraulics became Northern Tool + Equipment, and Lumber Liquidators
   became LL Flooring (2020) as each outgrew its first product. Results for LL
   Flooring also carry headlines saying the company is going out of business and
   that the brand is coming back as Lumber Liquidators (titles only, not read).
   Base Hardware's descriptor is "Hardware", yet the store also sells bath,
   flooring, appliances, and garden products. That is a milder version of the
   same risk. A surname or abstract word avoids it.
6. **Two big chains use "X & Y" names** (B&Q and Floor & Decor). You ruled this
   style out, so it has no effect on the recommendation.

## Closeness to existing chains

Each name was compared with all 24 chains by shared words, shared structure,
sound, and edit distance (Levenshtein distance between lowercase names with
spaces removed, computed by script). Anchors, fixed before scoring:

| Score | Meaning |
| --- | --- |
| 1 | Same structure and a rhyme, or edit distance 2 or less, to a major chain |
| 2 | Same structure as a major chain, or a clear sound-alike |
| 3 | Shares one element (a word or a structure) with several chains |
| 4 | Shares a common category word only |
| 5 | Nothing shared |

| Name | Three nearest chains (edit distance) | Shared structure or sound | Distinctiveness |
| --- | --- | --- | --- |
| Base Hardware | Ace Hardware (2), Home Hardware (3), Menards (8) | `<word> Hardware` with Ace and Home Hardware. "Base" and "Ace" rhyme (judged by ear). "base" is also inside Homebase | 1 |
| Ashworth | Lowe's (7), Menards (7), Fastenal (7) | None | 5 |
| Nailbrook | Do it Best (7), Mitre 10 (7), The Home Depot (8) | None | 5 |
| Whitlock | Do it Best (6), Wickes (6), Mitre 10 (6) | None | 5 |
| Hollis | Lowe's (4), Homebase (5), Wickes (5) | None heard aloud | 5 |
| Kendrick | Menards (5), Bunnings (7), Wickes (7) | None | 5 |

**Base Hardware is flagged by this measure.** Whether it counts as a hard
failure ("too close to an existing chain") is a legal judgment that only a
trademark search and professional review can settle. The meaning of "base" and
"ace" differ, and "hardware" is a plain descriptor, which weighs against
confusion. Rhyme, structure, and a two-letter edit weigh for it.

## Screening results

"Core-class live marks" are live USPTO wordmarks identical to the name in classes
2, 6, 7, 8, 9, or 35, read from the first page of results.

| Name | `.com` | `.shop` | `.store` | Existing business (one search) | Core-class live marks | Result |
| --- | --- | --- | --- | --- | --- | --- |
| Base Hardware | Registered | Free | Free | None found (results were swamped by the unrelated e-commerce site base.com) | No `BASE HARDWARE` seen. Live single-word `BASE` marks: class 7 (3D printers), class 9 (HVAC controllers), class 35 (two services marks) | Pass, with a closeness flag and a `BASE` caution |
| Ashworth | Registered (conveyor-belt maker) | Registered | Free | None in home improvement. [Ashworth Bros.](https://www.ashworth.com) makes conveyor belts | Live `ASHWORTH` in class 7 for conveyors and conveyor belts. A separate live class 25 mark exists for apparel | Pass, with caution |
| Nailbrook | Free | Free | Free | None found | None; USPTO returned no results at all | Pass |
| Whitlock | Registered | Free | Free | None found | None in core classes. Adjacent: live `H.E. WHITLOCK` in class 37 (building construction, Colorado) | Pass, with caution |
| Hollis | Registered | Registered | Registered | None as a company (results were towns named Hollis) | 21 live `HOLLIS` marks overall. Core-class ones cover scuba gear, bags, and unrelated services | Pass, but no domain is free |
| Kendrick | Registered | Registered | Free | None found (one Kendrick-family Ace store) | Live `KENDRICK` class 9 covers musical-instrument amplifiers. Adjacent: `KENDRICK HOME` (classes 16, 20, 27, home goods, Iowa) | Pass, with caution; also strongly tied to the rapper Kendrick Lamar |
| Boltgate | Registered | Registered | Free | None found | None; no USPTO results | Pass, but "-gate" is slang for a scandal (tone lowered) |
| Merrick | Registered (engineering firm) | Free | Registered | None found | Live `MERRICK` in class 8 for multi-function hand tools (hammers, wrenches) and class 9 for scales | **Fail**: live hand-tool mark |
| Linwood | Registered | Free | Free | No company found (results were towns) | Live `LINWOOD` in class 11 (Kohler) and `LINWOOD HOMES` in classes 35, 37, 41, 42 (home builder) | **Fail**: likely conflict in bath and home fields (Kohler's goods not read) |
| Pemberton | Registered (insurance firm) | Free | Registered | [Pemberton Valley Hardware & Building Centre](https://www.cloverdalepaint.com/store-locations/cloverdale-bc-locations/location-detail/82/pemberton-valley-bldg-centre), British Columbia | Not run (stopped at first failure) | **Fail**: hardware store with this name |
| Anchor Hardware | Registered (Anchor Ace Hardware, Sandwich, MA) | Free | Free | Several: [Anchor Hardware, Inc.](https://thebluebook.com/iProView/1005631/anchor-hardware-inc/material-suppliers) (Bluffton, SC), a Florida store, and Anchor Ace Hardware | Not run | **Fail**: existing hardware businesses |

Ten challengers were screened live, as the budget allowed. Another 25 generated
names were dropped on the no-lookup pre-score (see
[Rejected names](#rejected-names)).

## Scores

Criteria and weights are unchanged from
[naming_research.md](naming_research.md): Tone 25, Distinctiveness 20, Category
fit 20, Spellability 15, Brand fit 10, Length 5, Domain quality 5. Each is
scored 1–5 and the total is the weighted sum divided by 5. Tone, category fit,
spellability, and brand fit were fixed at pre-scoring, before any lookup. Later
evidence changed only Distinctiveness (the closeness measure), Domain (the live
checks), and one Tone score (Boltgate, from the language check). Length uses the
earlier anchors: 5 for 10 letters or fewer, 3 for 11–15, 1 for more.

| Name | Tone | Distinct. | Category | Spelling | Brand fit | Length | Domain | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ashworth | 4 | 5 | 3 | 5 | 4 | 5 | 3 | **83** |
| Nailbrook | 3 | 5 | 4 | 4 | 4 | 5 | 5 | **81** |
| Whitlock | 4 | 5 | 3 | 4 | 4 | 5 | 4 | **81** |
| Hollis | 4 | 5 | 3 | 5 | 4 | 5 | 1 | **81** |
| Kendrick | 4 | 5 | 3 | 4 | 4 | 5 | 3 | **80** |
| Base Hardware | 5 | 1 | 4 | 5 | 5 | 3 | 4 | **77** |
| Boltgate | 2 | 5 | 4 | 5 | 4 | 5 | 3 | **77** |

The arithmetic, shown in the form (weights times scores) divided by 5:

- Ashworth: (25×4 + 20×5 + 20×3 + 15×5 + 10×4 + 5×5 + 5×3) ÷ 5 = 415 ÷ 5 = 83
- Nailbrook: (25×3 + 20×5 + 20×4 + 15×4 + 10×4 + 5×5 + 5×5) ÷ 5 = 405 ÷ 5 = 81
- Whitlock: (25×4 + 20×5 + 20×3 + 15×4 + 10×4 + 5×5 + 5×4) ÷ 5 = 405 ÷ 5 = 81
- Hollis: (25×4 + 20×5 + 20×3 + 15×5 + 10×4 + 5×5 + 5×1) ÷ 5 = 405 ÷ 5 = 81
- Kendrick: (25×4 + 20×5 + 20×3 + 15×4 + 10×4 + 5×5 + 5×3) ÷ 5 = 400 ÷ 5 = 80
- Base Hardware: (25×5 + 20×1 + 20×4 + 15×5 + 10×5 + 5×3 + 5×4) ÷ 5 = 385 ÷ 5 = 77
- Boltgate: (25×2 + 20×5 + 20×4 + 15×5 + 10×4 + 5×5 + 5×3) ÷ 5 = 385 ÷ 5 = 77

**Why Base Hardware dropped from 80 to 77:** Distinctiveness fell from 2 to 1
(−4 points) under the closeness anchors, and Domain rose from 3 to 4 (+1) because
`basehardware.shop` is now confirmed unregistered (it was rate-limited before).

### Sensitivity

Each criterion point moves the total by its weight divided by 5: Tone 5,
Distinctiveness 4, Category 4, Spelling 3, Brand fit 2, Length 1, Domain 1.

- If Base Hardware's Distinctiveness were 2, as in the earlier report, it would
  total 81, and the bar would be 86. No challenger would reach it.
- Ashworth clears the 82 bar by one point. Lowering its Tone or Category by one
  point (to 3 or 2) puts it at 78 or 79, below the bar.
- The ranking among the challengers (80–83) is within the same margin.

## Decision

The rule fixed before scoring: a challenger replaces Base Hardware only if it has
no hard failure, scores at least 5 points above Base Hardware's rescored total,
and the cost of a second rename is estimated. These are necessary conditions,
not an instruction to switch.

- **Ashworth meets all three on paper** (83 against a bar of 82, no hard
  failure, rename cost estimated below), with the cautions listed above.
- **No other challenger meets the score bar.** Nailbrook, the cleanest, is four
  points above.
- **Recommendation: keep Base Hardware**, because the margin is one point, it
  depends on judgment calls, and the best challenger is a surname with its own
  conflicts.
- **Switch if any of these happens:** the manual USPTO search shows live
  `ACE HARDWARE` marks that a reader would call confusingly close to
  `BASE HARDWARE`; anyone in the say-it-once test types or hears "Ace Hardware";
  or the project becomes a real business. In that case prefer Nailbrook for
  cleanliness, or Ashworth for the higher score.

## Rename impact

Nothing was changed. The cost of a second rename is smaller than the first
because the name now lives in one place.

| Area | What changes | Effort |
| --- | --- | --- |
| Site name | `siteName` in `lib/site.ts`. Titles, descriptions, OpenGraph, footer copyright, and the privacy page all read it | S |
| Wordmark | The `base` plus yellow `hardware` text in `Header.tsx`, `Footer.tsx`, and `MobileMenu.tsx`. A single-word name would need a different accent split | S |
| Favicon | `app/icon.svg` and `app/apple-icon.tsx` show a "B". A new initial needs a new path | S |
| Package and docs | `package.json`, `package-lock.json`, and about 10 current docs (the first rename touched 9) | S |
| Stitch mockups | The three new Base Hardware screens would be regenerated | M |
| Domain | Register the new domain instead of `basehardware.store` | S |

Seeded test accounts (`homebuzz.test`) are unaffected. Overall: S for code and M
including docs and Stitch.

## Rejected names

| Stage | Names | Reason |
| --- | --- | --- |
| Reused from earlier rounds | Every name in the earlier rejection logs, including Plankwell, Squarehouse, Haldo, Plumb & Post, Toolfolk, Brush & Bit, and the "X & Y" names | Not regenerated. "X & Y" names are ruled out by you |
| Pre-score | Cedar Supply, Granite Supply, Compass Supply, Tinsmith Supply, Bellwether Supply, Copperline Supply, Lantern Hardware, Birchwood Hardware | `<word> Supply` or `<word> Hardware` shares a structure with Tractor Supply, Ace Hardware, and Home Hardware (Distinctiveness 2) |
| Pre-score | Square Deal Supply, Well Made Supply, Fair Measure Supply, Level Best Hardware | Same shared structure, plus folksy tone and length 14–17 letters. "Level Best" also shares "Best" with Do it Best |
| Pre-score | Pier 9 Supply, Route 9 Supply, Dock 9 Hardware | Same shared structure, and the place-plus-number cue says nothing about home improvement. "Pier" can be misheard as "peer" |
| Pre-score | Toolvale, Ironvale, Hardwell, Fastwright, Spanwright, Gripwell, Drivewell | Invented blends scoring 64–78 before lookups. Several resemble "True Value" (`-vale`) or "Fastenal" (`fast-`), and `Hardwell` is also a well-known DJ name |
| Pre-score | Calloway, Ostrander, Halvorsen | Surnames with spelling risk (Calloway/Callaway, Ostrander, Halvorsen/Halvorson) |
| Screening | Merrick, Linwood, Pemberton, Anchor Hardware | Each failed a hard requirement. See the screening table |

## Assumptions and open questions

- **US market** was assumed (USD prices, USPTO search). A non-US launch changes
  the trademark and chain comparisons.
- **Is the Ace closeness acceptable for a portfolio demo?** This is your call. I
  treat it as a flag because it would matter for a real business.
- **Surname names:** you said they are acceptable, not preferred. Are you
  comfortable with a name that implies a founder who does not exist? Ashworth,
  Whitlock, Hollis, and Kendrick all imply one.
- **Category fit.** Surnames say nothing about the store, so they score 3. If you
  value a name that signals "hardware" at a glance, that favors keeping Base
  Hardware or Nailbrook.
- **Scoring is judgment.** Tone, category fit, and spelling are my ratings. A
  different reader could move several of them by a point.

## Next steps

1. **Say-it-once test (about 5 minutes):** say "Base Hardware" aloud to two or
   three people without spelling it, and ask them to type it. Note anyone who
   writes "Ace".
2. **USPTO by hand** at <https://tmsearch.uspto.gov>: search `base hardware`, then
   `ace hardware`, and compare the live marks in class 35. Also check the single
   word `BASE` in classes 7, 9, and 35. Repeat at <https://branddb.wipo.int>.
3. **Decide** using the switch conditions in [Decision](#decision).
4. **If keeping:** register `basehardware.store` (and `basehardware.shop`, also
   free on 2026-11-01), then set `NEXT_PUBLIC_SITE_URL`.
5. **If switching:** follow [Rename impact](#rename-impact), and recheck the new
   name's domains and USPTO results immediately before registering anything,
   since all results here are point-in-time.
