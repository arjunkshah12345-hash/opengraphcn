# React installation

Requires a project set up for the shadcn CLI (`components.json`, `@/` alias).

```bash
npx shadcn@latest add https://arjunkshah12345-hash.github.io/opengraphcn/r/terminal.json
```

Installs `components/opengraphcn/core/*` (shared, once) and `components/opengraphcn/templates/terminal.tsx`.

```tsx
import { TerminalImage } from '@/components/opengraphcn/templates/terminal'

<TerminalImage
  content={{ name, headline, description, domain, author, category, badge, date }}
  theme={{ primary, accent, background, text }}
  options={{ scale: 1, showBrand: true, showMeta: true, displayFont: 'Fraunces' }}
  assets={{ logo, favicon, screenshot, avatar }}
/>
```

Load the template's fonts for correct glyphs in the browser (e.g. `@fontsource/jetbrains-mono`). Line breaks don't depend on font loading — they come from bundled metrics.

Client-side PNG:

```tsx
import { renderPng, download } from '@/components/opengraphcn/core/export'
download(await renderPng(<TerminalImage content={{ name: 'Acme' }} />), 'og.png')
```

Install everything: `npx shadcn@latest add https://arjunkshah12345-hash.github.io/opengraphcn/r/all.json`. Registry index: [https://arjunkshah12345-hash.github.io/opengraphcn/r/registry.json](https://arjunkshah12345-hash.github.io/opengraphcn/r/registry.json).
