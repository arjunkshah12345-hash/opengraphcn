import { BlockText, blockBottom, blockTop, caps } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { fitLine } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 03 · Modernist ─────────────────────────── */

function Modernist({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const M = 64
  const s = o.scale
  const col = (W - 2 * M) / 6
  const x2 = M + col * 2
  const desc = c.description ? blockBottom(c.description, { font: f.body, maxWidth: 520, maxLines: 3, max: 21, min: 17, lineHeight: 1.36, bottom: 566 }) : null
  const top = 136
  const head = blockTop(c.headline, {
    font: f.display,
    maxWidth: W - M - x2,
    maxLines: 4,
    max: 98 * s,
    min: 44,
    lineHeight: 0.96,
    tracking: -0.045,
    top,
    maxHeight: (desc ? desc.y - desc.size - 48 : 560) - top,
  })
  const meta = [
    ['Project', c.name],
    ['Category', c.category],
    ['Date', c.date],
    ['Domain', c.domain],
  ].filter(([, v]) => v)
  return (
    <Frame background={t.background}>
      {Array.from({ length: 7 }, (_, i) => (
        <line key={i} x1={M + i * col} x2={M + i * col} y1={0} y2={H} stroke={t.text} strokeOpacity={0.07} />
      ))}
      <line x1={0} x2={W} y1={96} y2={96} stroke={t.text} strokeOpacity={0.07} />
      <rect x={M} y={64} width={col * 2 - 24} height={14} fill={t.accent} />
      <circle cx={W - M - 58} cy={H - 64 - 58} r={58} fill={t.accent} />
      {o.showBrand ? <Text x={M} y={156} lines={c.name} font={f.display} size={24} tracking={-0.02} fill={t.text} /> : null}
      <Text x={M} y={184} lines={c.badge} font={f.body} size={15} fill={t.text} opacity={0.5} />
      <Text x={x2 - 4} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.045} fill={t.text} />
      {desc ? <BlockText b={desc} x={x2} font={f.body} fill={t.text} opacity={0.8} /> : null}
      {o.showMeta
        ? meta.map(([k, v], i) => {
            const y = 566 - (meta.length - 1 - i) * 54
            return (
              <g key={k}>
                <Text x={M} y={y - 22} lines={caps(k)} font={f.body} size={11} tracking={0.16} fill={t.text} opacity={0.45} />
                <Text x={M} y={y} lines={fitLine(v, f.label, 18, 12, col * 2 - 40).text} font={f.label} size={18} fill={t.text} />
              </g>
            )
          })
        : null}
    </Frame>
  )
}

export const modernist: TemplateDef = {
  id: 'modernist',
  number: 3,
  name: 'Modernist',
  collection: 'editorial',
  description: 'Swiss six-column grid, heavy grotesk headline, red signal shapes and a structured metadata stack.',
  fonts: {
    display: { family: 'Inter Tight', weight: 800 },
    label: { family: 'Inter Tight', weight: 600 },
    body: { family: 'Inter Tight', weight: 500 },
  },
  theme: { primary: '#111111', accent: '#e3241b', background: '#eeece6', text: '#111111' },
  limits: { headline: 60, description: 140 },
  uses: ['date', 'category', 'badge'],
  render: Modernist,
}

/** <ModernistImage /> renders the modernist template as an SVG (1200×630). */
export function ModernistImage(props: OgImageProps) {
  return <OgImage template={modernist} {...props} />
}
