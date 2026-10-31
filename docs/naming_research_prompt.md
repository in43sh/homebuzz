# Research Prompt: Choosing a New Name for Homebuzz

You are conducting **naming research** for Homebuzz, a Next.js e-commerce store
selling home-improvement products (paint, power tools, hand tools, hardware,
electrical, storage). The owner thinks "Homebuzz" is not a good name. This is a
**research-only task**: produce a findings report and a ranked shortlist of
replacement names. Do **not** rename anything in the codebase, register any
domain, or create any account.

## Mission

Find a name that is **clearly better than "Homebuzz" on criteria you define
and measure first**, not one that simply sounds nicer to you.

The core rule: **every judgment must trace back to evidence.** Acceptable
evidence is one of:

1. A result from a check you actually ran (trademark search, domain lookup,
   handle lookup, web search for existing businesses)
2. A named naming criterion from Phase 2, applied the same way to every
   candidate
3. A concrete linguistic fact (spelling ambiguity, pronunciation, an unwanted
   meaning or sound in another language)

Choosing by taste alone ("this one feels premium") is out of scope. If
"Homebuzz" turns out to be stronger than the alternatives on some criteria,
say so. Keeping the current name is a valid conclusion, and the report must
include it as the baseline in every comparison.

## Before you start

Ask the owner these questions before Phase 1, because the answers change how
much checking each candidate needs. If the owner is unavailable, proceed with
the default in brackets and state that assumption at the top of the report.

1. Why do you dislike "Homebuzz"? (No answer: rely on the Phase 1 diagnosis.)
2. Is this a portfolio demo only, or might the name be used for a real
   business? (Default: portfolio demo. Trademark conflicts with active marks
   are still a hard fail, but no professional clearance is planned.)
3. Which social platforms matter? (Default: Instagram, X, and GitHub.)
4. Is a non-`.com` domain acceptable, and is there a budget for a premium
   domain? (Default: yes to `.shop`, `.store`, `.co`; no premium budget.)
5. Any names, words, or styles you already like or rule out? (Default: none.)

## Ground rules

- Never claim a domain, trademark, or handle is free unless you checked it
  in this session. Record the source and the date of every check. If you
  could not run a check, mark it **unchecked**, never **available**.
- Trademark screening here is a first pass, not legal clearance. Say so in
  the report, and flag which finalists would need a professional search
  before any real-world use.
- Base the name on what the store actually sells and how it talks, using the
  files listed below. You do not need to run the app for this task; if you
  do, read `AGENTS.md` first and follow its prerequisite phases.
- Orient in the codebase with `graphify query "<question>"` before grepping
  raw files (repo rule, see `CLAUDE.md`).
- Product context to read before generating names:
  - `lib/categories.ts` (the 15 store categories) and `lib/mock-products.ts`
    (product names, prices, units)
  - `app/globals.css` (brand tokens: Inter, heavy 900-weight headings, yellow
    `#ffce3a` accent, slate `#353b3e` surfaces)
  - `docs/redesign_research_prompt.md` (the product's ambition:
    portfolio-grade demo store)

## Phase 1 — Diagnose the current name

Before proposing anything, write down specifically what is wrong with
"Homebuzz", so the replacement can be tested against those problems. At
minimum, check:

1. **Confusion with existing brands.** Search for home-improvement and home
   brands with a similar look or sound (for example, Houzz, Home Depot,
   HomeBase, and any business already trading as "Homebuzz" or "Home Buzz").
   Record each match and how close it is.
2. **Meaning.** What does "buzz" suggest to a shopper buying a drill or a
   gallon of paint? Does it describe the store, mislead, or say nothing?
3. **Spelling and say-it-once test.** If someone hears the name once, can they
   type it correctly? (Homebuzz, Home Buzz, Homebuz, HomeBuzz.)
4. **Category fit.** Does it read as a home-improvement store, a smart-home
   gadget brand, a real-estate site, or a social network?

Summarize the diagnosis as 3–5 numbered problems. Each problem must map to at
least one Phase 2 criterion, so the scoring tests whether a candidate actually
fixes it.

## Phase 2 — Define the criteria

Set the criteria **before** generating candidates. Split them into two kinds:

**Hard requirements** (pass/fail; one failure drops the candidate):

- No live trademark for the same or a confusingly similar name in the
  relevant classes (see Phase 4)
- No existing business trading under the name in home improvement,
  hardware, or home services
- No offensive or embarrassing meaning in English, common slang, or the most
  widely spoken languages
