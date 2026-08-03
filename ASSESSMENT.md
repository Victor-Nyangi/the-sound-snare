# The Sound Snare — Project Assessment

**Date:** 2026-08-03
**Branch assessed:** `claude/project-assessment-report-23mfcm` (at `ff3a642`)
**Stack:** Next.js 15.3.4 (Pages Router) · React 19.1 · TypeScript 5.8 · Tailwind v4 · Sanity CMS · pnpm

---

## Executive summary

The app is a small Sanity-backed blog/podcast site — 37 source files, 5 content pages, no tests, no CI.
It is structurally sound but carrying a meaningful amount of drift: several dependencies are 1–4 major
versions behind, roughly a third of `src/` is dead code that no longer runs, and there are **four
user-visible bugs** shipping in production today.

Where to spend effort, in order:

| Priority | Theme                                                                                 | Effort      | Why                                                                |
| -------- | ------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------ |
| **P0**   | 4 live bugs (broken links, missing page titles, unstyled nav, new posts never appear) | ~half a day | Users hit these now                                                |
| **P1**   | Drop `next-sanity` → `@sanity/client`; delete dead code                               | ~half a day | 1238 → ~250 packages; removes 1/3 of `src/`                        |
| **P2**   | Dependency upgrades (Next 16, ESLint flat config)                                     | 1–2 days    | `next lint` is removed in Next 16 — blocking for any later upgrade |
| **P3**   | Test/CI baseline, SEO infrastructure                                                  | 1–2 days    | Nothing currently guards regressions                               |

Note on verification: the sandbox proxy blocks `*.api.sanity.io`, so `next build` completes
compilation and type-checking but fails at the static-prerender step. Everything below was verified by
reading code, running `tsc --noEmit`, running `next lint`, and resolving package metadata from the
registry. The build failure is an environment limitation, not a project defect.

---

## 1. Dependency audit

Installed versions vs. latest on the registry as of 2026-08-03:

| Package                                | Installed | Latest  | Gap          | Notes                                                           |
| -------------------------------------- | --------- | ------- | ------------ | --------------------------------------------------------------- |
| `next`                                 | 15.3.4    | 16.2.12 | **1 major**  | `next lint` removed in 16 — the `lint` script breaks on upgrade |
| `react` / `react-dom`                  | 19.1.0    | 19.2.8  | patch        | Safe, do it now                                                 |
| `sanity`                               | ^4.0.1    | 6.8.0   | **2 majors** | Studio package — **not imported anywhere**, see §3              |
| `next-sanity`                          | ^9.12.0   | 13.2.3  | **4 majors** | Only `createClient` is used — should be replaced, see §3        |
| `@portabletext/react`                  | ^2.0.3    | 7.0.1   | **5 majors** | Renders every article body; upgrade carefully                   |
| `eslint`                               | ^9.30.0   | 10.8.0  | **1 major**  | Also in the wrong dependency block, see §4                      |
| `eslint-config-next`                   | ^15.3.4   | 16.2.12 | **1 major**  | Must move in lockstep with `next`                               |
| `typescript`                           | ^5.8.3    | 7.0.2   | **2 majors** | TS 7 is the native-port compiler; treat as its own task         |
| `@types/node`                          | ^24.0.7   | 26.1.2  | 2 majors     | Match to the deployed Node runtime, not to latest               |
| `@types/react`                         | ^19.1.8   | 19.2.18 | minor        | Bump with React                                                 |
| `@types/react-dom`                     | ^19.1.6   | 19.2.4  | minor        | Bump with React                                                 |
| `tailwindcss` / `@tailwindcss/postcss` | ^4.1.11   | 4.3.3   | minor        | Safe                                                            |
| `postcss`                              | ^8.5.6    | 8.5.25  | patch        | Unused directly — see §4                                        |
| `autoprefixer`                         | ^10.4.21  | 10.5.4  | minor        | **Unused** — Tailwind v4 handles this                           |
| `moment`                               | ^2.30.1   | 2.30.1  | current      | Project is in maintenance mode upstream; see §5                 |

### Suggested upgrade ordering

1. **Patch/minor first** (React 19.2.x, Tailwind 4.3.x, types) — low risk, gets the tree clean.
2. **ESLint flat config** — migrate `.eslintrc.json` → `eslint.config.mjs`. Required before ESLint 10,
   and required anyway by step 3.
