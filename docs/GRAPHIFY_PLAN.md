# Graphify Integration Plan

> **Goal:** Install [Graphify](https://graphify.net/) and wire up its always-on Claude Code
> integration for the HomeBuzz repo, so Claude consults a knowledge graph of the codebase
> (app code + Drizzle schema + docs) before searching raw files.

**Branch:** `feature/graphify`
**Date:** 2026-06-22

---

## Execution log (2026-06-22)

- ✅ **Phase 0** — `pipx` installed via Homebrew (1.14.1).
- ✅ **Phase 1** — `graphifyy==0.8.44` installed (Python 3.14.6); `graphify install` registered the
  skill globally and created `~/.claude/CLAUDE.md` (was empty before — no loss). CLI verified.
- ✅ **Phase 3** — `graphify claude install`: graphify section **appended** to project `CLAUDE.md`
  (✅ `@AGENTS.md` import preserved — risk #2 resolved); `.claude/settings.json` PreToolUse hooks
  registered (Bash-search + Read/Glob). Hook uses portable `python3`, safe to commit. Hooks are
  **inert until `graphify-out/graph.json` exists**.
- ✅ **Phase 4** — `.graphifyignore` created (secrets + heavy dirs); `/graphify-out/` added to
  `.gitignore`.
- ✅ **Phase 2 (build) — DONE** (after Claude Code restart loaded the skill). Built via the
  `/graphify` skill (in-IDE, no API key). Note: interpreter auto-detect failed on the pipx `-E`
  shebang; pointed it at `~/.local/pipx/venvs/graphifyy/bin/python` manually. Result: **396 nodes,
  686 edges, 38 communities** (313 AST + 84 semantic from 14 docs + 15 images). 🔒 **Secret grep
  CLEAN** (`AUTH_SECRET`/`postgres://`/`npg_`/test-pw — none present). Risk #1 resolved.
- ✅ **Phase 6 — DONE.** PreToolUse hook **verified firing live** — it intercepted a `grep` and
  injected the "run `graphify query` first" directive, negligible latency. Risk #5 resolved.
- ⏳ **Phase 5** — sync: `graphify update .` documented in CLAUDE.md; optional `graphify hook install`
  (git post-commit auto-rebuild) still offered.

---

## What Graphify is

An open-source CLI ([`safishamsi/graphify`](https://github.com/safishamsi/graphify)) that turns a
folder of code, SQL schemas, docs, papers, and images into a queryable knowledge graph using
Tree-sitter static analysis + LLM-driven semantic extraction, NetworkX, and Leiden clustering.

> **⚠️ Name asymmetry (verified on PyPI 2026-06-22):** the install package is **`graphifyy`**
> (double `y`) — `pypi.org/pypi/graphify` (single `y`) is **404**. But the **CLI command** and the
> **GitHub repo** are **`graphify`** (single `y`). So: `pipx install graphifyy`, then run `graphify`.

Its deepest integration is with Claude Code: one command installs a `CLAUDE.md` directive plus a
`PreToolUse` hook so Claude consults the graph **before** every file-search tool call instead of
grepping raw files.

---

> **Note:** `docs/system-graph/` is a separate, unrelated artifact and is out of scope here.
> Graphify writes to `graphify-out/`, so there is no file collision — leave `docs/system-graph/`
> untouched.

---

## Prerequisites & environment findings

| Requirement | Status on this machine | Action |
| --- | --- | --- |
| Python ≥ 3.10 | ⚠️ Default `python3` is **3.9.6** (Xcode) — too old | Use **`/opt/homebrew/bin/python3.14`** (already installed via Homebrew) |
| `pipx` or `uv` (recommended installer) | ❌ Neither found | Install `pipx` via Homebrew, **or** use `python3.14 -m pip --user` |
| Claude Code | ✅ Present | — |

**Decision (Phase 0): ✅ `pipx`** — confirmed. Keeps the CLI isolated and on PATH (vs.
`python3.14 -m pip --user`).

---

## Phases

### Phase 0 — Choose install method (decision)

- [x] Installer confirmed: **`pipx`**.
- [ ] `brew install pipx && pipx ensurepath` (then restart shell so `~/.local/bin` is on PATH).

### Phase 1 — Install the CLI

- [ ] Install package `graphifyy` (note the double `y`), **pinned** to the current PyPI release
      `0.8.44` (avoid floating — this package ships frequently; latest checked 2026-06-22):
  - pipx route: `pipx install --python /opt/homebrew/bin/python3.14 graphifyy==0.8.44`
  - pip route: `/opt/homebrew/bin/python3.14 -m pip install --user graphifyy==0.8.44`
- [ ] Run `graphify install` once — registers the skill (the documented flow is
      `pip install graphifyy` → `graphify install` → `graphify claude install`).
- [ ] Verify the CLI is on PATH: `graphify --version`.

### Phase 2 — Build the first graph

- [ ] **🔒 Before building, create an explicit `.graphifyignore` (do this FIRST).** Graphify uses
      `.graphifyignore` if present (highest priority), else falls back to `.gitignore`. Our
      `.gitignore` *does* list `.env*`, but it uses a `!.env.example` negation, and Graphify has open
      bugs in exactly that area ([#882](https://github.com/safishamsi/graphify/issues/882) — `!`
      re-includes; [#945](https://github.com/safishamsi/graphify/issues/945),
      [#188](https://github.com/safishamsi/graphify/issues/188)). For a file holding `AUTH_SECRET`,
      don't trust the fallback — write an explicit ignore file in the repo root:

  ```gitignore
  # Secrets — never send to the model
  .env
  .env.*

  # Heavy / regenerable — skip for speed + cost
  node_modules/
  .next/
  out/
  coverage/
  test-results/
  playwright-report/
  blob-report/
  .vercel/
  ```

  (No `!.env.example` negation — that's the buggy `!` re-include pattern; `.env.example` has no
  secrets, so skipping it is harmless.)
- [ ] After `.graphifyignore` is in place, from the repo root: **`graphify .`** (the README uses
      `graphify .`, **not** `graphify build .` — there is no `build` subcommand).
- [ ] **Post-build secret check:** confirm nothing leaked into the output:

  ```bash
  grep -ri "AUTH_SECRET\|postgres://\|npg_\|password1234" graphify-out/
  ```

  Empty result = clean. **If anything leaked:** delete `graphify-out/`, and since the value was sent
  to the model provider, **rotate the exposed secret** — `npx auth secret` for `AUTH_SECRET`, or
  rotate the Neon password for `DATABASE_URL`.
- [ ] **Note on cost:** code files are parsed locally via tree-sitter (free, nothing leaves the
      machine). Docs/PDFs/images are sent to the model for semantic extraction. This repo is
      **doc-heavy** (`docs/`, many `.md`), so extraction *will* run. Run inside Claude Code so no API
      key is needed (the IDE provides the model); the standalone `graphify extract` path needs
      `ANTHROPIC_API_KEY`.
- [ ] Confirm `graphify-out/` is generated:
  - `graph.json` (persistent, queryable), `graph.html` (visual), `GRAPH_REPORT.md`, `cache/`.
- [ ] Verify the exact query/update command surface from `graphify --help` before relying on it
      (sources disagree on `query`/`path`/`--update` flags). Sanity-check with a scoped query, e.g.
      `graphify query "how does cart checkout create an order?"`.

### Phase 3 — Wire up the always-on Claude Code integration

- [ ] Run `graphify claude install` from the repo root. It does two things:
  1. **Writes to `CLAUDE.md`** — a directive telling Claude to consult the graph.
  2. Installs a **`PreToolUse` hook** (sources name `.claude/hooks.json`; Claude Code's real hook
     config lives in `.claude/settings.json` — check which it actually touches).
- [ ] **Collision check (important):** this repo's `CLAUDE.md` is a single line, `@AGENTS.md`. Before
      running, snapshot it (`git diff`/copy); after, confirm the `@AGENTS.md` import survives and the
      directive was *appended*, not *overwritten*. If it clobbers, restore and add the directive to
      `AGENTS.md` manually instead.
- [ ] Optionally `graphify hook install` for a git post-commit hook that keeps the graph fresh.

### Phase 4 — Repo hygiene (.gitignore / commit policy)

- [x] **Decision: gitignore** the generated artifacts — they're large, regenerable, and SHA-cached.
      Keep only config/hooks under version control.
- [ ] Add to `.gitignore`:

  ```gitignore
  # graphify
  /graphify-out/
  ```

  (`.graphifyignore` itself **is** committed — it's config, not output.)
- [ ] Decide whether the `.claude/` hook config is committed (so the integration travels with the
      repo / CI) or kept local via `.claude/settings.local.json`. Personal repo, so committing is
      fine — but only if the hook references a portable interpreter path, not a machine-specific one.

### Phase 5 — Keep it in sync

- [ ] Establish refresh workflow: `graphify . --update` (changed files only),
      or rely on the post-commit hook / `--watch` during active work.

### Phase 6 — Document & verify

- [ ] Add a short "Knowledge graph (Graphify)" section to `docs/` (or `AGENTS.md`) explaining how to
      rebuild and query.
- [ ] Final verification: confirm the `PreToolUse` hook fires (graph is consulted before a search).
- [ ] Fix any markdown lint warnings on touched docs.

---

## Open questions / risks

1. **🔒 Secret exposure (highest priority)** — extraction sends non-code files to the model and
   writes them into `graphify-out/`. `.env.local` holds `DATABASE_URL` + `AUTH_SECRET`.
   **Mitigation (see Phase 2):** write an explicit `.graphifyignore` before the first build (don't
   trust the `.gitignore` fallback — it has known `!`-negation bugs), grep the output for leaks
   after, and rotate any secret that slips through.
2. **CLAUDE.md collision** — the integration appends to `CLAUDE.md`; this repo's `CLAUDE.md` only
   imports `@AGENTS.md`. Need to verify the directive is added cleanly without breaking that import.
3. **LLM cost/keys** — semantic extraction may call an LLM; confirm which provider/key it uses and
   whether that's acceptable for this repo's size.
4. **Version pinning** — install via pip pinned to `graphifyy==0.8.44` (current PyPI latest). The
   README's `v1`/`v8` are **git branches**, not pip versions — don't conflate them.
   - **Watch:** `graphifyy` (double `y`) is a **temporary** name while the author reclaims the
     `graphify` PyPI name. Once reclaimed, the official package may move to `graphify` and `graphifyy`
     could stop getting updates — re-check the install name before future upgrades rather than
     assuming `graphifyy` forever.
5. **Hook latency/noise** — a `PreToolUse` hook fires before *every* file-search call. Combined with
   this repo's already-strict `AGENTS.md` workflow, confirm it doesn't add meaningful latency or
   distract from the existing Next.js-docs-first directive.
6. **Install method** — pipx vs. pip `--user` (Phase 0).
7. **Commit policy** — ✅ **decided: gitignore** the generated `graphify-out/` (large, regenerable,
   SHA-cached).

---

## Rollback

- `graphify claude uninstall` removes the hook + directive.
- `pipx uninstall graphifyy` (or pip uninstall) removes the CLI.
- `rm -rf graphify-out/` removes generated artifacts.
- Delete the `feature/graphify` branch if abandoned.
