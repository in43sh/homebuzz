# Research Prompt: Is "Base Hardware" the Best Name? A Chain-Benchmark Review

You are conducting **naming research** for Base Hardware (renamed from Homebuzz
on 2026-10-31), a Next.js e-commerce store selling home-improvement products
(paint, power and hand tools, hardware, electrical, storage, bath, flooring,
appliances, garden). The owner likes the name but wants to confirm it is the
best available before spending money and effort on it (domain, trademark
search). This is a **research-only task**: produce a report that either
confirms Base Hardware or recommends a better name. Do **not** change code,
register any domain, or create any account.

## Mission

Answer one question: **is there a name that is clearly better than "Base
Hardware"?** Do it in three steps:

1. Learn how successful home-improvement and hardware chains are named
2. Measure how close Base Hardware and every challenger comes to those chains
3. Screen the challengers the same way Base Hardware was screened

The owner asked whether another big chain's name could be used for this store.
It cannot. Using an existing chain's name, or one close enough to be confused
with it, would infringe its trademark and mislead shoppers, so it is a **hard
failure** in this task. Big chains are a **benchmark**, not a source of names:
what they can teach is patterns (structure, length, the kind of word used).

The core rule: **every judgment must trace back to evidence.** Acceptable
evidence is one of:

1. A source you read about a chain's name (cite the URL and the date you read
   it)
2. A check you actually ran (domain lookup, web search, trademark search)
3. A rubric criterion applied the same way to every candidate, including Base
   Hardware
4. A concrete linguistic fact (a rhyme, a spelling ambiguity, an unwanted
   meaning)

A sample of 20–25 chains shows patterns, not proof that a pattern causes
success. Say so in the report.

**Keeping Base Hardware is a valid and likely outcome.** The report must say so
plainly when true. Do not recommend a switch for a marginal gain (see the
decision rule in Phase 6).

## Owner decisions already made

Treat these as fixed. Do not ask the owner again.

| Topic | Decision |
| --- | --- |
| Current name | Base Hardware, domain `basehardware.store` (unregistered on 2026-10-31, not yet bought). Already shipped on `main` |
| Why Homebuzz was dropped | It sounded gimmicky. Avoid hype words, puns, and trendy suffixes |
| Style | No two-word "X & Y" names. A brand word plus a plain category descriptor (like "Base Hardware") is fine |
| Surname-style names | Acceptable, in the way Lowe's and Menards are named. They collide with real businesses often, so screen these early |
| Intended use | Portfolio demo only, not a real business. A live conflicting trademark is still a hard fail, but no professional clearance is planned |
| Social handles | Not needed. Skip handle checks entirely |
| Domains | `.com`, `.shop`, or `.store` preferred. A missing domain does not rule out a really good name |
| Market | US (assumption: the store prices in USD; say so if you change it) |

## Read first

- [naming_research.md](naming_research.md): the decision, the criteria and
  weights, and the Base Hardware scores you must reproduce as the baseline
- [naming_research_2026-10-31.md](naming_research_2026-10-31.md) and
  [naming_research_round_2_2026-10-31.md](naming_research_round_2_2026-10-31.md):
  reuse their screening results and rejected-name logs. **Do not inherit their
  rankings.** They favored two-word "X & Y" names and did not use the owner's
  answers above
- [naming_research_prompt.md](naming_research_prompt.md): the original method
- `lib/categories.ts`, `lib/mock-products.ts`, and `app/globals.css`: what the
  store sells and its brand tokens (heavy 900-weight Inter wordmark, yellow
  `#ffce3a`, slate `#353b3e`)

## Ground rules

- Never claim a domain, trademark, or business status is free or clear unless
  you checked it in this session. Record the source and date of every check.
  If you could not run a check, mark it **unchecked**, never **available**.
- Trademark screening is a first pass, not legal clearance. Say so in the
  report.
- Cite a source for every factual claim about a chain (founding, name origin,
  store count). If you cannot find one, write "no source found" instead of
  using what you remember.