3. **Next 15 → 16 + `eslint-config-next` 16 together.** Replace the `lint` script with `eslint .`,
   since `next lint` no longer exists in 16.
4. **`@portabletext/react` 2 → 7** on its own. This one actually renders content; the custom `components`
   serializer in `src/pages/blogs/articles/[slug]/index.tsx:38` uses the v2 `props.node.*` shape, which
   changed in v3+. Needs manual porting and a visual check against a real article.
5. **TypeScript 7** last, independently. Nothing else depends on it.

---

## 2. P0 — Bugs live in production

### 2.1 Article links on the blog index go to the wrong URL

`src/components/Blog/LatestArticles.tsx:36` and `:47`

```tsx
<Link href={post.slug.current}>          // ← no leading slash, no /blogs/articles prefix
<Link href={`blogs/articles/${post.slug.current}`}>   // ← no leading slash
```

Neither is an absolute path. The headline link on `/blogs` resolves to `/<slug>` — a 404 — and the
"Read More" link resolves relative to the current path. `OtherArticles.tsx:43` does it correctly
(`/blogs/articles/${...}`); `LatestArticles` was never brought in line. **Every headline link on the
blog index is broken.**

### 2.2 Every page has an empty `<title>` (React 19 regression)

`src/components/Meta.tsx:22-26`

```tsx
Meta.defaultProps = {
  title: "Sound Snare blog",
  keywords: "blog, health, podcast",
  description: "...",
};
```

React 19 **removed `defaultProps` support for function components.** `Layout.tsx` renders `<Meta />`
with no props, so `title`, `keywords`, and `description` are all `undefined` at runtime — meaning no
page title and no meta description sitewide. This is pure SEO damage and it is invisible in
TypeScript, which still honours `defaultProps` at the type level. Fix with ES default parameters.

### 2.3 Header navigation text is unstyled

`src/components/Header.tsx:29, 34, 69, 75`

```tsx
className={`... text-${color} ...`}
```

Tailwind's scanner cannot see dynamically constructed class names, so `text-white` is never emitted
into the CSS bundle. Every caller passes `color="white"`, and the nav renders in the default colour
against dark hero images. Pass complete class strings instead of interpolating fragments.

### 2.4 New Sanity posts never appear until a redeploy

`src/pages/blogs/articles/[slug]/index.tsx:158` and `src/pages/blogs/category/[slug]/index.tsx`

Both use `fallback: false` in `getStaticPaths`. For a CMS-backed blog this means any post published
after the last build returns a hard 404 forever. `revalidate` only refreshes pages that already exist
— it does not create new ones. Change to `fallback: 'blocking'`.

### Also worth fixing while in there

- `src/pages/blogs/articles/[slug]/index.tsx:188` — `console.log(postData, "postData")` left in.
  (`removeConsole` strips it in prod, but it noises up every dev build.)
- `src/components/ErrorBoundary.tsx:38` — `&aspos;` is a typo for `&apos;`; renders literally.
- `src/components/Skeleton.tsx:16` — `Math.random()` in the render path produces different markup on
  server and client → hydration mismatch whenever the component is used.
- `src/pages/quotes.tsx` and `src/pages/podcast/index.tsx` have **no `revalidate`** — they are baked at
  build time and never refresh, unlike the blog pages.

---

## 3. P1 — The dependency tree is ~5× larger than it needs to be

The project installs **1238 packages**. It uses exactly one Sanity API: `createClient`.

```
src/client.ts:1           import { createClient } from "next-sanity";
src/lib/sanity.ts:1       import { createClient } from "next-sanity";
src/pages/api/client.ts:1 import { createClient } from "next-sanity";
src/pages/api/quotes.ts:1 import { createClient } from "next-sanity";
```

Two compounding problems:

1. **`sanity` (the Studio) is a direct dependency but is imported nowhere.** No `sanity.config.ts`, no
   `defineConfig`, no Studio route. It is 36 MB on disk and drags in `date-fns` twice (58 MB),
   `hls.js` (24 MB), and `rxjs` (12 MB).
2. **Removing it from `package.json` does not help.** `next-sanity@9` declares `sanity` as a
   _required, non-optional_ peer dependency, so pnpm reinstalls it regardless. Verified: deleting it
   from `package.json` took the tree from 1238 → 1237 packages.

