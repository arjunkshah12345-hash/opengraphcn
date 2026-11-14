import { BlockText, blockTop, caps } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix, r2 } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/** smooth closed/open path through points using Catmull-Rom → cubic Bézier */
function smooth(points: [number, number][], closed = false) {
  const p = closed ? [points[points.length - 1], ...points, points[0], points[1]] : [points[0], ...points, points[points.length - 1]]
  let d = `M ${r2(p[1][0])} ${r2(p[1][1])}`
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1]
    const [x1, y1] = p[i]
    const [x2, y2] = p[i + 1]
    const [x3, y3] = p[i + 2]
    d += ` C ${r2(x1 + (x2 - x0) / 6)} ${r2(y1 + (y2 - y0) / 6)}, ${r2(x2 - (x3 - x1) / 6)} ${r2(y2 - (y3 - y1) / 6)}, ${r2(x2)} ${r2(y2)}`
  }
  return closed ? d + ' Z' : d
}

/* ─────────────────────────── 12 · Liquid ─────────────────────────── */

function Liquid({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const s = o.scale
  const cols = [mix(t.primary, t.background, 0.45), t.primary, mix(t.primary, t.accent, 0.5), t.accent, mix(t.accent, '#ffffff', 0.35)]
  const ribbons = cols.map((col, k) => {
    const pts1: [number, number][] = []
    const pts2: [number, number][] = []
    for (let x = -60; x <= W + 60; x += 60) {
      const base = 650 - k * 40 - Math.max(0, x - 520) * 0.5
      const y1 = base + 26 * Math.sin(x / 170 + k * 1.3)
      const th = 64 + 34 * Math.sin(x / 230 + k)
      pts1.push([x, y1])
      pts2.push([x, y1 + th])
    }
    const top = smooth(pts1)
    const bottomPts = [...pts2].reverse()
    const bot = smooth(bottomPts).replace(/^M/, 'L')
    return { d: `${top} ${bot} Z`, hl: top, col, k }
  })
  const head = blockTop(c.headline, { font: f.display, maxWidth: 680, maxLines: 3, max: 76 * s, min: 34, lineHeight: 1.0, tracking: -0.03, top: 128, maxHeight: 190 })
  const desc = blockTop(c.description, { font: f.mono, maxWidth: 560, maxLines: 2, max: 17, min: 14, lineHeight: 1.5, top: head.bottom + 26 })
  return (
    <Frame background={t.background}>
      <defs>
        {ribbons.map((r) => (
          <linearGradient key={r.k} id={`${uid}-r${r.k}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={r.col} stopOpacity={0.2} />
            <stop offset="0.55" stopColor={r.col} />
            <stop offset="1" stopColor={mix(r.col, '#ffffff', 0.25)} />
          </linearGradient>
        ))}
        <filter id={`${uid}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={2} />
        </filter>
      </defs>
      {ribbons.map((r) => (
        <g key={r.k}>
          <path d={r.d} fill={`url(#${uid}-r${r.k})`} opacity={0.92} />
          <path d={r.hl} fill="none" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={1.4} filter={`url(#${uid}-soft)`} transform="translate(0 6)" />
        </g>
      ))}
      <Grain uid={uid} opacity={0.12} blend="overlay" />
      {o.showBrand ? <Text x={72} y={84} lines={caps(c.name)} font={f.mono} size={14} tracking={0.2} fill={t.text} /> : null}
      <Text x={70} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.03} fill={t.text} />
      <BlockText b={desc} x={72} font={f.mono} fill={t.text} opacity={0.7} />
      {o.showMeta ? <Text x={W - 72} y={84} anchor="end" lines={caps(c.domain)} font={f.mono} size={14} tracking={0.2} fill={t.text} opacity={0.7} /> : null}
    </Frame>
  )
}

export const liquid: TemplateDef = {
  id: 'liquid',
  number: 12,
  name: 'Liquid',
  collection: 'abstract',
  description: 'Flowing, layered ribbons of colour with glossy highlights rising across a deep ground.',
  fonts: {
    display: { family: 'Syne', weight: 700 },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#1fc8a9', accent: '#d7f36b', background: '#061716', text: '#f2fbf6' },
  limits: { headline: 56, description: 110 },
  render: Liquid,
}

/** <LiquidImage /> renders the liquid template as an SVG (1200×630). */
export function LiquidImage(props: OgImageProps) {
  return <OgImage template={liquid} {...props} />
}
