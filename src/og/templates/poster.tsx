import { caps, join } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import { fit } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 25 · Poster ─────────────────────────── */

function Poster({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const M = 56
  const s = o.scale
  const r = fit(caps(c.headline), { font: f.display, maxWidth: 820, maxLines: 4, max: 190 * s, min: 56, lineHeight: 0.86, tracking: -0.005, maxHeight: 520 })
  const y0 = M + r.size * 0.74
  const info = [o.showBrand ? c.name : '', c.date].filter(Boolean)
  return (
    <Frame background={t.background}>
      <circle cx={930} cy={270} r={250} fill={t.accent} />
      <rect x={760} y={380} width={300} height={300} fill={t.primary} style={{ mixBlendMode: 'multiply' }} />
      <Grain uid={uid} opacity={0.1} />
      <Text x={M - 6} y={y0} lines={r.lines} font={f.display} size={r.size} lh={0.86} tracking={-0.005} fill={t.text} />
      <line x1={W - 290} x2={W - M} y1={M} y2={M} stroke={t.text} strokeWidth={2} />
      {info.map((v, i) => (
        <Text key={i} x={W - 290} y={M + 32 + i * 24} lines={caps(v)} font={f.body} size={15} tracking={0.06} fill={t.text} />
      ))}
      {o.showMeta ? <Text x={W - M} y={H - M + 4} anchor="end" lines={caps(join([c.domain]))} font={f.body} size={15} tracking={0.06} fill={t.text} /> : null}
    </Frame>
  )
}

export const poster: TemplateDef = {
  id: 'poster',
  number: 25,
  name: 'Poster',
  collection: 'experimental',
  description: 'A screen-printed gig poster: stacked condensed capitals over an overprinted circle and square.',
  fonts: {
    display: { family: 'Anton', weight: 400 },
    body: { family: 'Space Grotesk', weight: 500 },
  },
  theme: { primary: '#2340d8', accent: '#ff5a1f', background: '#ebe4d4', text: '#141414' },
  limits: { headline: 40 },
  uses: ['badge', 'category', 'date'],
  render: Poster,
}

/** <PosterImage /> renders the poster template as an SVG (1200×630). */
export function PosterImage(props: OgImageProps) {
  return <OgImage template={poster} {...props} />
}