**The fix is to stop depending on `next-sanity` at all.** Swap the four imports to `@sanity/client`,
which is what `next-sanity` wraps. Measured footprint of `@sanity/client` standalone: **22 packages.**
The change itself is a one-line edit per file — `createClient` has the same signature.

This also sidesteps the `next-sanity` 9 → 13 upgrade (4 majors) entirely.

---

## 4. Dead code and cruft

Roughly a third of `src/` no longer executes. Commit `2e615fa` ("move sanity api calls from next js api
routes") moved all data fetching into `getStaticProps`, but the old API layer was never deleted.

**All 10 files under `src/pages/api/` are unreachable.** Nothing in the codebase fetches `/api/*` —
verified by grep. They still ship as serverless/edge functions on every deploy and still read
`process.env.sanity*`:

```
src/pages/api/blogs.ts                          src/pages/api/quotes.ts
src/pages/api/latestblogs.ts                    src/pages/api/categorydata.ts
src/pages/api/posts/[slug].ts                   src/pages/api/client.ts
src/pages/api/blogcategories/index.ts           src/pages/api/blogcategories/[slug].ts
src/pages/api/otherposts/[categslug]/[slug].ts  src/pages/api/hello.ts   ← create-next-app boilerplate
```

Other dead weight:

| File                               | Issue                                                                                                                                                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/client.ts`                    | Unused. Also **hardcodes `projectId: "l0s21o0s"`**, which contradicts `next.config.js` (`x1bgmc3m`). One of the two is stale — worth resolving before it misleads someone.                             |
| `src/lib/cache.ts`                 | **Empty file.**                                                                                                                                                                                        |
| `src/lib/analytics.ts`             | Never imported. Also references `NEXT_PUBLIC_GA_ID`, which is absent from `.env.example`.                                                                                                              |
| `src/components/SEO.tsx`           | Never imported — and it is strictly better than the `Meta.tsx` actually in use (OG tags, Twitter cards, canonicals). Adopting it would fix §2.2 and improve SEO in one move.                           |
| `src/components/Skeleton.tsx`      | Never imported.                                                                                                                                                                                        |
| `src/components/ErrorBoundary.tsx` | Never imported — `_app.tsx` does not wrap anything in it.                                                                                                                                              |
| `src/styles/Home.module.css`       | 278 lines, never imported.                                                                                                                                                                             |
| `tailwind.config.js`               | **Silently ignored.** Tailwind v4 is CSS-first; a JS config is only read via an explicit `@config` directive, and `globals.css` contains only `@import 'tailwindcss'`. The `content` globs do nothing. |
| `additional.d.ts`                  | `/// <reference types="next-images" />` — `next-images` is not installed.                                                                                                                              |
| `config/index.ts`                  | Exports a hardcoded `server` constant; the `dev`/`prodUrl` logic above it is commented out. Imported by `blogs/index.tsx` and `quotes.tsx` but unused in both.                                         |
| `autoprefixer`, `postcss`          | In `devDependencies` but absent from `postcss.config.mjs`. Tailwind v4 vendors its own pipeline.                                                                                                       |

Deleting all of the above removes ~15 files and 4 dependencies with zero behaviour change.

---

## 5. Configuration issues

**`eslint` and `eslint-config-next` are in `dependencies`, not `devDependencies`.** They ship to
production installs. Move them.

**`.env.example` is misleading and incomplete.**

```
NODE_ENV = ""     ← never set this; Next manages it, and setting it breaks dev/prod detection
```

It also uses `KEY = ""` (spaces around `=`, which some parsers preserve) and omits two variables the
code actually reads: `NEXT_PUBLIC_GA_ID` (`lib/analytics.ts`) and `NEXT_PUBLIC_SITE_URL`
(`components/SEO.tsx`). The lowercase names (`sanityprojectId`) are unconventional but harmless —
all reads happen server-side in `getStaticProps`, so no secret is exposed to the client.

**`.gitignore` covers `.env*.local` but not a plain `.env`.** A developer creating `.env` will commit
it. Add `.env` and negate `!.env.example`.

**`tsconfig.json` targets `es5`.** For a React 19 / Next 15 app this only inflates output —
downlevelled generators and helpers for browsers that cannot run the framework anyway. `es2022` is
the appropriate floor. `moduleResolution: "node"` is likewise the legacy algorithm; `bundler` is
correct for Next.

**`tsc --noEmit` fails on a fresh clone** with two errors on `src/pages/podcast/index.tsx:4-5`. The
static image type declarations live in `next-env.d.ts`, which is gitignored and only generated by
`next dev`/`next build`. Any CI typecheck job must run `next build` first, or the check fails
spuriously.

**`next.config.js` pins `remotePatterns` to Sanity project `x1bgmc3m`.** Article images
(`blogs/articles/[slug]/index.tsx:130`) are optimized through `next/image` without `unoptimized`, so
if the `sanityprojectId` env var ever differs from that hardcoded literal, image optimization throws
at runtime. Derive the pattern from the env var instead of hardcoding it.

---

## 6. Performance and SEO

- **`unoptimized` is set on 3 of the site's most prominent images** — `Header.tsx:20` (the hero on
  every page) and `LatestArticles.tsx:24`. These bypass Next's resizing and WebP/AVIF conversion
  entirely, which is the main thing `next/image` is for. `next.config.js` even configures
  `formats: ['image/webp', 'image/avif']`, which these three images ignore.
