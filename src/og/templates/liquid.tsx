import { blockTop, Brand, ribbonPaths } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hueShift } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

/* ─────────────────────────── 12 · Liquid ─────────────────────────── */

function Liquid({ content: c, theme: t, options: o, fonts: f, uid, assets }: TemplateProps) {
  const M = 72
  const head = blockTop(c.headline, { font: f.display, maxWidth: 560, maxLines: 4, max: 64 * o.scale, min: 30, lineHeight: 1.04, tracking: -0.035, top: 150, maxHeight: 300 })
  const a = ribbonPaths({ n: 110, from: [520, 720], ctrl1: [700, 120], ctrl2: [980, 760], to: [1280, 80], spread: 520, twist: 1.8 })
  const b = ribbonPaths({ n: 70, from: [600, -80], ctrl1: [860, 460], ctrl2: [1000, 40], to: [1300, 520], spread: 300, twist: 1.1 })
  return (
    <Frame background={t.background}>
      <defs>
        <linearGradient id={`${uid}-silk`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={hueShift(t.primary, -50)} />
          <stop offset="0.35" stopColor={t.primary} />
          <stop offset="0.7" stopColor={t.accent} />
          <stop offset="1" stopColor={hueShift(t.accent, 35)} />
        </linearGradient>
        <filter id={`${uid}-bloom`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={14} />
        </filter>
      </defs>
      <g fill="none" stroke={`url(#${uid}-silk)`}>
        <g filter={`url(#${uid}-bloom)`} opacity={0.6}>
          {a.filter((_, i) => i % 6 === 0).map((d, i) => (
            <path key={`g${i}`} d={d} strokeWidth={10} />
          ))}
        </g>
        {b.map((d, i) => (
          <path key={`b${i}`} d={d} strokeWidth={1.6} strokeOpacity={0.45} />
        ))}
        {a.map((d, i) => (
          <path key={`a${i}`} d={d} strokeWidth={1.8} strokeOpacity={0.9} />
        ))}
      </g>
      {o.showBrand ? <Brand x={M} y={66} size={38} assets={assets} name={c.name} uid={uid} font={f.label} fill={t.text} bg={t.background} /> : null}
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.035} fill={t.text} />
    </Frame>
  )
}

export const liquid: TemplateDef = {
  id: 'liquid',
  number: 12,
  name: 'Liquid',
  collection: 'abstract',
  description: 'A twisting silk ribbon of a hundred hairlines in violet and coral, glowing on deep purple.',
  fonts: {
    display: { family: 'Inter Tight', weight: 500 },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#8b3dff', accent: '#ff5fa2', background: '#14072e', text: '#ffffff' },
  limits: { headline: 50 },
  uses: ['logo'],
  render: Liquid,
}

/** <LiquidImage /> renders the liquid template as an SVG (1200×630). */
export function LiquidImage(props: OgImageProps) {
  return <OgImage template={liquid} {...props} />
}