- Write any helper scripts under the scratchpad or `/tmp`, never inside the
  repo.
- Only if you estimate a rename: orient with `graphify query "<question>"`
  before grepping raw files (repo rule, see `CLAUDE.md`).

## Budget

The owner is cost-conscious. Stay inside these limits:

- One standard-mode web search per chain and one per challenger
- 20–25 benchmark chains, at most 40 generated challengers, at most 10
  challengers screened live
- Cheapest check first, and stop screening a name at its first hard failure

## Phase 1 — Build the benchmark set

Choose 20–25 chains: mostly large US home-improvement, hardware, paint, and
specialty-tool retailers, plus a few well-known international ones for
contrast. Start from your own list and verify every name against a source;
include at least these if they exist today: The Home Depot, Lowe's, Menards,
Ace Hardware, True Value, Do it Best, Harbor Freight, Tractor Supply, Floor &
Decor, Sherwin-Williams, Northern Tool, Fastenal, Screwfix, B&Q, Homebase,
Bunnings, Canadian Tire, and Home Hardware.

Record a table with one row per chain:

- Name, and whether it is a **founder or surname**, **descriptive**,
  **category-word plus ordinary word**, **acronym or abbreviation**, or
  **invented** name
- Word count and character count
- Whether the name contains a category word (Home, Hardware, Depot, Supply,
  Warehouse, Center, Lumber)
- Origin of the name, with a source
- Anything notable: a rename, a merger, a name that stopped fitting

## Phase 2 — Extract the patterns

From the table, report:

1. How many chains fall into each name type, and which types dominate among
   the largest chains
2. Typical length (median character count, and the range)
3. How often the name pairs a brand word with a category descriptor, the
   structure Base Hardware uses
4. Which category words are overused, which makes a new name hard to tell apart
5. Where names failed: a rename, a name that outgrew its category, or an
   embarrassing meaning (only with a source)

State what the patterns support and what they do not. For example, if most
large chains are surnames or "category word plus ordinary word", say whether
that favors Base Hardware's structure or argues for a different one.

## Phase 3 — Measure closeness to existing chains

Define the measure **before** scoring any name, then apply it to Base Hardware
and every challenger. For each name, compare it against every chain in the
benchmark set on:

1. **Shared word:** any word in common (ignoring "Hardware", "Home", "Supply")
2. **Shared structure:** the same pattern, such as `<word> Hardware`
3. **Sound:** the same ending sound or stress pattern when said aloud, and
   whether it could be misheard as the chain's name
4. **Edit distance:** the Levenshtein distance between the lowercase names with
   spaces removed (compute it with a script; do not eyeball it)

Record each name's three nearest chains. Use these anchors for the
Distinctiveness score in Phase 6:

| Score | Meaning |
| --- | --- |
| 1 | Same structure and a rhyme, or edit distance 2 or less, to a major chain |
| 2 | Same structure as a major chain, or a clear sound-alike |
| 3 | Shares one element (a word or a structure) with several chains |
| 4 | Shares a common category word only |
| 5 | Nothing shared |

The earlier report scored Base Hardware 2 because it rhymes with Ace Hardware
and shares the `<word> Hardware` structure with Ace and Home Hardware. Rescore
it under this method and show the work.

## Phase 4 — Generate challengers

Generate 30–40 names that use the *structures* the benchmark shows working,
without copying any chain. Constraints:

- A brand word, with or without a plain category descriptor. No "X & Y" names
- Nothing gimmicky: no puns, hype words, or `-ify`, `-ly`, `-io` suffixes
- No name whose distinctive element is already a benchmark chain's brand word
- Spread across styles: an ordinary word plus a category word, a single brand
  word, an invented word, and a plausible surname (allowed by the owner; a
  common surname is likely already used by a real business, so run the business
  search on these first)

Log each name with its style and a one-line rationale. Drop any name that fails
the Phase 3 measure badly or has an obvious bad meaning, with the reason. Reuse
the rejected-name logs from the earlier reports so the same names are not
generated and screened again.