- **`<img>` instead of `<Image>` in 3 places** — flagged by `next lint`: `src/pages/index.tsx:12`
  (the homepage LCP element) and `src/pages/podcast/index.tsx:126, 198`.
- **`moment` for a single date format.** `LatestArticles.tsx`, `category/[slug]`, and
  `articles/[slug]` each use it for exactly one `.format("dddd, MMMM Do YYYY")` call. Moment is
  ~70 KB gzipped, is not tree-shakeable, and is in maintenance mode upstream. `Intl.DateTimeFormat`
  covers this natively at zero cost; `date-fns` if something richer is needed later.
- **No `robots.txt`, no `sitemap.xml`, no structured data.** For a content site whose entire purpose
  is organic discovery, this is the highest-leverage SEO gap after fixing §2.2.
- **`public/images/` ships unused assets** — `.jfif` files, `next.svg`, `thirteen.svg`, `vercel.svg`,
  and a duplicated `sound-snare-bg.jpg` at both `public/` and `public/images/`.
- **Hero image on `/blogs` (`Image width={500} height={100}`)** is declared at dimensions unrelated to
  its rendered size throughout the codebase, which defeats correct `srcset` generation.

---

## 7. Missing infrastructure

- **No tests.** No runner, no test files, no `test` script.
- **No CI.** No `.github/` directory at all — nothing runs lint, typecheck, or build on push.
- **No formatter.** No Prettier config; formatting is visibly inconsistent across files.
- **The `lint` script will break on the Next 16 upgrade** (`next lint` is removed). Migrating to
  `eslint .` with a flat config is a prerequisite, not an optional cleanup.
- **README is unmodified `create-next-app` boilerplate.** It documents `pages/api/hello.ts` — a file
  that exists but is dead — and says nothing about the Sanity setup or the required env vars, which
  is the one thing a new contributor actually needs.

---

## 8. Suggested sequencing

**Phase 1 — Stop the bleeding (~half a day).** The four P0 bugs in §2, plus the `revalidate` gaps.
Independently shippable, no dependency changes, immediately visible to users.

**Phase 2 — Shrink and clean (~half a day).** Replace `next-sanity` with `@sanity/client`
(1238 → ~250 packages), delete `src/pages/api/` and the other dead files in §4, fix `.gitignore` and
`.env.example`. Large diff, near-zero behavioural risk.

**Phase 3 — Guardrails (~1 day).** ESLint flat config, Prettier, a GitHub Actions workflow running
lint + typecheck + build. Do this _before_ Phase 4 so the upgrades have something catching them.

**Phase 4 — Upgrades (~1–2 days).** Following the ordering in §1. Next 16 and
`@portabletext/react` 7 are the two that need real attention; the rest are mechanical.

**Phase 5 — SEO and performance.** Adopt `SEO.tsx` in place of `Meta.tsx`, add `robots.txt` and a
generated sitemap, drop `moment`, remove the `unoptimized` flags, convert the remaining `<img>` tags.

Two open questions worth resolving before Phase 2, since both suggest something was left half-migrated:

1. **Which Sanity project is live** — `x1bgmc3m` (`next.config.js`) or `l0s21o0s` (`src/client.ts`)?
2. **Was an App Router migration intended?** `tailwind.config.js` globs `./app/**`, and the codebase
   is entirely Pages Router. If App Router is on the roadmap, it should land before Phase 5 rather
   than after — otherwise the SEO work gets rewritten.
