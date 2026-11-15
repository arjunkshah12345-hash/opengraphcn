import { BlockText, blockTop, caps, join } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { fitLine } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 19 · Mono ─────────────────────────── */

function Mono({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const M = 72
  const s = o.scale
  const tint = mix(t.background, t.text, 0.62)
  const ghost = fitLine(c.name || ' ', f.display, 420, 120, W + 200, -0.06)
  const head = blockTop(c.headline, { font: f.display, maxWidth: 900, maxLines: 3, max: 104 * s, min: 40, lineHeight: 0.98, tracking: -0.045, top: 150, maxHeight: 290 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 560, maxLines: 2, max: 22, min: 16, lineHeight: 1.4, top: head.bottom + 26 })
  return (
    <Frame background={t.background}>
      <Text x={W - 20} y={H + ghost.size * 0.16} anchor="end" lines={ghost.text} font={f.display} size={ghost.size} tracking={-0.06} fill="none" stroke={t.text} strokeOpacity={0.16} strokeWidth={2} />
      {o.showBrand ? <Text x={M} y={86} lines={c.name} font={f.display} size={22} tracking={-0.02} fill={t.text} /> : null}
      {o.showMeta ? <Text x={W - M} y={86} anchor="end" lines={caps(join([c.category, c.badge], '  /  '))} font={f.body} size={14} tracking={0.12} fill={tint} /> : null}
      <Text x={M - 4} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.045} fill={t.text} />
      {desc.bottom < 560 ? <BlockText b={desc} x={M} font={f.body} fill={tint} /> : null}
    </Frame>
  )
}

export const mono: TemplateDef = {
  id: 'mono',
  number: 19,
  name: 'Mono',
  collection: 'minimal',
  description: 'One colour, every tone: a saturated field with a tinted headline and a ghosted outline of your name.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
    body: { family: 'Geist', weight: 400 },
  },
  theme: { primary: '#2442ff', accent: '#e4e8ff', background: '#2442ff', text: '#f1f3ff' },
  limits: { headline: 60, description: 110 },
  uses: ['category', 'badge'],
  render: Mono,
}

/** <MonoImage /> renders the mono template as an SVG (1200×630). */
export function MonoImage(props: OgImageProps) {
  return <OgImage template={mono} {...props} />
}
