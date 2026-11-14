import { BlockText, blockTop, join } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 19 · Mono ─────────────────────────── */

function Mono({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const M = 72
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 760, maxLines: 3, max: 80 * s, min: 36, lineHeight: 1.0, tracking: -0.04, top: 170, maxHeight: 250 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 560, maxLines: 2, max: 21, min: 16, lineHeight: 1.4, top: head.bottom + 28 })
  const arcs = [360, 300, 240, 180, 120, 60]
  return (
    <Frame background={t.background}>
      {arcs.map((r, i) => (
        <circle key={r} cx={W} cy={H} r={r} fill={mix(t.background, t.primary, 0.12 + i * 0.16)} />
      ))}
      <line x1={M} x2={W - M} y1={118} y2={118} stroke={t.text} strokeOpacity={0.25} />
      {o.showBrand ? <Text x={M} y={92} lines={c.name} font={f.display} size={22} tracking={-0.02} fill={t.text} /> : null}
      {o.showMeta ? <Text x={W - M} y={92} anchor="end" lines={join([c.category, c.badge], '  /  ')} font={f.body} size={16} fill={t.text} opacity={0.7} /> : null}
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.04} fill={t.text} />
      <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.75} />
      {o.showMeta ? <Text x={M} y={H - 64} lines={c.domain} font={f.medium} size={17} fill={t.text} /> : null}
    </Frame>
  )
}

export const mono: TemplateDef = {
  id: 'mono',
  number: 19,
  name: 'Mono',
  collection: 'minimal',
  description: 'One hue in disciplined tints: concentric quarter-circles, controlled weights and quiet alignment.',
  fonts: {
    display: { family: 'Space Grotesk', weight: 700 },
    medium: { family: 'Space Grotesk', weight: 500 },
    body: { family: 'Space Grotesk', weight: 400 },
  },
  theme: { primary: '#2b4bd8', accent: '#2b4bd8', background: '#e3e8fb', text: '#16287a' },
  limits: { headline: 60, description: 100 },
  uses: ['category', 'badge'],
  render: Mono,
}

/** <MonoImage /> renders the mono template as an SVG (1200×630). */
export function MonoImage(props: OgImageProps) {
  return <OgImage template={mono} {...props} />
}
