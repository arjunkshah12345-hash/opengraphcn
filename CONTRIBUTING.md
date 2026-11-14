# Contributing to opengraphcn

Thanks for helping. Templates, renderer fixes and docs improvements are all welcome.

## Setup

```bash
npm install
npm run dev
```

## Adding a template

1. Create `src/og/templates/<id>.tsx`. Copy a template close to your idea and follow its shape:
   - a pure render function `(props: TemplateProps) => <Frame>…</Frame>` — no hooks, no browser APIs
   - a `TemplateDef` export with `id`, `number`, `name`, `collection`, `description`, `fonts`, `theme`, `limits`, `uses`
   - a `<XxxImage />` component that wraps `<OgImage template={…} />`
2. Use only faces listed in `src/og/core/fonts.ts`. To add a family, add it to `FAMILIES` in `scripts/build-metrics.mjs`, `npm i @fontsource/<slug>`, and run `npm run metrics`.
3. Lay text out with `blockTop` / `blockBottom` / `blockCenter` / `fitLine` from `core/kit` so it never overflows. Draw icons as geometry — most fonts don’t carry ★ → ✦.
4. Prefix every gradient/filter/clip id with `uid`.
5. Register it in `src/og/templates/index.ts`.
6. Run `npm test` — the suite renders every template with default, very long and very short content to `test-output/`. Look at the PNGs.

## Before opening a PR

```bash
npm run lint && npm run typecheck && npm test && npm run build
npm run test:e2e   # optional, needs Playwright Chromium
```

Keep PRs focused, and describe what you checked visually. Please don’t commit `dist/` or `test-output/`.
