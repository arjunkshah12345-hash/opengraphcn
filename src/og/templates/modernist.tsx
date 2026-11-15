import { blockTop, caps } from '../core/kit'
import { fitLine } from '../core/text'
import { Frame, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 03 · Modernist ─────────────────────────── */

function Modernist({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const M = 56
  const s = o.scale
  const col = (W - M * 2) / 6
  const head = blockTop(c.headline, { font: f.display, maxWidth: W - M * 2, maxLines: 3, max: 148 * s, min: 56, lineHeight: 0.9, tracking: -0.055, top: 92, maxHeight: 360 })
  const cells = [
    ['Project', o.showBrand ? c.name : ''],
    ['Category', c.category],
    ['Date', c.date],
    ['Web', c.domain],
  ].filter(([, v]) => v && o.showMeta)
  return (
    <Frame background={t.background}>
      {Array.from({ length: 5 }, (_, i) => (
        <line key={i} x1={M + col * (i + 1)} x2={M + col * (i + 1)} y1={0} y2={H} stroke={t.text} strokeOpacity={0.12} />
      ))}
      <rect x={M} y={40} width={col - 16} height={10} fill={t.text} />
      <Text x={M - 6} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.055} fill={t.text} />
      <line x1={M} x2={W - M} y1={520} y2={520} stroke={t.text} strokeWidth={2} />
      {cells.map(([k, v], i) => {
        const x = M + col * (i === 0 ? 0 : i + 2) + (i === 0 ? 0 : 0)
        const maxW = (i === 0 ? col * 3 : col) - 20
        const fl = fitLine(v, f.label, 22, 14, maxW, -0.01)
        return (
          <g key={k}>
            <Text x={x} y={552} lines={caps(k)} font={f.small} size={12} tracking={0.12} fill={t.text} opacity={0.6} />
            <Text x={x} y={586} lines={fl.text} font={f.label} size={fl.size} tracking={-0.01} fill={t.text} />
          </g>
        )
      })}
      {c.description ? (
        (() => {
          const d = blockTop(c.description, { font: f.small, maxWidth: col * 2 - 20, maxLines: 3, max: 19, min: 14, lineHeight: 1.3, top: 418 })
          return d.bottom < 506 ? <Text x={M + col * 4} y={d.y} lines={d.lines} font={f.small} size={d.size} lh={d.lh} fill={t.text} opacity={0.85} /> : null
        })()
      ) : null}
    </Frame>
  )
}

export const modernist: TemplateDef = {
  id: 'modernist',
  number: 3,
  name: 'Modernist',
  collection: 'editorial',
  description: 'International Typographic Style: a huge grotesk headline on signal red, six-column grid and a ruled data row.',
  fonts: {
    display: { family: 'Inter Tight', weight: 800 },
    label: { family: 'Inter Tight', weight: 600 },
    small: { family: 'Inter Tight', weight: 500 },
  },
  theme: { primary: '#111111', accent: '#ffffff', background: '#ff4a1c', text: '#111111' },
  limits: { headline: 50, description: 110 },
  uses: ['category', 'date'],
  render: Modernist,
}

/** <ModernistImage /> renders the modernist template as an SVG (1200×630). */
export function ModernistImage(props: OgImageProps) {
  return <OgImage template={modernist} {...props} />
}
