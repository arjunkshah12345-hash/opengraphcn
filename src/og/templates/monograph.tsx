import { AccentTail, BlockText, blockBottom, blockTop, caps, join } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 01 · Monograph ─────────────────────────── */

function Monograph({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const M = 76
  const s = o.scale
  const desc = c.description
    ? blockBottom(c.description, { font: f.body, maxWidth: 640, maxLines: 2, max: 28, min: 20, lineHeight: 1.32, bottom: 522 })
    : null
  const top = 176
  const limit = desc ? desc.y - desc.size - 44 : 520
  const head = blockTop(c.headline, {
    font: f.display,
    maxWidth: 1048,
    maxLines: 3,
    max: 134 * s,
    min: 52,
    lineHeight: 0.98,
    tracking: -0.022,
    top,
    maxHeight: limit - top,
  })
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.07} />
      {o.showBrand ? (
        <g>
          <rect x={M} y={70} width={11} height={11} fill={t.accent} />
          <Text x={M + 24} y={81} lines={caps(c.name)} font={f.label} size={14} tracking={0.22} fill={t.text} />
        </g>
      ) : null}
      {o.showMeta ? <Text x={W - M} y={81} anchor="end" lines={caps(join(['No. 01', c.date], '   —   '))} font={f.label} size={13} tracking={0.2} fill={t.text} opacity={0.6} /> : null}
      <line x1={M} x2={W - M} y1={110} y2={110} stroke={t.text} strokeOpacity={0.22} />
      <AccentTail x={M - 4} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.022} fill={t.text} tail={t.accent} />
      {desc ? <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.72} /> : null}
      <line x1={M} x2={W - M} y1={560} y2={560} stroke={t.text} strokeOpacity={0.22} />
      {o.showMeta ? (
        <g>
          <Text x={M} y={592} lines={caps(c.domain)} font={f.label} size={13} tracking={0.2} fill={t.text} />
          <Text x={W / 2} y={592} anchor="middle" lines={caps(c.category)} font={f.label} size={13} tracking={0.2} fill={t.text} opacity={0.55} />
          <Text x={W - M} y={592} anchor="end" lines={caps(c.author ? `By ${c.author}` : '')} font={f.label} size={13} tracking={0.2} fill={t.text} opacity={0.55} />
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
  description: 'Large serif headline on warm ivory with issue numbering, fine rules and editorial metadata.',
  fonts: {
    display: { family: 'Instrument Serif', weight: 400 },
    label: { family: 'Inter Tight', weight: 600 },
    body: { family: 'Newsreader', weight: 400, style: 'italic' },
  },
  theme: { primary: '#1b1a17', accent: '#d9481f', background: '#f3eee4', text: '#1b1a17' },
  limits: { headline: 60, description: 120 },
  uses: ['date', 'category', 'author'],
  render: Monograph,
}

/** <MonographImage /> renders the monograph template as an SVG (1200×630). */
export function MonographImage(props: OgImageProps) {
  return <OgImage template={monograph} {...props} />
}