- At least one acceptable domain (per the owner's answer to question 4) is
  unregistered

**Scored criteria** (each scored 1–5, then weighted). Propose weights that sum
to 100 and justify them; the owner can change them later. Cover at least:

- **Distinctiveness:** not confusable with an existing brand in home
  improvement, hardware, or home services
- **Relevance:** suggests what the store sells or why to shop there, or is
  an abstract name that can carry that meaning over time
- **Spellability and pronounceability:** passes the say-it-once test; no
  ambiguous letters or doubled consonants that people get wrong
- **Length:** short enough for the header wordmark, a favicon, and a domain
- **Domain quality:** exact-match `.com` scores highest, then an exact match
  on `.shop`, `.store`, or `.co`, then a modified name (`get-`, `-shop`,
  `-supply`)
- **Handles:** the same handle is free on the owner's chosen platforms
- **Brand fit:** works with the existing visual identity (heavy 900-weight
  wordmark, yellow and slate), so renaming does not force a redesign

Write down what a 1, 3, and 5 mean for each scored criterion, so two people
scoring the same name would land within a point of each other. Show which
criterion covers each Phase 1 problem; add a criterion if one is uncovered.

## Phase 3 — Generate candidates

Generate a wide pool first (40–60 names), then narrow it down. Spread the
pool across naming styles so the shortlist is not all one type:

- **Descriptive** (says what it is, for example "X Supply", "X Hardware")
- **Suggestive** (hints at building, fixing, craft, or tools)
- **Compound or blended** words
- **Invented or abstract** words
- **Founder-style or place-style** names, only if the owner's answer to
  question 5 allows them

Avoid the patterns that most startup names already use, because those names
are usually taken and hard to tell apart: `-ify`, `-ly`, `-io`, and the words
Hub, Nest, Hive, Pro, and Depot.

For each name, record its style and a one-line rationale. Then narrow the pool
to 10–15 survivors:

1. Drop anything that obviously fails a hard requirement (for example, an
   obvious bad meaning or a well-known brand with the same name), and log
   why.
2. Score the rest on the criteria that need no lookups (relevance,
   spellability, length, brand fit) and keep the top 10–15.
3. Make sure at least three styles are still represented; if not, swap in
   the best-scoring name of a missing style.

Log every dropped name and the reason, so the owner can see what was rejected
and on what grounds.

## Phase 4 — Screen and score

Screen the surviving 10–15 candidates in this order, cheapest check first,
stopping on a candidate as soon as it fails a hard requirement:

1. **Domain lookup** for `.com` and the fallback extensions:
   - `.com`, `.shop`, `.store`: RDAP via
     `curl -sL -o /dev/null -w '%{http_code}' https://rdap.org/domain/<name>.com`.
     Keep the `-L`: without it every lookup returns `302`. `200` means
     registered; `404` means likely unregistered.
   - `.co`: use `whois <name>.co` instead. `rdap.org` returns `404` even for
     registered `.co` domains (for example `google.co`), which would be a
     false "available". `DOMAIN NOT FOUND` in the `whois` output means
     unregistered.
   - Before trusting either method for an extension, run it once on a domain
     you know is registered and once on a random string, and confirm the two
     results differ. If they don't, mark that extension **unchecked**.
   - "Unregistered" does not mean "for sale at standard price", and a
     registered domain may still be for sale. Record which applies.
2. **Web search** for existing businesses using the name, especially in
   home improvement, hardware, and home services
3. **Trademark screen** in the USPTO trademark search
   (<https://tmsearch.uspto.gov>), looking for live marks in retail store
   services (class 35) and the relevant goods: paints (class 2), metal
   hardware such as screws and nails (class 6), power tools (class 7), hand
   tools (class 8), and electrical supplies (class 9). Also check WIPO's
   Global Brand Database (<https://branddb.wipo.int>) for international
   conflicts. Search for similar spellings and sounds, not only exact
   matches.
4. **Handle lookup** on the owner's chosen platforms. Profile pages often
   hide behind login walls, so a failed fetch is **unchecked**, not
   **available**.
5. **Linguistic check** for negative meanings, slang, and pronunciation
   problems

If a site cannot be queried from your environment (for example, a search
page that needs JavaScript), use the browser automation tools if you have
them; otherwise mark that check **unchecked** and list it under Next steps
for the owner to run by hand.

Score each survivor against every weighted criterion, and score "Homebuzz"
the same way as the baseline. Run every check on "Homebuzz" too, but never
drop it: if it fails a hard requirement, report that as a finding, since it
is a strong reason to rename. Show the arithmetic so the ranking can be
reproduced.

## Phase 5 — Rename impact

For the top 3 names, estimate what a rename would touch in this repo so the
owner knows the cost. Search the codebase (via `graphify query` first, then
targeted grep) and list every place the name appears, grouped by type:

- User-facing copy and metadata (page titles, OpenGraph, JSON-LD, sitemap)
- Brand assets (wordmark, logo, favicon)
- Code identifiers and config (`package.json` name, `lib/site.ts`, env
  vars such as `NEXT_PUBLIC_SITE_URL`)
- Seed data and tests (the seeded accounts use the `homebuzz.test` email
  domain; e2e tests may assert on the name)
- Docs, the repository name, and the GitHub remote

Do not make any of these changes. Give a rough effort estimate (S/M/L) and
note anything that needs care, such as seeded emails that existing local
databases already contain.

## Phase 6 — Synthesis

Deliver a single report at `docs/naming_research.md` containing:

1. **Executive summary:** the recommended name, the runner-up, and in one
   sentence each, why they beat "Homebuzz"
2. **Diagnosis:** the numbered problems with the current name from Phase 1
3. **Criteria and weights** from Phase 2
4. **Shortlist table:** for each finalist and for "Homebuzz": name, style,
   score per criterion, total, domain status, handle status, trademark
   screen result, and the date each check was run
5. **Rejected names:** a compact list with the reason each was dropped
6. **Rename impact** for the top 3 from Phase 5
7. **Assumptions and open questions:** which "Before you start" defaults
   you used because the owner did not answer, plus any new decisions that
   came up during the research
8. **Next steps:** what to verify before committing to the name (for
   example, a professional trademark search, buying the domain, reserving
   handles), in order

Report quality bar:

- The shortlist has 3–5 names. If none clearly beats the baseline, say so
  and explain what kind of name would.
- Every "available" claim has a source and a date.
- The report must pass `npx markdownlint-cli2` with zero issues.
