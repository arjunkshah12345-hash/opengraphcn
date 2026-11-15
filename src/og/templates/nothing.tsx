import { AccentTail, BlockText, blockBottom, blockTop, caps, dotGridPath, join } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 16 · Nothing ─────────────────────────── */

function Nothing({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const M = 72
  const s = o.scale
  const desc = c.description ? blockBottom(c.description, { font: f.mono, maxWidth: 520, maxLines: 2, max: 17, min: 14, lineHeight: 1.5, bottom: 562 }) : null
  const head = blockTop(c.headline, { font: f.display, maxWidth: 980, maxLines: 3, max: 112 * s, min: 44, lineHeight: 0.98, tracking: -0.05, top: 168, maxHeight: (desc ? desc.y - desc.size : 560) - 210 })
  return (
    <Frame background={t.background}>
      <path d={dotGridPath({ x: 24, y: 24, w: W - 48, h: H - 48, gap: 16, size: 1.5 })} fill={t.text} opacity={0.09} />
      {o.showBrand ? (
        <g>
          <circle cx={M + 7} cy={78} r={7} fill={t.accent} />
          <Text x={M + 26} y={84} lines={caps(c.name)} font={f.mono} size={16} tracking={0.12} fill={t.text} />
        </g>
      ) : null}
      {o.showMeta ? <Text x={W - M} y={84} anchor="end" lines={caps(c.date)} font={f.mono} size={14} tracking={0.12} fill={t.text} opacity={0.5} /> : null}
      <AccentTail x={M - 5} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.05} fill={t.text} tail={t.accent} />
      {desc ? <BlockText b={desc} x={M} font={f.mono} fill={t.text} opacity={0.55} /> : null}
      {o.showMeta ? <Text x={W - M} y={562} anchor="end" lines={caps(join([c.domain]))} font={f.mono} size={14} tracking={0.12} fill={t.text} opacity={0.5} /> : null}
    </Frame>
  )
}

export const nothing: TemplateDef = {
  id: 'nothing',
  number: 16,
  name: 'Nothing',
  collection: 'minimal',
  description: 'Black glass and a dot grid: one stark grotesk headline, one red dot, nothing else.',
  fonts: {
    display: { family: 'Geist', weight: 500 },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#f5f5f5', accent: '#ff2a1a', background: '#0a0a0a', text: '#f5f5f5' },
  limits: { headline: 60, description: 100 },
  uses: ['date'],
  render: Nothing,
}

/** <NothingImage /> renders the nothing template as an SVG (1200×630). */
export function NothingImage(props: OgImageProps) {
  return <OgImage template={nothing} {...props} />
}
