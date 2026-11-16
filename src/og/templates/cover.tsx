import { blockTop, Brand, ribbonPaths } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { fitLine } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hueShift } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const H = 630
/* ─────────────────────────── 05 · Cover ─────────────────────────── */

function Cover({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const split = 600
  const x = split + 52
  const head = blockTop(c.headline, { font: f.display, maxWidth: 500, maxLines: 4, max: 50 * o.scale, min: 28, lineHeight: 1.04, tracking: -0.025, top: 64, maxHeight: 230 })
  const date = c.date ? fitLine(c.date, f.display, 44, 24, 480, -0.025) : null
  const a = ribbonPaths({ n: 90, from: [-80, 600], ctrl1: [140, -40], ctrl2: [420, 820], to: [700, 60], spread: 420, twist: 1.6 })
  const b = ribbonPaths({ n: 60, from: [-60, 120], ctrl1: [260, 560], ctrl2: [380, -120], to: [680, 520], spread: 260, twist: 0.9 })
  return (
    <Frame background={t.background}>
      <defs>
        <linearGradient id={`${uid}-silk`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={hueShift(t.primary, -40)} />
          <stop offset="0.4" stopColor={t.primary} />
          <stop offset="0.75" stopColor={t.accent} />
          <stop offset="1" stopColor={hueShift(t.accent, 30)} />
        </linearGradient>
        <clipPath id={`${uid}-art`}>
          <rect x={0} y={0} width={split} height={H} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={split} height={H} fill="#ffffff" />
      <g clipPath={`url(#${uid}-art)`} fill="none" stroke={`url(#${uid}-silk)`}>
        {b.map((d, i) => (
          <path key={`b${i}`} d={d} strokeWidth={2.2} strokeOpacity={0.55} />
        ))}
        {a.map((d, i) => (
          <path key={`a${i}`} d={d} strokeWidth={2.4} strokeOpacity={0.85} />
        ))}
      </g>
      <Text x={x - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.025} fill={t.text} />
      {date && o.showMeta ? <Text x={1200 - 64} y={360} anchor="end" lines={date.text} font={f.display} size={date.size} tracking={-0.025} fill={t.text} /> : null}
      {o.showBrand ? <Brand x={x} y={530} size={42} assets={assets} name={c.name} uid={uid} font={f.label} fill={t.text} bg={t.background} /> : null}
    </Frame>
  )
}

export const cover: TemplateDef = {
  id: 'cover',
  number: 5,
  name: 'Cover',
  collection: 'editorial',
  description: 'An event poster: a silk ribbon of hairlines on white beside a deep violet panel with the headline and date.',
  fonts: {
    display: { family: 'Inter Tight', weight: 500 },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#7b3bff', accent: '#ff4f9a', background: '#2a0a5e', text: '#ffffff' },
  limits: { headline: 60 },
  uses: ['date', 'logo'],
  render: Cover,
}

/** <CoverImage /> renders the cover template as an SVG (1200×630). */
export function CoverImage(props: OgImageProps) {
  return <OgImage template={cover} {...props} />
}
