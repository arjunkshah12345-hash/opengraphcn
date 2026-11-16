import { blockBottom, Brand, caps } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { ellipsize, fitLine } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 09 · Blueprint ─────────────────────────── */

function Blueprint({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 56
  const line = mix(t.background, t.text, 0.12)
  const big = fitLine(c.badge || c.name || ' ', f.display, 240, 90, 700, -0.04)
  const head = blockBottom(c.headline, { font: f.title, maxWidth: 560, maxLines: 2, max: 52 * o.scale, min: 28, lineHeight: 1.06, tracking: -0.03, bottom: 528, maxHeight: 140 })
  const desc = c.description ? ellipsize(c.description, f.body, 18, 620) : ''
  const rows = [
    ['Project', c.name],
    ['Version', c.badge],
    ['Updated', c.date],
    ['Web', c.domain],
  ].filter(([, v]) => v)
  const tx = W - M - 360
  const ty = H - M - rows.length * 34 - 16
  return (
    <Frame background={t.background}>
      {Array.from({ length: 25 }, (_, i) => (
        <line key={`v${i}`} x1={i * 50} x2={i * 50} y1={0} y2={H} stroke={line} />
      ))}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`h${i}`} x1={0} x2={W} y1={i * 50} y2={i * 50} stroke={line} />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <Text key={i} x={M + i * 3.4} y={320 - i * 3.4} lines={big.text} font={f.display} size={big.size} tracking={-0.04} fill={i === 13 ? mix(t.background, t.accent, 0.12) : 'none'} stroke={t.accent} strokeOpacity={i === 13 ? 1 : 0.32} strokeWidth={i === 13 ? 2 : 1.2} />
      ))}
      {o.showBrand ? <Brand x={W - M - 200} y={M + 4} size={34} assets={assets} name={c.name} uid={uid} font={f.title} fill={t.text} bg={t.background} /> : null}
      <Text x={M - 2} y={head.y} lines={head.lines} font={f.title} size={head.size} lh={head.lh} tracking={-0.03} fill={t.text} />
      {desc ? <Text x={M} y={572} lines={desc} font={f.body} size={18} fill={t.text} opacity={0.55} /> : null}
      {o.showMeta ? (
        <g>
          <rect x={tx} y={ty} width={360} height={rows.length * 34 + 16} fill={t.background} stroke={line} strokeWidth={1.5} />
          {rows.map(([k, v], i) => (
            <g key={k}>
              <Text x={tx + 16} y={ty + 32 + i * 34} lines={caps(k)} font={f.mono} size={12} tracking={0.08} fill={t.text} opacity={0.45} />
              <Text x={tx + 344} y={ty + 32 + i * 34} anchor="end" lines={ellipsize(v, f.mono, 15, 230)} font={f.mono} size={15} fill={t.text} />
            </g>
          ))}
        </g>
      ) : null}
    </Frame>
  )
}

export const blueprint: TemplateDef = {
  id: 'blueprint',
  number: 9,
  name: 'Blueprint',
  collection: 'developer',
  description: 'Release notes on a drafting grid: your version extruded in wireframe, with a spec table of real details.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
    title: { family: 'Geist', weight: 500 },
    body: { family: 'Geist', weight: 400 },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#38bdf8', accent: '#38bdf8', background: '#0b1120', text: '#f1f5f9' },
  limits: { headline: 40, description: 80 },
  uses: ['logo', 'badge', 'date'],
  render: Blueprint,
}

/** <BlueprintImage /> renders the blueprint template as an SVG (1200×630). */
export function BlueprintImage(props: OgImageProps) {
  return <OgImage template={blueprint} {...props} />
}
