import { AccentTail, BlockText, blockBottom, blockTop, caps, join } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 01 · Monograph ─────────────────────────── */

function Monograph({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const M = 80
  const s = o.scale
  const desc = c.description ? blockBottom(c.description, { font: f.body, maxWidth: 620, maxLines: 2, max: 30, min: 21, lineHeight: 1.3, bottom: 514 }) : null
  const top = 150
  const limit = desc ? desc.y - desc.size - 40 : 514
  const head = blockTop(c.headline, { font: f.display, maxWidth: 1040, maxLines: 3, max: 156 * s, min: 56, lineHeight: 0.94, tracking: -0.025, top, maxHeight: limit - top })
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.06} />
      {o.showBrand ? (
        <g>
          <circle cx={M + 6} cy={76} r={6} fill={t.accent} />
          <Text x={M + 22} y={82} lines={c.name} font={f.label} size={19} tracking={-0.01} fill={t.text} />
        </g>
      ) : null}
      {o.showMeta ? <Text x={W - M} y={82} anchor="end" lines={c.date} font={f.body} size={21} fill={t.text} opacity={0.6} /> : null}
      <AccentTail x={M - 5} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.025} fill={t.text} tail={t.accent} />
      {desc ? <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.7} /> : null}
      <line x1={M} x2={W - M} y1={556} y2={556} stroke={t.text} strokeOpacity={0.16} />
      {o.showMeta ? (
        <g>
          <Text x={M} y={590} lines={caps(c.domain)} font={f.label} size={13} tracking={0.16} fill={t.text} />
          <Text x={W - M} y={590} anchor="end" lines={caps(join([c.category, c.author ? `by ${c.author}` : ''], '   ·   '))} font={f.label} size={13} tracking={0.16} fill={t.text} opacity={0.55} />
        </g>
      ) : null}
    </Frame>
  )
}

export const monograph: TemplateDef = {
  id: 'monograph',
  number: 1,
  name: 'Monograph',
  collection: 'editorial',
  description: 'A towering serif headline on warm paper, a single accent dot and quiet italic notes.',
  fonts: {
    display: { family: 'Instrument Serif', weight: 400 },
    label: { family: 'Inter Tight', weight: 600 },
    body: { family: 'Newsreader', weight: 400, style: 'italic' },
  },
  theme: { primary: '#171614', accent: '#e0482a', background: '#f2eee6', text: '#171614' },
  limits: { headline: 60, description: 120 },
  uses: ['date', 'category', 'author'],
  render: Monograph,
}

/** <MonographImage /> renders the monograph template as an SVG (1200×630). */
export function MonographImage(props: OgImageProps) {
  return <OgImage template={monograph} {...props} />
}
