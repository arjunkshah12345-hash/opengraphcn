import { blockBottom, caps, join } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hueShift, mix, r2 } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 15 · Spectrum ─────────────────────────── */

function Spectrum({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const M = 64
  const s = o.scale
  const n = 18
  const bw = W / n
  const bars = Array.from({ length: n }, (_, i) => {
    const u = i / (n - 1)
    const col = u < 0.5 ? mix(t.accent, t.primary, u * 2) : mix(t.primary, hueShift(t.primary, 40), (u - 0.5) * 2)
    const top = 40 + Math.sin(u * Math.PI * 1.3 + 0.4) * 60 + 40
    return { x: i * bw, col, top }
  })
  const head = blockBottom(caps(c.headline), { font: f.display, maxWidth: W - M * 2, maxLines: 2, max: 150 * s, min: 52, lineHeight: 0.88, tracking: -0.01, bottom: 568, maxHeight: 330 })
  return (
    <Frame background={t.background}>
      <defs>
        {bars.map((b, i) => (
          <linearGradient key={i} id={`${uid}-b${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={b.col} stopOpacity={0} />
            <stop offset="0.35" stopColor={b.col} />
            <stop offset="1" stopColor={mix(b.col, t.background, 0.85)} />
          </linearGradient>
        ))}
        <filter id={`${uid}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
        <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stopColor={t.background} stopOpacity={0} />
          <stop offset="1" stopColor={t.background} stopOpacity={0.92} />
        </linearGradient>
      </defs>
      <g filter={`url(#${uid}-soft)`}>
        {bars.map((b, i) => (
          <rect key={i} x={r2(b.x + 2)} y={r2(b.top)} width={r2(bw - 4)} height={r2(H - b.top)} fill={`url(#${uid}-b${i})`} />
        ))}
      </g>
      <rect width={W} height={H} fill={`url(#${uid}-floor)`} />
      <Grain uid={uid} opacity={0.14} freq={0.8} blend="overlay" />
      {o.showBrand ? <Text x={M} y={74} lines={caps(c.name)} font={f.mono} size={14} tracking={0.16} fill={t.text} /> : null}
      {o.showMeta ? <Text x={W - M} y={74} anchor="end" lines={caps(join([c.badge, c.domain], '  /  '))} font={f.mono} size={14} tracking={0.16} fill={t.text} opacity={0.8} /> : null}
      <Text x={M - 4} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.01} fill={t.text} />
    </Frame>
  )
}

export const spectrum: TemplateDef = {
  id: 'spectrum',
  number: 15,
  name: 'Spectrum',
  collection: 'abstract',
  description: 'Refracted light: softly blurred spectral columns behind a towering condensed headline.',
  fonts: {
    display: { family: 'Big Shoulders Display', weight: 900 },
    mono: { family: 'Geist Mono', weight: 500 },
  },
  theme: { primary: '#ff4f8b', accent: '#4f6bff', background: '#0b0a0f', text: '#ffffff' },
  limits: { headline: 40 },
  uses: ['badge'],
  render: Spectrum,
}

/** <SpectrumImage /> renders the spectrum template as an SVG (1200×630). */
export function SpectrumImage(props: OgImageProps) {
  return <OgImage template={spectrum} {...props} />
}
