// Types for static image imports (e.g. `import Bg from "/public/images/x.jpg"`).
// These normally arrive via next-env.d.ts, which is gitignored and only written
// by `next dev`/`next build` — so `tsc --noEmit` fails on a fresh clone without
// this. Replaces the old additional.d.ts, which referenced an uninstalled
// `next-images` package.
/// <reference types="next/image-types/global" />
