# Exports

| Format | How |
| --- | --- |
| PNG | Template → standalone SVG (hook-free serializer) with every used face embedded as base64 woff2 → `<img>` → 1200×630 canvas (2400×1260 for @2x) → PNG. Uploaded images are data URLs, so the canvas is never tainted. |
| SVG | The same standalone SVG. Fonts and images are embedded; renders offline. |
| React | A component importing the installed template with your content/theme/options. Uploaded images become `/og/<name>.<ext>` paths with a note. |
| Next.js | An `app/opengraph-image.tsx` using `renderOgPng`. |
| JSON | `{ version, template, content, theme, assets, options }` — restore with *Import JSON*. |

Fidelity: `npm run test:e2e` exports all 30 templates from the production build in Chromium and compares them with the resvg (server) render; the mean pixel difference is ≤ 2.1% (anti-aliasing and blur differences).
