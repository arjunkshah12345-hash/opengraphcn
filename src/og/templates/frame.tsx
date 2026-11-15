import { caps, join } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import { balance, fit, vmetrics } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 20 · Frame ─────────────────────────── */

function FrameTpl({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const s = o.scale
  const B = 34
  const r = fit(c.headline, { font: f.display, maxWidth: 860, maxLines: 3, max: 104 * s, min: 40, lineHeight: 1.0, tracking: -0.02, maxHeight: 300 })
  const lines = r.truncated ? r.lines : balance(c.headline, f.display, r.size, 860, -0.02)
  const cap = vmetrics(f.display, r.size).cap
  const h = cap + (lines.length - 1) * r.size
  const y0 = 316 - h / 2 + cap
  return (
    <Frame background={t.accent}>
      <rect x={B} y={B} width={W - B * 2} height={H - B * 2} fill={t.background} />
      <Grain uid={uid} opacity={0.06} />
      <rect x={B + 16} y={B + 16} width={W - B * 2 - 32} height={H - B * 2 - 32} fill="none" stroke={t.text} strokeOpacity={0.14} />
      {o.showBrand ? <Text x={W / 2} y={118} anchor="middle" lines={caps(c.name)} font={f.label} size={14} tracking={0.36} fill={t.text} opacity={0.8} /> : null}
      <Text x={W / 2} y={y0} anchor="middle" lines={lines} font={f.display} size={r.size} lh={1.0} tracking={-0.02} fill={t.text} />
      {o.showMeta ? <Text x={W / 2} y={530} anchor="middle" lines={join([c.domain, c.date], '   ·   ')} font={f.italic} size={22} fill={t.text} opacity={0.6} /> : null}
    </Frame>
  )
}

export const frame: TemplateDef = {
  id: 'frame',
  number: 20,
  name: 'Frame',
  collection: 'minimal',
  description: 'A gallery mat: centred serif on warm paper inside a thick coloured border and a hairline inset.',
  fonts: {
    display: { family: 'Instrument Serif', weight: 400 },
    italic: { family: 'Instrument Serif', weight: 400, style: 'italic' },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#231f1a', accent: '#1f3d2b', background: '#f4efe6', text: '#231f1a' },
  limits: { headline: 60 },
  uses: ['date'],
  render: FrameTpl,
}

/** <FrameImage /> renders the frame template as an SVG (1200×630). */
export function FrameImage(props: OgImageProps) {
  return <OgImage template={frame} {...props} />
}
