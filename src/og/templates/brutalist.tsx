import { Arrow, blockTop, caps } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { measure, wrap } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 21 · Brutalist ─────────────────────────── */

function Brutalist({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const s = o.scale
  const head = blockTop(caps(c.headline), { font: f.display, maxWidth: W - 72, maxLines: 3, max: 196 * s, min: 64, lineHeight: 0.9, tracking: -0.005, top: 92, maxHeight: 400 })
  const box = { x: W - 380, y: H - 230, w: 380, h: 230 }
  const descLines = wrap(c.description, f.monoBold, 16, box.w - 56).slice(0, 5)
  return (
    <Frame background={t.background}>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={t.accent} />
      <Text x={box.x + 28} y={box.y + 46} lines={descLines} font={f.monoBold} size={16} lh={1.45} fill={t.text} />
      <Arrow x={box.x + 50} y={box.y + box.h - 40} size={40} stroke={t.text} width={4} dir={45} />
      <Text x={32} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.005} fill={t.text} />
      {o.showBrand ? (
        <g>
          <Text x={36} y={H - 44} lines={caps(c.name)} font={f.monoBold} size={22} fill={t.text} />
          <rect x={36} y={H - 34} width={Math.min(measure(caps(c.name), f.monoBold, 22), box.x - 80)} height={6} fill={t.text} />
        </g>
      ) : null}
    </Frame>
  )
}

export const brutalist: TemplateDef = {
  id: 'brutalist',
  number: 21,
  name: 'Brutalist',
  collection: 'experimental',
  description: 'Edge-to-edge condensed capitals, a raw black header bar and a signal-orange information block.',
  fonts: {
    display: { family: 'Anton', weight: 400 },
    monoBold: { family: 'JetBrains Mono', weight: 700 },
  },
  theme: { primary: '#0e0e0e', accent: '#ff3d00', background: '#efede8', text: '#0e0e0e' },
  limits: { headline: 40, description: 120 },
  uses: ['category', 'date'],
  render: Brutalist,
}

/** <BrutalistImage /> renders the brutalist template as an SVG (1200×630). */
export function BrutalistImage(props: OgImageProps) {
  return <OgImage template={brutalist} {...props} />
}
