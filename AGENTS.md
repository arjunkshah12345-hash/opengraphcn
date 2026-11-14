# AGENTS.md — opengraphcn

Instructions for coding agents working in this repository.

## Layout
- `src/og/core/` — portable renderer (published to the registry). No Vite-specific imports, no hooks, no `react-dom/server`, no React context: it must run in browsers, Node and React Server Components.
- `src/og/templates/` — one template per file, pure functions of props.
- `src/og/server/render.tsx` — Node renderer (fontkit + resvg), published as the `server` registry item.
- `src/lib/`, `src/pages/`, `src/components/` — the website/Studio (Vite + React + Tailwind v4, hash routing).
- `scripts/build-metrics.mjs` — regenerates `src/og/core/fonts.ts` and `src/lib/font-urls.ts`. Never hand-edit those.
- `scripts/build-registry.mjs` — writes `public/r/*.json` and `registry.json`.

## Rules
- Text layout must go through `core/text.ts` metrics (`fit`, `blockTop`, …). Never measure with canvas/DOM in templates.
- Never invent metrics (stars, forks, users) in templates, docs or the GitHub import.
- Keep the site static (GitHub Pages). No server routes.

## Verify
```bash
npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e
```
`npm test` writes PNGs for every template × {default,long,short,repo} to `test-output/` — inspect them after visual changes.
