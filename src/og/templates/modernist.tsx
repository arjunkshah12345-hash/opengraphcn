import { blockTop, Brand } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

/* ─────────────────────────── 03 · Modernist ─────────────────────────── */

function Modernist({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 72
  const head = blockTop(c.headline, { font: f.display, maxWidth: 900, maxLines: 4, max: 84 * o.scale, min: 40, lineHeight: 1.08, tracking: -0.03, top: 92, maxHeight: 330 })
  const desc = c.description ? blockTop(c.description, { font: f.display, maxWidth: 820, maxLines: 2, max: 40, min: 24, lineHeight: 1.18, tracking: -0.02, top: head.bottom + 22 }) : null
  return (
    <Frame background={t.background}>
      <circle cx={1090} cy={330} r={330} fill={t.accent} />
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.03} fill={t.text} />
      {desc && desc.bottom < 520 ? <Text x={M - 2} y={desc.y} lines={desc.lines} font={f.display} size={desc.size} lh={desc.lh} tracking={-0.02} fill={t.text} opacity={0.45} /> : null}
      {o.showBrand ? <Brand x={M} y={540} size={34} assets={assets} name={c.name} uid={uid} font={f.label} fill={t.text} bg={t.background} shape="circle" /> : null}
    </Frame>
  )
}

export const modernist: TemplateDef = {
  id: 'modernist',
  number: 3,
  name: 'Modernist',
  collection: 'editorial',
  description: 'Black grotesk on white, set loose over one enormous yellow disc.',
  fonts: {
    display: { family: 'Inter Tight', weight: 500 },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#0a0a0a', accent: '#f6f000', background: '#ffffff', text: '#0a0a0a' },
  limits: { headline: 70, description: 90 },
  uses: ['logo'],
  render: Modernist,
}

/** <ModernistImage /> renders the modernist template as an SVG (1200×630). */
export function ModernistImage(props: OgImageProps) {
  return <OgImage template={modernist} {...props} />
}
