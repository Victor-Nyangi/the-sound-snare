# The Sound Snare — Engineering Handover

**Prepared:** 2026-08-27 · **Repo:** `Victor-Nyangi/the-sound-snare` · **`main` at:** `5cc4021`
**For:** incoming PM session · **From:** engineering session covering 2026-08-03 → 2026-08-10

> **Project root:** `~/Bread/Projects/Done/sound-snare/the-sound-snare`
> — i.e. `../Projects/Done/sound-snare/the-sound-snare` from `~/Bread/pm-os`.
> **Every path in this document is relative to that project root, not to your working
> directory.** `ASSESSMENT.md` means `<project root>/ASSESSMENT.md`.

---

## TL;DR

A Sanity-backed Next.js blog/podcast site. Over five merged PRs it went from *no CI, four live
bugs, 1238 packages* to *green CI, bugs fixed, dependencies current, in-page podcast playback*.

**Four things are open. Three of them need a human, not an agent** — two are credentials/permissions
only the repo owner holds, one is a stale PR awaiting a go/no-go. Nothing is blocked on engineering
capacity.

The single most consequential open item is **repo secrets**: without them CI skips the build step,
so the pipeline currently verifies lint/typecheck/format but *never that the app compiles*.

---

## Current state

| | |
|---|---|
| `main` | `5cc4021`, clean, in sync with origin |
| CI | ✅ green — `.github/workflows/ci.yml`, job `check`, ~43s |
| CI coverage | ⚠️ partial — build step **skipped**, see Open Item A |
| Branch protection | ❌ none — `main` accepts direct pushes |
| Open PRs | 1 (#3, stale 23 days) |
| Tests | none — no test suite exists, by prior decision |

---

## What shipped

| PR | Outcome |
|---|---|
| #1 | Project assessment; 4 user-visible bugs fixed; dead code removed (~⅓ of `src/`); `next-sanity` → `@sanity/client` (1238 → ~250 packages); SEO metadata |
| #2 | Unblocked a fully broken dev server after a pnpm 11 adoption |
| #4 | Podcast episodes play **in page** instead of linking out — Spotify iFrame embeds + a custom `<audio>` player |
| #5 | Fixed a player bug that every static check had passed |
| #6 | CI activated |
| #7 | CI actions moved off the deprecated Node 20 runtime |

---

## Open items

### A. Four repo secrets are unset — **highest value, owner-only**

`gh secret list` returns empty. `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION` and
`SANITY_QUOTES_REF` gate the CI build step via `if: ${{ env.sanityprojectId != '' }}`. Until they
exist, CI never compiles the app.

**Why this matters more than it sounds:** the bug in PR #5 — a podcast player with a dead seek bar
and a frozen `0:00 / 0:00` readout — passed `lint`, `typecheck` **and** `build` cleanly. It was
caught only by opening the page in a browser. A pipeline that doesn't even run `build` is a
narrower net than that.

**Who can do it:** repo owner only. Values are in their local `.env.local`; no agent has read them,
and they should not be pasted into a session. Ready-to-run commands were supplied in-session.

---

### B. Branch protection on `main` — owner-only

`main` currently accepts direct pushes; `check` is not a required status check. The intended config:
require `check`, `strict: true` (branch must be current), no required reviews (sole developer can't
approve their own PRs), `enforce_admins: false` (deliberate escape hatch — a GitHub Actions outage
during this work already made the case for one).

**Sequencing note:** do this *after* A. You want `check` proven green *with* the build step live
before it becomes a merge gate.

**Who can do it:** repo owner. An agent attempt was blocked by a permission classifier — that's a
guardrail, not an error, and shouldn't be retried silently.

---

### C. PR #3 — TypeScript 6.0.3 — **needs a go/no-go**

Open since 2026-08-04, **23 days stale**. Substantively complete and well-evidenced; it upgrades
TypeScript 5.9.3 → 6.0.3 with **zero source changes**.

It deliberately stops at TS 6 rather than 7: the codebase is already TS 7 clean, but
`typescript-eslint` refuses to load under TS 7 and takes `eslint-config-next` down with it. The PR
documents why the standard workaround can't be expressed here.

**The one blocker to merging:** static prerendering was never verified, because the authoring
environment blocks `*.api.sanity.io`. The PR asks for a local `pnpm build` before merge. That has
not happened.

**Decision needed:** run a local `pnpm build`, then merge — or close it as stale and redo later.
Note it grows riskier to merge the longer it sits behind `main`.

> **2026-10-19 — done.** TypeScript 6.0.3 is on `main` (`55775c6`, "chore(deps): upgrade TypeScript 5.9 -> 6.0.3"; PR #3 shows merged) with CI green on that commit; this item is closed.

---

### D. Environment-config hygiene — small, low risk

Two discrepancies found while mapping secret names:

- `.env.local` sets **`NODE_ENV`**, which `.env.example` explicitly warns against ("Next.js manages
  it, and overriding it breaks dev/production detection"). The project's own note, contradicted by
  its own file.
- `.env.local` defines **`prodUrl`**, but no code reads that name — `SEO.tsx` and `sitemap.xml.ts`
  read `NEXT_PUBLIC_SITE_URL`. Both fall back to a hardcoded URL, so canonical and Open Graph tags
  are correct *by luck rather than by config*. Renaming the variable makes it real.

Neither breaks anything today. Both are minutes of work.

---

## Product context worth carrying forward

**The podcast page curates other people's shows.** The owner wanted Spotify-style in-page
play/pause but rejected self-hosting audio on cloud storage cost. That makes the **Spotify iFrame
Embed API the primary playback path** — no API key, no OAuth, no quota, and the only Spotify surface
that plays full episodes without requiring *every listener* to hold Premium.

**A custom `<audio>` player also exists, but no content currently exercises it.** As of 2026-08-06
the only podcast in Sanity is third-party ("Huberman Lab") with `audioUrl: null`. Anyone testing the
player against live data will see nothing render and may wrongly conclude it's broken. This was
flagged before the work was built, not discovered after.

**Implication for roadmap:** any proposal that makes the `<audio>` player the main path, or that
adds audio hosting, is reopening a settled cost decision. Treat it as such.

---

## Notes for whoever picks up the work

- **Static checks are not sufficient for player/embed work.** Media-element event timing versus React
  effect ordering is invisible to lint, typecheck and build alike. Launch it and drive it.
- **`.github/workflows/ci.yml` comments are load-bearing.** They document two pnpm 11 behaviours that
  will otherwise be rediscovered painfully: the 24h `minimumReleaseAge` quarantine, and `allowBuilds`
  in `pnpm-workspace.yaml`. The explicit `cache: pnpm` input is also load-bearing — `setup-node@v6+`
  auto-caches for npm only.
- **No test suite exists.** CI is lint + typecheck + format (+ build, once A is done). Adding tests
  was scoped as P3 in the assessment and never started. That's a known, accepted gap — not an
  oversight to be surprised by.

---

## Where the deeper detail lives

All paths below are relative to the project root given at the top of this document. From
`~/Bread/pm-os`, prefix them with `../Projects/Done/sound-snare/the-sound-snare/`. The `gh`
commands work from anywhere if you pass `--repo Victor-Nyangi/the-sound-snare`; otherwise run
them from inside the project root.

- **`ASSESSMENT.md`** (301 lines) — the original audit: dependency table, per-bug analysis, phased
  remediation plan. Its status banner is current and records what was *not* done. §9 covers the
  TypeScript 6/7 measurements.
- **PR bodies** — each merged PR documents its own reasoning and verification. PR #3's body is the
  authoritative record on the TypeScript 7 blocker.
- **`.github/workflows/ci.yml`** — inline comments explain the pnpm 11 constraints.

---

## Suggested sequencing

1. **Secrets** (A) — unblocks real CI coverage. Everything else is safer afterwards.
2. **Confirm the build step un-skips** — re-run CI, verify `Build` shows ✓ rather than `-`.
3. **Branch protection** (B) — now that the gate is worth gating on.
4. **PR #3** (C) — local `pnpm build`, then merge or close.
5. **Env hygiene** (D) — whenever convenient.

Steps 1–3 are minutes of work each and all sit with the repo owner. Step 4 needs a decision, not
engineering.
