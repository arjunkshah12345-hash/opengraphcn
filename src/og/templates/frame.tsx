import { BlockText, blockCenter, blockTop, caps, join } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 20 · Frame ─────────────────────────── */

function FrameTpl({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const s = o.scale
  const head = blockCenter(c.headline, { font: f.display, maxWidth: 860, maxLines: 3, max: 78 * s, min: 36, lineHeight: 1.02, tracking: -0.02, center: 286, maxHeight: 240 })
  const desc = blockTop(c.description, { font: f.italic, maxWidth: 680, maxLines: 2, max: 24, min: 18, lineHeight: 1.35, top: head.bottom + 50 })
  const corner = (x: number, y: number) => <rect key={`${x}-${y}`} x={x - 5} y={y - 5} width={10} height={10} fill={t.background} stroke={t.accent} strokeWidth={1.2} transform={`rotate(45 ${x} ${y})`} />
  return (
    <Frame background={t.background}>
      <rect x={28} y={28} width={W - 56} height={H - 56} fill="none" stroke={t.text} strokeWidth={1.4} />
      <rect x={40} y={40} width={W - 80} height={H - 80} fill="none" stroke={t.text} strokeOpacity={0.45} strokeWidth={0.8} />
      {[corner(40, 40), corner(W - 40, 40), corner(40, H - 40), corner(W - 40, H - 40)]}
      {o.showBrand ? <Text x={W / 2} y={112} anchor="middle" lines={caps(c.name)} font={f.label} size={13} tracking={0.34} fill={t.text} /> : null}
      <Text x={W / 2} y={head.y} anchor="middle" lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.02} fill={t.text} />
      <line x1={W / 2 - 28} x2={W / 2 + 28} y1={head.bottom + 22} y2={head.bottom + 22} stroke={t.accent} strokeWidth={1.4} />
      <BlockText b={desc} x={W / 2} anchor="middle" font={f.italic} fill={t.text} opacity={0.7} />
      {o.showMeta ? <Text x={W / 2} y={H - 92} anchor="middle" lines={caps(join([c.domain, c.date], '   ·   '))} font={f.label} size={12} tracking={0.28} fill={t.text} opacity={0.65} /> : null}
    </Frame>
  )
}

export const frame: TemplateDef = {
  id: 'frame',
  number: 20,
  name: 'Frame',
  collection: 'minimal',
  description: 'A double-ruled frame with diamond corners around a centred, softly weighted serif headline.',
  fonts: {
    display: { family: 'Fraunces', weight: 300 },
    italic: { family: 'Fraunces', weight: 300, style: 'italic' },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#2b2620', accent: '#a0703f', background: '#f6f2ea', text: '#2b2620' },
  limits: { headline: 60, description: 110 },
  uses: ['date'],
  render: FrameTpl,
}

/** <FrameImage /> renders the frame template as an SVG (1200×630). */
export function FrameImage(props: OgImageProps) {
  return <OgImage template={frame} {...props} />
}
