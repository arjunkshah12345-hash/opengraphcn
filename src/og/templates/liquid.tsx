import { BlockText, blockTop, caps, join } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hash, r2, rng } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 12 · Liquid ─────────────────────────── */

function contours(seed: number) {
  const rand = rng(seed)
  const p = [rand() * 6, rand() * 6, rand() * 6]
  const lines: string[] = []
  const n = 34
  for (let k = 0; k < n; k++) {
    const base = 150 + k * 15
    let d = ''
    for (let x = -20; x <= W + 20; x += 20) {
      const u = x / W
      const y =
        base +
        Math.sin(u * 4.2 + p[0] + k * 0.11) * (38 + k * 1.6) +
        Math.sin(u * 9.5 + p[1] - k * 0.07) * 12 +
        Math.exp(-(((u - 0.72) / 0.16) ** 2)) * -(70 + k * 2.2) * Math.cos(k * 0.05 + p[2] * 0.1)
      d += `${x === -20 ? 'M' : 'L'}${x} ${r2(y)}`
    }
    lines.push(d)
  }
  return lines
}

function Liquid({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const M = 72
  const s = o.scale
  const lines = contours(hash(c.name || 'liquid'))
  const head = blockTop(c.headline, { font: f.display, maxWidth: 700, maxLines: 3, max: 86 * s, min: 36, lineHeight: 1.0, tracking: -0.035, top: 128, maxHeight: 280 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 520, maxLines: 2, max: 20, min: 15, lineHeight: 1.45, top: head.bottom + 22 })
  return (
    <Frame background={t.background}>
      <defs>
        <linearGradient id={`${uid}-ink`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={t.primary} stopOpacity={0.15} />
          <stop offset="0.55" stopColor={t.primary} />
          <stop offset="1" stopColor={t.accent} />
        </linearGradient>
        <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.background} />
          <stop offset="0.42" stopColor={t.background} stopOpacity={0} />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${uid}-ink)`} strokeWidth={1.3}>
        {lines.map((d, i) => (
          <path key={i} d={d} strokeOpacity={0.25 + (i / lines.length) * 0.75} />
        ))}
      </g>
      <rect width={W} height={H} fill={`url(#${uid}-fade)`} />
      {o.showBrand ? <Text x={M} y={84} lines={caps(c.name)} font={f.mono} size={14} tracking={0.14} fill={t.accent} /> : null}
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.035} fill={t.text} />
      {desc.bottom < 420 ? <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.65} /> : null}
      {o.showMeta ? <Text x={W - M} y={84} anchor="end" lines={join([c.domain, c.date], '   ')} font={f.mono} size={14} fill={t.text} opacity={0.55} /> : null}
    </Frame>
  )
}

export const liquid: TemplateDef = {
  id: 'liquid',
  number: 12,
  name: 'Liquid',
  collection: 'abstract',
  description: 'Hairline contour lines flow like a topographic map beneath a crisp headline on deep teal.',
  fonts: {
    display: { family: 'Hanken Grotesk', weight: 700 },
    body: { family: 'Hanken Grotesk', weight: 400 },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#2fd4b5', accent: '#d9f26b', background: '#04110f', text: '#effaf5' },
  limits: { headline: 55, description: 100 },
  uses: ['date'],
  render: Liquid,
}

/** <LiquidImage /> renders the liquid template as an SVG (1200×630). */
export function LiquidImage(props: OgImageProps) {
  return <OgImage template={liquid} {...props} />
}
