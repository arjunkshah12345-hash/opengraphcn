import { blockTop, Guides, Mark } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

/* ─────────────────────────── 07 · Codebase ─────────────────────────── */

function Codebase({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const G = 56
  const x = 104
  const head = blockTop(c.headline, { font: f.display, maxWidth: 820, maxLines: 3, max: 66 * o.scale, min: 34, lineHeight: 1.08, tracking: -0.035, top: 120, maxHeight: 230 })
  const desc = c.description ? blockTop(c.description, { font: f.body, maxWidth: 860, maxLines: 4, max: 32, min: 22, lineHeight: 1.36, tracking: -0.005, top: head.bottom + 14, maxHeight: 520 - head.bottom - 14 }) : null
  return (
    <Frame background={t.background}>
      <Guides xs={[G, 1200 - G]} ys={[G, 630 - G]} stroke={t.text} opacity={0.16} />
      <Text x={x - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.035} fill={t.text} />
      {desc ? <Text x={x} y={desc.y} lines={desc.lines} font={f.body} size={desc.size} lh={desc.lh} tracking={-0.005} fill={t.text} opacity={0.6} /> : null}
      {o.showBrand ? <Mark x={1200 - G - 76} y={630 - G - 76} size={44} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.display} shape="rounded" /> : null}
    </Frame>
  )
}

export const codebase: TemplateDef = {
  id: 'codebase',
  number: 7,
  name: 'Codebase',
  collection: 'developer',
  description: 'Docs-site calm: a crisp headline and a readable paragraph inside hairline guides on black.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
    body: { family: 'Geist', weight: 400 },
  },
  theme: { primary: '#fafafa', accent: '#fafafa', background: '#0a0a0a', text: '#fafafa' },
  limits: { headline: 50, description: 160 },
  uses: ['logo'],
  render: Codebase,
}

/** <CodebaseImage /> renders the codebase template as an SVG (1200×630). */
export function CodebaseImage(props: OgImageProps) {
  return <OgImage template={codebase} {...props} />
}