Pre-score the rest on the criteria that need no lookups (tone, category fit,
spellability, length, brand fit, and Phase 3 distinctiveness), and keep the top
10.

## Phase 5 — Screen the top 10 and Base Hardware

Run every check on Base Hardware too, but never drop it. Order, cheapest first:

1. **Domains** (`.com`, `.shop`, `.store`). Use RDAP:
   `curl -sL -o /dev/null -w '%{http_code}' https://rdap.org/domain/<name>.<tld>`.
   Keep `-L`. `200` means registered and `404` means unregistered. If you get
   `429`, wait 10 seconds and retry, and space lookups about 3 seconds apart.
   Before trusting results, run a registered control (`google.com`) and a
   random string, and confirm they differ. If they do not, mark the extension
   **unchecked**.
2. **Existing businesses.** One quoted web search per name with category words
   (hardware, home improvement, tools, paint). Record what the search returned,
   and note it does not prove nothing unindexed exists.
3. **Trademarks.** Search <https://tmsearch.uspto.gov> through browser
   automation, looking for live marks in classes 35 (retail), 2 (paint),
   6 (metal hardware), 7 (power tools), 8 (hand tools), and 9 (electrical).
   Results from earlier runs disagreed: one automated search returned "No
   results found" for the known registered mark Houzz, while another reported
   working results. Always run a known-registered control first, and if the
   control returns nothing, mark the name **unchecked**. WIPO's Global Brand
   Database blocks automation, so mark WIPO **unchecked** and list it under
   Next steps.
4. **Language check.** Search for negative meanings and slang, and say aloud
   whether the name has one clear spelling.

## Phase 6 — Score and decide

Use the **same criteria and weights** as [naming_research.md](naming_research.md)
so scores stay comparable with the baseline: Tone 25, Distinctiveness 20,
Category fit 20, Spellability 15, Brand fit 10, Length 5, Domain quality 5.
Each criterion is scored 1–5 and the total is the weighted sum divided by 5.
The only change is Distinctiveness, which now uses the Phase 3 anchors. Do not
change any criterion or weight after seeing the names. Show the arithmetic.

**Decision rule, fixed before you score:** a challenger replaces Base Hardware
only if all three are true:

1. It has no hard failure (existing business in the field, live conflicting
   trademark, bad meaning, or a name too close to an existing chain)
2. Its total is at least 5 points above Base Hardware's rescored total
3. You have estimated the cost of a second rename

If no challenger meets all three, the recommendation is **keep Base
Hardware**, and the report explains what a better name would need.

For any challenger that wins, estimate the rename impact: the name is set in
one place (`siteName` in `lib/site.ts`), but the header, footer, and mobile
menu wordmark, the "B" favicon, the docs, the Stitch mockups, and any bought
domain would all change. Give an effort estimate (S/M/L).

## Phase 7 — Report

Deliver a single report at `docs/naming_benchmark_research.md` with:

1. **Executive summary:** keep or switch, and the single strongest reason
2. **Benchmark table** from Phase 1, with sources
3. **Patterns** from Phase 2, with what they do and do not support
4. **Closeness map** from Phase 3: the nearest three chains for Base Hardware
   and each finalist, with the numbers
5. **Shortlist table:** Base Hardware and up to 5 challengers, with per-
   criterion scores, totals, domain status, existing-business result, trademark
   result, and the date of each check
6. **Rejected names** with reasons
7. **Rename impact**, only if a challenger meets the decision rule
8. **Assumptions and open questions:** for example, whether the owner is
   comfortable with a surname that implies a founder who does not exist
9. **Next steps:** the manual checks still needed (USPTO by hand, WIPO, the
   say-it-once test with two or three people), in order

Report quality bar:

- Every claim about a chain has a source and a date
- Every "available" or "clear" claim has a source and a date, or says
  **unchecked**
- Decision-ready: a reader should be able to act without reading the appendix
- The report must pass `npx markdownlint-cli2` with zero issues
