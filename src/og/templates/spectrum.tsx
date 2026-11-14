import { blockBottom, caps, join } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import { ellipsize } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hash, hueShift, mix, rng } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 15 · Spectrum ─────────────────────────── */

function Spectrum({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const s = o.scale
  const rand = rng(hash('spectrum' + t.primary + t.accent))
  const bands: { x: number; w: number; a: string; b: string }[] = []
  let x = 0
  let i = 0
  while (x < W) {
    const bw = 40 + Math.floor(rand() * 120)
    const tt = i / 12
    const a = mix(hueShift(t.primary, tt * 70 - 20), t.accent, (Math.sin(i * 1.7) + 1) * 0.25)
    const b = mix(hueShift(t.accent, -tt * 60), t.background, 0.15 + rand() * 0.3)
    bands.push({ x, w: bw, a, b })
    x += bw
    i++
  }
  const text = caps(c.headline)
  const head = blockBottom(text, { font: f.display, maxWidth: W - 140, maxLines: 3, max: 150 * s, min: 56, lineHeight: 0.88, tracking: -0.01, bottom: H - 66, maxHeight: 400 })
  return (
    <Frame background={t.background}>
      <defs>
        {bands.map((b, k) => (
          <linearGradient key={k} id={`${uid}-b${k}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={b.a} />
            <stop offset="1" stopColor={b.b} />
          </linearGradient>
        ))}
        <linearGradient id={`${uid}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.3" stopColor={t.background} stopOpacity={0} />
          <stop offset="1" stopColor={t.background} stopOpacity={0.75} />
        </linearGradient>
      </defs>
      {bands.map((b, k) => (
        <rect key={k} x={b.x} y={0} width={b.w + 1} height={H} fill={`url(#${uid}-b${k})`} />
      ))}
      {bands.map((b, k) => (k % 3 === 0 ? <line key={`l${k}`} x1={b.x} x2={b.x} y1={0} y2={H} stroke="#ffffff" strokeOpacity={0.25} /> : null))}
      <rect width={W} height={H} fill={`url(#${uid}-shade)`} />
      <Grain uid={uid} opacity={0.18} blend="overlay" />
      {o.showBrand ? <Text x={70} y={80} lines={caps(c.name)} font={f.mono} size={14} tracking={0.22} fill={t.text} /> : null}
      {o.showMeta ? <Text x={W - 70} y={80} anchor="end" lines={caps(join([c.badge, c.domain], '  /  '))} font={f.mono} size={14} tracking={0.22} fill={t.text} /> : null}
      <Text x={66} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.01} fill={t.text} />
      {c.description && head.y - head.size > 160 ? (
        <Text x={70} y={head.y - head.size - 10} lines={ellipsize(c.description, f.mono, 16, 620)} font={f.mono} size={16} fill={t.text} opacity={0.85} />
      ) : null}
    </Frame>
  )
}

export const spectrum: TemplateDef = {
  id: 'spectrum',
  number: 15,
  name: 'Spectrum',
  collection: 'abstract',
  description: 'Vertical bands of shifting colour with grain and a towering condensed headline.',
  fonts: {
    display: { family: 'Big Shoulders Display', weight: 900 },
    mono: { family: 'Geist Mono', weight: 500 },
  },
  theme: { primary: '#ff5e3a', accent: '#5b6cff', background: '#121016', text: '#ffffff' },
  limits: { headline: 48, description: 80 },
  uses: ['badge'],
  render: Spectrum,
}

/** <SpectrumImage /> renders the spectrum template as an SVG (1200×630). */
export function SpectrumImage(props: OgImageProps) {
  return <OgImage template={spectrum} {...props} />
}
