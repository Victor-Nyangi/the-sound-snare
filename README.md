# The Sound Snare

A blog and podcast site — health, nutrition, religion, survival skills, and
quotes — built with Next.js and backed by Sanity CMS.

Live: https://soundsnare.vercel.app

## Stack

- **Next.js 15** (Pages Router), React 19
- **Sanity** as the content source, read through `@sanity/client`
- **Tailwind CSS v4** (CSS-first config — there is no `tailwind.config.js`;
  customise via `@theme` in `src/styles/globals.css`)
- **TypeScript**, **pnpm**

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in the Sanity values
pnpm dev
```

Open http://localhost:3000.

### Environment variables

All Sanity values are read server-side during `getStaticProps` and are never
exposed to the browser. See `.env.example` for the full list.

| Variable               | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `sanityprojectId`      | Sanity project id, from https://manage.sanity.io     |
| `sanitydataset`        | Usually `production`                                 |
| `sanityapiVersion`     | Sanity API version date, e.g. `2022-01-12`           |
| `quotesRef`            | `_ref` of the category holding the quotes document   |
| `NEXT_PUBLIC_SITE_URL` | Absolute site URL, for canonical and Open Graph tags |

`sanityprojectId` and `sanitydataset` also determine which `cdn.sanity.io`
paths `next/image` is allowed to optimize — see `next.config.js`.

Do not set `NODE_ENV`; Next.js manages it.

## Scripts

| Command             | Description                                         |
| ------------------- | --------------------------------------------------- |
| `pnpm dev`          | Development server                                  |
| `pnpm build`        | Production build (needs Sanity access to prerender) |
| `pnpm start`        | Serve a production build                            |
| `pnpm lint`         | ESLint (flat config, `eslint.config.mjs`)           |
| `pnpm typecheck`    | `tsc --noEmit`                                      |
| `pnpm format`       | Apply Prettier                                      |
| `pnpm format:check` | Verify formatting                                   |

## Content model

Content lives in a separate Sanity Studio, not in this repository. This app
reads three document types: `post`, `podcast`, and `youtubeChannel`.

Blog categories are mapped between slug and Sanity `_ref` in
`src/lib/sanity.ts` (`categoryMap` / `reverseCategoryMap`). Adding a category
in Sanity requires adding it there too.

## Routes

| Route                           | Rendering                          |
| ------------------------------- | ---------------------------------- |
| `/`                             | Static                             |
| `/blogs`                        | ISR, 30 min                        |
| `/blogs/articles/[slug]`        | ISR 1 h, `fallback: 'blocking'`    |
| `/blogs/category/[slug]`        | ISR 1 h, fixed set of 5 categories |
| `/quotes`, `/podcast`, `/about` | ISR 1 h / static                   |

There are no API routes — all data is fetched at build time or on revalidation.
