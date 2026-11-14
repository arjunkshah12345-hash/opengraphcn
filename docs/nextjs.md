# Next.js integration

```bash
npx shadcn@latest add https://arjunkshah12345-hash.github.io/opengraphcn/r/monograph.json https://arjunkshah12345-hash.github.io/opengraphcn/r/server.json
```

```ts
// next.config.ts
import type { NextConfig } from 'next'
const config: NextConfig = { serverExternalPackages: ['@resvg/resvg-js', 'fontkit'] }
export default config
```

```tsx
// app/opengraph-image.tsx
import { monograph } from '@/components/opengraphcn/templates/monograph'
import { renderOgPng } from '@/components/opengraphcn/server/render'

export const runtime = 'nodejs'
export const alt = 'Acme — Build something remarkable.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const png = await renderOgPng(monograph, { content: { name: 'Acme', headline: 'Build something remarkable.' } })
  return new Response(png, { headers: { 'Content-Type': 'image/png' } })
}
```

Notes
- Why not `next/og`? Satori can't render SVG `<text>`, filters or patterns. `renderOgPng` renders the same SVG as the Studio, outlines text with fontkit and rasterizes with resvg.
- Node runtime only (resvg is a native addon). Fonts are fetched once per face from the Fontsource CDN as TTF and cached in memory.
- `fontkit` must be external: it reads data files at runtime.
- Remote image URLs in `assets` are fetched and inlined at render time.
- The Studio's *Export → Next.js* tab generates this file with your exact configuration.
- Verified: `next build` and `next start` on Next.js 16.4 return a 1200×630 PNG at `/opengraph-image`.
