import { BlockText, blockBottom, blockTop, caps, join } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { ellipsize, fitLine, vmetrics } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 25 · Poster ─────────────────────────── */

function Poster({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const s = o.scale
  const name = caps(c.name || 'Poster')
  const nameFit = fitLine(name, f.giant, 230, 60, H - 70, 0)
  const nameCap = vmetrics(f.giant, nameFit.size).cap
  const x0 = 250
  const head = blockTop(c.headline, { font: f.display, maxWidth: 600, maxLines: 4, max: 74 * s, min: 32, lineHeight: 1.0, tracking: -0.03, top: 112, maxHeight: 300 })
  const desc = blockBottom(c.description, { font: f.body, maxWidth: 420, maxLines: 3, max: 18, min: 14, lineHeight: 1.4, bottom: H - 60 })
  return (
    <Frame background={t.background}>
      <circle cx={1060} cy={0} r={250} fill={t.accent} />
      <rect x={810} y={360} width={170} height={170} fill={t.primary} transform="rotate(12 895 445)" />
      <circle cx={1090} cy={520} r={44} fill={t.text} />
      <path d={`M 700 630 A 130 130 0 0 1 960 630 Z`} fill={t.text} opacity={0.08} />
      <rect x={0} y={0} width={200} height={H} fill={t.text} />
      <Text x={0} y={0} lines={nameFit.text} font={f.giant} size={nameFit.size} fill={t.background} transform={`translate(${100 + nameCap / 2} ${H - 36}) rotate(-90)`} />
      <Text x={x0 - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.03} fill={t.text} />
      <BlockText b={desc} x={x0} font={f.body} fill={t.text} opacity={0.8} />
      {o.showMeta ? (
        <g>
          <Text x={x0} y={70} lines={caps(join([c.category, c.date], '   ·   '))} font={f.body} size={13} tracking={0.14} fill={t.text} />
          <Text x={W - 56} y={H - 46} anchor="end" lines={ellipsize(caps(c.domain), f.body, 13, 300)} font={f.body} size={13} tracking={0.14} fill={t.text} />
        </g>
      ) : null}
      {c.badge ? (
        <g>
          <circle cx={1090} cy={520} r={44} fill={t.text} />
          <Text x={1090} y={526} anchor="middle" lines={fitLine(c.badge, f.display, 18, 10, 70).text} font={f.display} size={fitLine(c.badge, f.display, 18, 10, 70).size} fill={t.background} />
        </g>
      ) : null}
    </Frame>
  )
}

export const poster: TemplateDef = {
  id: 'poster',
  number: 25,
  name: 'Poster',
  collection: 'experimental',
  description: 'A gig-poster composition: vertical giant name, colliding primary shapes and an off-axis headline.',
  fonts: {
    display: { family: 'Syne', weight: 800 },
    giant: { family: 'Big Shoulders Display', weight: 900 },
    body: { family: 'Space Grotesk', weight: 500 },
  },
  theme: { primary: '#2c44d1', accent: '#ff5b1f', background: '#ece5d6', text: '#121212' },
  limits: { headline: 56, description: 100 },
  uses: ['badge', 'category', 'date'],
  render: Poster,
}

/** <PosterImage /> renders the poster template as an SVG (1200×630). */
export function PosterImage(props: OgImageProps) {
  return <OgImage template={poster} {...props} />
}
